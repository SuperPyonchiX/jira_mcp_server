# Copilot Instructions for Jira MCP Server

This project is a Model Context Protocol (MCP) server for Jira task management.

## Project Overview

- **Purpose**: Provides AI assistants with tools to retrieve Jira issue information
- **Technology**: TypeScript, Node.js, MCP SDK
- **API**: Jira Software Cloud REST API v1.0.0

## Development Guidelines

1. **Follow MCP Standards**: Use the official MCP SDK patterns and conventions
2. **Type Safety**: Maintain strict TypeScript typing throughout the codebase
3. **Error Handling**: Provide clear, user-friendly error messages
4. **Validation**: Use Zod schemas for input validation
5. **Documentation**: Keep README.md and code comments up to date

## Key Files

- `src/index.ts`: Main MCP server implementation
- `JIRA_openapi_spec.json`: Jira API specification reference
- `package.json`: Dependencies and scripts
- `.vscode/mcp.json`: VS Code MCP integration settings

## MCP SDK Reference

- GitHub: https://github.com/modelcontextprotocol/create-python-server
- Documentation: https://modelcontextprotocol.io

## Testing

To test the server:
1. Build: `npm run build`
2. Run: `npm start`
3. Use MCP-compatible client to test tools

## Adding New Tools

When adding new Jira API endpoints:
1. Reference the OpenAPI spec in `JIRA_openapi_spec.json`
2. Create Zod schemas for validation
3. Add tool definition in `ListToolsRequestSchema` handler
4. Implement tool logic in `CallToolRequestSchema` handler
5. Update README.md with new tool documentation

## Authentication

Uses Jira Basic Authentication with API tokens. Never hardcode credentials - they should be provided via the `configure_jira` tool.
