#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fetch from "node-fetch";
import { Buffer } from "buffer";

// Jira configuration schema
const JiraConfigSchema = z.object({
  baseUrl: z.string().url(),
  email: z.string().email(),
  apiToken: z.string(),
});

// Issue retrieval schema
const GetIssueArgsSchema = z.object({
  issueIdOrKey: z.string().min(1, "Issue ID or key is required"),
  fields: z.array(z.string()).optional(),
  expand: z.string().optional(),
  updateHistory: z.boolean().optional(),
});

class JiraMCPServer {
  private server: Server;
  private jiraConfig: z.infer<typeof JiraConfigSchema> | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "jira-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error: Error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "configure_jira",
          description: "Configure Jira connection settings (base URL, email, API token)",
          inputSchema: {
            type: "object",
            properties: {
              baseUrl: {
                type: "string",
                format: "uri",
                description: "Jira instance base URL (e.g., https://your-domain.atlassian.net)"
              },
              email: {
                type: "string",
                format: "email", 
                description: "Your Jira account email"
              },
              apiToken: {
                type: "string",
                description: "Your Jira API token"
              }
            },
            required: ["baseUrl", "email", "apiToken"]
          }
        },
        {
          name: "get_jira_issue",
          description: "Get a single Jira issue by ID or key. Returns detailed issue information including Agile fields like sprint, epic, etc.",
          inputSchema: {
            type: "object",
            properties: {
              issueIdOrKey: {
                type: "string",
                description: "The ID or key of the issue to retrieve (e.g., 'PROJ-123' or '10001')"
              },
              fields: {
                type: "array",
                items: { type: "string" },
                description: "Optional list of fields to return. If not specified, all navigable and Agile fields are returned."
              },
              expand: {
                type: "string", 
                description: "Comma-separated list of parameters to expand (e.g., 'changelog,renderedFields')"
              },
              updateHistory: {
                type: "boolean",
                description: "Whether to add this issue to the current user's issue history"
              }
            },
            required: ["issueIdOrKey"]
          }
        }
      ] as Tool[],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      switch (request.params.name) {
        case "configure_jira":
          return await this.configureJira(request.params.arguments);
        case "get_jira_issue":
          return await this.getJiraIssue(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async configureJira(args: any) {
    try {
      const config = JiraConfigSchema.parse(args);
      this.jiraConfig = config;
      
      return {
        content: [
          {
            type: "text",
            text: `Jira configuration updated successfully!\n\nBase URL: ${config.baseUrl}\nEmail: ${config.email}\nAPI Token: [HIDDEN]`
          }
        ]
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid configuration: ${error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        );
      }
      throw error;
    }
  }

  private async getJiraIssue(args: any) {
    if (!this.jiraConfig) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "Jira is not configured. Please use configure_jira tool first."
      );
    }

    try {
      const { issueIdOrKey, fields, expand, updateHistory } = GetIssueArgsSchema.parse(args);
      
      // Build URL with query parameters
      const url = new URL(`${this.jiraConfig.baseUrl}/rest/agile/1.0/issue/${issueIdOrKey}`);
      
      if (fields && fields.length > 0) {
        url.searchParams.append('fields', fields.join(','));
      }
      if (expand) {
        url.searchParams.append('expand', expand);
      }
      if (updateHistory !== undefined) {
        url.searchParams.append('updateHistory', updateHistory.toString());
      }

      // Make API request
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.jiraConfig.email}:${this.jiraConfig.apiToken}`).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.json() as any;
          if (errorBody.message) {
            errorMessage = errorBody.message;
          } else if (errorBody.errorMessages && errorBody.errorMessages.length > 0) {
            errorMessage = errorBody.errorMessages.join(', ');
          }
        } catch {
          // If we can't parse the error response, stick with the status text
        }
        
        throw new McpError(ErrorCode.InternalError, `Failed to fetch issue: ${errorMessage}`);
      }

      const issue = await response.json() as any;
      
      // Format the response nicely
      const summary = this.formatIssueResponse(issue);

      return {
        content: [
          {
            type: "text",
            text: summary
          }
        ]
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid arguments: ${error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        );
      }
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(ErrorCode.InternalError, `Unexpected error: ${error}`);
    }
  }

  private formatIssueResponse(issue: any): string {
    const fields = issue.fields || {};
    const summary = fields.summary || 'No summary';
    const description = fields.description || 'No description';
    const status = fields.status?.name || 'Unknown status';
    const assignee = fields.assignee?.displayName || 'Unassigned';
    const reporter = fields.reporter?.displayName || 'Unknown reporter';
    const priority = fields.priority?.name || 'Unknown priority';
    const issueType = fields.issuetype?.name || 'Unknown type';
    const project = fields.project?.name || 'Unknown project';
    const created = fields.created ? new Date(fields.created).toLocaleString() : 'Unknown';
    const updated = fields.updated ? new Date(fields.updated).toLocaleString() : 'Unknown';

    let result = `# ${issue.key}: ${summary}\n\n`;
    
    result += `**Project:** ${project}\n`;
    result += `**Type:** ${issueType}\n`;
    result += `**Status:** ${status}\n`;
    result += `**Priority:** ${priority}\n`;
    result += `**Assignee:** ${assignee}\n`;
    result += `**Reporter:** ${reporter}\n`;
    result += `**Created:** ${created}\n`;
    result += `**Updated:** ${updated}\n\n`;

    // Agile-specific fields
    if (fields.sprint) {
      const sprint = Array.isArray(fields.sprint) ? fields.sprint[fields.sprint.length - 1] : fields.sprint;
      result += `**Current Sprint:** ${sprint.name} (${sprint.state})\n`;
    }

    if (fields.epic) {
      result += `**Epic:** ${fields.epic.name} - ${fields.epic.summary}\n`;
    }

    if (fields.flagged) {
      result += `**Flagged:** Yes\n`;
    }

    if (fields.storypoints) {
      result += `**Story Points:** ${fields.storypoints}\n`;
    }

    result += `\n**Description:**\n${description}\n`;

    // Add components and labels if present
    if (fields.components && fields.components.length > 0) {
      result += `\n**Components:** ${fields.components.map((c: any) => c.name).join(', ')}\n`;
    }

    if (fields.labels && fields.labels.length > 0) {
      result += `**Labels:** ${fields.labels.join(', ')}\n`;
    }

    // Add URL
    result += `\n**URL:** ${issue.self}\n`;

    return result;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Jira MCP server running on stdio");
  }
}

const server = new JiraMCPServer();
server.run().catch(console.error);
