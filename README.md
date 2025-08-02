# Jira MCP Server

Jira Software Cloud REST APIと連携するModel Context Protocol（MCP）サーバーです。AIアシスタントがJiraからタスク情報を取得できるようにします。

## 📚 ドキュメント

- 📖 **[guide/BEGINNER_GUIDE.md](./guide/BEGINNER_GUIDE.md)** - 完全初心者向けの詳細ガイド（日本語）
- 🧪 **[guide/TESTING_GUIDE.md](./guide/TESTING_GUIDE.md)** - テスト方法とトラブルシューティング（日本語）
- ⚙️ **[guide/CONFIG_EXAMPLES.md](./guide/CONFIG_EXAMPLES.md)** - 設定例とユースケース（日本語）
- 👨‍💻 **[copilot-instructions.md](./copilot-instructions.md)** - 開発者向け指示

## 機能

- **タスク取得**: IDまたはキーによるJira課題の詳細情報取得
- **アジャイル対応**: スプリント、エピック、ストーリーポイント、フラグなどのアジャイル固有フィールドをサポート
- **柔軟な設定**: Jiraインスタンス接続の設定可能
- **フィールド選択**: オプションのフィールドフィルタリングと展開パラメータ

## インストールと利用方法

### 前提条件

- Node.js (v16以降推奨)
- npm または yarn
- Jiraアカウントとアクセス権限
- Jira APIトークン

### ステップ1: リポジトリのクローン

```bash
git clone https://github.com/SuperPyonchiX/jira_mcp_server.git
cd jira_mcp_server
```

### ステップ2: 依存関係のインストール

```bash
npm install
```

### ステップ3: プロジェクトのビルド

```bash
npm run build
```

### ステップ4: Jira APIトークンの準備

1. [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)にアクセス
2. 「Create API token」をクリック
3. トークンの名前を入力（例：「MCP Server」）
4. 生成されたAPIトークンをコピーして保存

### ステップ5: VS Codeでの設定

#### 5-1. VS Code設定ファイルの場所

別プロジェクトでこのMCPサーバーを使用する場合、そのプロジェクトのVS Code設定ファイルに設定を追加します：

**グローバル設定（すべてのプロジェクトで使用）:**
- Windows: `%APPDATA%\Code\User\settings.json`
- macOS: `~/Library/Application Support/Code/User/settings.json`
- Linux: `~/.config/Code/User/settings.json`

**プロジェクト固有設定（推奨）:**
- プロジェクトルートの `.vscode/settings.json`

#### 5-2. settings.jsonへの設定追加

プロジェクトの `.vscode/settings.json` ファイルに以下の設定を追加してください：

```json
{
  "mcp": {
    "inputs": [],
    "servers": {
      "jira": {
        "command": "node",
        "args": ["C:\\path\\to\\jira_mcp_server\\build\\index.js"],
        "env": {
          "NODE_ENV": "production"
        }
      }
    }
  }
}
```

**パスの例（実際のパスに置き換えてください）:**

Windows:
```json
{
  "mcp": {
    "inputs": [],
    "servers": {
      "jira": {
        "command": "node",
        "args": ["C:\\Users\\YourName\\jira_mcp_server\\build\\index.js"],
        "env": {
          "NODE_ENV": "production"
        }
      }
    }
  }
}
```

macOS/Linux:
```json
{
  "mcp": {
    "inputs": [],
    "servers": {
      "jira": {
        "command": "node",
        "args": ["/Users/YourName/jira_mcp_server/build/index.js"],
        "env": {
          "NODE_ENV": "production"
        }
      }
    }
  }
}
```

#### 5-3. 相対パスを使用する場合

もしjira_mcp_serverをプロジェクト内のサブディレクトリに配置する場合：

```json
{
  "mcp": {
    "inputs": [],
    "servers": {
      "jira": {
        "command": "node",
        "args": ["./tools/jira_mcp_server/build/index.js"],
        "env": {
          "NODE_ENV": "production"
        }
      }
    }
  }
}
```

#### 5-4. その他のMCPクライアント設定

**Claude Desktop の場合:**
`%APPDATA%\Claude\claude_desktop_config.json` (Windows) または `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) に：

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["C:\\path\\to\\jira_mcp_server\\build\\index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### ステップ6: VS Codeの再起動と確認

1. VS Codeを再起動してください
2. GitHub Copilot Chatを開いて、`@jira`と入力して補完が表示されることを確認
3. 最初にJira接続を設定してください（使用例を参照）

### ステップ7: 動作確認

VS Code内でGitHub Copilot Chatを使用してJiraサーバーが正常に動作することを確認：

```
@jira configure_jira with baseUrl "https://your-domain.atlassian.net", email "your-email@example.com", apiToken "your-api-token"
```

設定が完了したら、課題を取得してみてください：

```
@jira get issue PROJ-123
```

## 設定方法

サーバーを使用する前に、`configure_jira`ツールを使用してJira接続を設定する必要があります：

- **Base URL**: JiraインスタンスのURL（例：`https://your-domain.atlassian.net`）
- **Email**: JiraアカウントのEメールアドレス
- **API Token**: Jira APIトークン（アカウント設定 → セキュリティ → APIトークンから生成）

## 利用可能なツール

### configure_jira
Jiraインスタンスへの接続を設定します。

**パラメータ:**
- `baseUrl` (必須): JiraインスタンスのベースURL
- `email` (必須): JiraアカウントのEメールアドレス
- `apiToken` (必須): Jira APIトークン

### get_jira_issue
IDまたはキーによって単一のJira課題を取得します。

**パラメータ:**
- `issueIdOrKey` (必須): 課題IDまたはキー（例："PROJ-123"または"10001"）
- `fields` (オプション): 返すフィールド名の配列
- `expand` (オプション): 展開するパラメータのカンマ区切りリスト
- `updateHistory` (オプション): ユーザーの課題履歴に追加するかどうか

**戻り値:**
以下を含む整形された課題情報：
- 基本詳細（要約、説明、ステータス、担当者など）
- アジャイルフィールド（スプリント、エピック、ストーリーポイント、フラグ）
- プロジェクト情報
- タイムスタンプとURL

## 使用例

### 1. Jira接続の設定
```json
{
  "name": "configure_jira",
  "arguments": {
    "baseUrl": "https://your-domain.atlassian.net",
    "email": "your-email@example.com",
    "apiToken": "your-api-token"
  }
}
```

### 2. 課題の取得
```json
{
  "name": "get_jira_issue", 
  "arguments": {
    "issueIdOrKey": "PROJ-123",
    "expand": "changelog"
  }
}
```

## 開発

- `npm run build`: TypeScriptをJavaScriptにコンパイル
- `npm run start`: コンパイル済みサーバーを起動
- `npm run dev`: ビルドと起動を一括実行

## MCP統合

このサーバーはMCP設定で設定することにより、MCP対応AIアシスタントと統合できます。

### VS Code統合（詳細）

#### 1. GitHub Copilot拡張機能の確認
- VS CodeでGitHub Copilot拡張機能がインストール済みであることを確認
- MCP機能が有効になっていることを確認

#### 2. プロジェクト設定
プロジェクトの `.vscode/settings.json` に設定を追加した後：

1. **VS Codeを再起動**
2. **GitHub Copilot Chatを開く** (`Ctrl+Shift+P` → "GitHub Copilot: Open Chat")
3. **Jiraサーバーの確認**: `@jira` と入力して補完候補に表示されることを確認

#### 3. トラブルシューティング
- サーバーが認識されない場合は、パスが正しいか確認
- Node.jsのバージョンが v16以降であることを確認
- `build/index.js` ファイルが存在することを確認

#### 4. 開発者向けデバッグ設定
開発者がデバッグする場合は、`.vscode/mcp.json` 設定ファイルも含まれています。

### Claude Desktop統合

Claude Desktopで使用する場合の設定ファイル場所と内容については、上記のステップ5-4を参照してください。

## 認証

このサーバーはAPIトークンを使用したJiraの基本認証を使用します。以下を確認してください：

1. Atlassianアカウント設定からAPIトークンを生成
2. 認証にはユーザー名ではなくEメールアドレスを使用
3. APIトークンは安全に保管し、バージョン管理にコミットしない

## API リファレンス

Jira Software Cloud REST API v1.0.0に基づいています。このサーバーは個別課題取得用の`/rest/agile/1.0/issue/{issueIdOrKey}`エンドポイントを実装しています。

## ライセンス

MIT License
