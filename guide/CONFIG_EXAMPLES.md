# 📝 設定サンプル集

このファイルには、Jira MCP サーバーを使用するための様々な設定例が含まれています。

## 🔧 基本設定

### Claude Desktop での設定

`~/.config/claude/claude_desktop_config.json` (Mac/Linux)
または
`%APPDATA%\Claude\claude_desktop_config.json` (Windows)

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["d:/Users/ksk01/Documents/develop/vscode_develop/Copilot/Atlassian/Jira/build/index.js"]
    }
  }
}
```

### VS Code GitHub Copilot での設定

**重要：サーバーを手動で起動する必要はありません！**

VS Code GitHub Copilot が自動的にサーバーを起動・終了します。

#### 方法1: VS Code設定ファイル
`.vscode/settings.json`
```json
{
  "github.copilot.chat.mcp.servers": {
    "jira-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

#### 方法2: 既存のMCP設定ファイル（推奨）
`.vscode/mcp.json` (既に作成済み)
```json
{
  "servers": {
    "jira-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"]
    }
  }
}
```

#### 方法3: 他のプロジェクトから参照
別のプロジェクトのVS Codeから使用する場合：
```json
{
  "servers": {
    "jira-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["d:/Users/ksk01/Documents/develop/vscode_develop/Copilot/Atlassian/Jira/build/index.js"]
    }
  }
}
```

#### 方法4: 共有MCP サーバー設置
```json
{
  "servers": {
    "jira-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/shared/mcp-servers/jira/build/index.js"]
    }
  }
}
```

## 🚀 実際の使用手順

### VS Code GitHub Copilot での使用

1. **設定完了後の使用方法**
   ```
   プロジェクトをビルド → VS Codeでプロジェクトを開く → Copilotチャットで質問
   ```

2. **具体的な手順**
   ```bash
   # 1. プロジェクトをビルド（一度だけ）
   npm run build
   
   # 2. VS Code でプロジェクトフォルダを開く
   # 3. GitHub Copilot チャットを開く (Ctrl+Shift+I)
   # 4. 普通に質問する
   ```

3. **Copilot チャットでの質問例**
   ```
   「PROJ-123のタスクの詳細を教えて」
   「まずJiraに接続してから、DEV-456の情報を取得して」
   「バグ BUG-789 のステータスはどうなってる？」
   ```

4. **自動的に起こること**
   - Copilot が MCP サーバーを起動
   - 必要に応じて `configure_jira` ツールで設定要求
   - `get_jira_issue` ツールでデータ取得
   - 結果を自然な日本語で回答
   - サーバーは自動終了

### 🔑 重要なポイント

- ✅ **サーバーの手動起動は不要**
- ✅ **設定は一度だけ**（`.vscode/mcp.json`は既に作成済み）
- ✅ **プロジェクトのビルドは必須**（`npm run build`）
- ✅ **VS Code でプロジェクトフォルダを開く**
- ✅ **普通にCopilotチャットで質問するだけ**

### 📊 動作の流れ（自動）

```
ユーザー: 「PROJ-123の詳細を教えて」
    ↓
GitHub Copilot: MCPサーバーが必要と判断
    ↓
VS Code: `node build/index.js` を自動実行
    ↓
MCPサーバー: 起動完了、通信待機
    ↓
Copilot: `get_jira_issue` ツールを呼び出し
    ↓
MCPサーバー: Jira APIにリクエスト
    ↓
Jira: データを返す
    ↓
MCPサーバー: データを整形してCopilotに返す
    ↓
Copilot: 自然な日本語で回答
    ↓
MCPサーバー: 自動終了
```

### ⚠️ よくある誤解

| ❌ 誤解 | ✅ 実際 |
|---------|---------|
| サーバーを手動で起動する | VS Codeが自動で起動・終了 |
| `npm start` を実行し続ける | ビルドだけすればOK |
| 設定が複雑 | `.vscode/mcp.json`だけ |
| コマンドラインで操作 | Copilotチャットで普通に会話 |

## 📁 ポータブル使用・共有設定

### 🔄 他の場所での使用

**正確には**：MCPサーバーには複数のファイルが必要です。

#### 必要なファイル（完全版）
```
📁 任意のフォルダ/
├── 📄 build/index.js      # ← 必須（コンパイル済みサーバー）
├── 📄 package.json        # ← 必須（プロジェクト情報）
└── 📁 node_modules/       # ← 必須（依存関係）
    ├── @modelcontextprotocol/
    ├── zod/
    ├── node-fetch/
    └── ...その他の依存関係
```

#### なぜ全て必要なのか？

1. **`build/index.js`**: 実際のプログラム
2. **`package.json`**: Node.jsがプロジェクト情報を読み取るため
3. **`node_modules/`**: プログラムが使用するライブラリ群

#### つまり...
- ❌ ~~`build/index.js` だけで動作~~
- ✅ **3つのファイル/フォルダがすべて必要**

#### 共有フォルダへの設置例（正確な手順）
```bash
# 共有フォルダを作成
mkdir "C:\shared\mcp-servers\jira"

# 必要ファイルをすべてコピー
copy "build\index.js" "C:\shared\mcp-servers\jira\"
copy "package.json" "C:\shared\mcp-servers\jira\"
xcopy "node_modules" "C:\shared\mcp-servers\jira\node_modules\" /E /I

# または、プロジェクト全体をコピーしてbuild/以外を削除
xcopy "." "C:\shared\mcp-servers\jira\" /E /I
```

#### 簡単な方法：プロジェクト全体をコピー
```bash
# プロジェクト全体をコピー（推奨）
xcopy "d:\Users\ksk01\Documents\develop\vscode_develop\Copilot\Atlassian\Jira" "C:\shared\mcp-servers\jira\" /E /I
```

#### 最小構成での移動
```bash
# 1. 新しいフォルダで npm install を実行する方法
mkdir "C:\shared\mcp-servers\jira"
copy "build\index.js" "C:\shared\mcp-servers\jira\"
copy "package.json" "C:\shared\mcp-servers\jira\"
cd "C:\shared\mcp-servers\jira"
npm install  # ← これで node_modules が自動作成される
```

#### 異なるプロジェクトからの参照
```json
{
  "servers": {
    "jira-mcp-server": {
      "type": "stdio", 
      "command": "node",
      "args": ["C:/shared/mcp-servers/jira/build/index.js"]
    }
  }
}
```

### 🌍 チーム共有設定

#### チーム内での標準パス
```json
{
  "servers": {
    "jira-mcp-server": {
      "type": "stdio",
      "command": "node", 
      "args": ["//server/shared/mcp-servers/jira/build/index.js"]
    }
  }
}
```

#### 環境変数を使用した柔軟な設定
```json
{
  "servers": {
    "jira-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["${env:MCP_JIRA_PATH}/build/index.js"]
    }
  }
}
```

対応する環境変数設定：
```bash
# Windows
set MCP_JIRA_PATH=C:\shared\mcp-servers\jira

# Mac/Linux  
export MCP_JIRA_PATH=/shared/mcp-servers/jira
```

## 🌐 環境別設定例

### 開発環境
```json
{
  "name": "configure_jira",
  "arguments": {
    "baseUrl": "https://dev-company.atlassian.net",
    "email": "developer@company.com",
    "apiToken": "ATATT3xFfGF0T..." 
  }
}
```

### ステージング環境
```json
{
  "name": "configure_jira",
  "arguments": {
    "baseUrl": "https://staging-company.atlassian.net", 
    "email": "staging@company.com",
    "apiToken": "ATATT3xFfGF0S..."
  }
}
```

### 本番環境
```json
{
  "name": "configure_jira",
  "arguments": {
    "baseUrl": "https://company.atlassian.net",
    "email": "prod@company.com", 
    "apiToken": "ATATT3xFfGF0P..."
  }
}
```

## 🔍 検索・取得パターン

### 基本的なイシュー取得
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "PROJ-123"
  }
}
```

### 特定フィールドのみ取得
```json
{
  "name": "get_jira_issue", 
  "arguments": {
    "issueIdOrKey": "PROJ-123",
    "fields": ["summary", "status", "assignee", "priority"]
  }
}
```

### 拡張情報付きで取得
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "PROJ-123",
    "expand": "changelog,renderedFields,comments"
  }
}
```

### 履歴更新付きで取得
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "PROJ-123", 
    "updateHistory": true
  }
}
```

## 🏢 組織・チーム別設定

### スクラムチーム設定
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "SCRUM-456",
    "fields": [
      "summary", "status", "assignee", "sprint", 
      "storypoints", "epic", "components"
    ],
    "expand": "changelog"
  }
}
```

### サポートチーム設定  
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "SUP-789",
    "fields": [
      "summary", "description", "status", "priority", 
      "reporter", "assignee", "created", "updated"
    ],
    "expand": "comments"
  }
}
```

### 開発チーム設定
```json
{
  "name": "get_jira_issue", 
  "arguments": {
    "issueIdOrKey": "DEV-101",
    "fields": [
      "summary", "status", "assignee", "fixVersions",
      "components", "labels", "timetracking"
    ],
    "expand": "renderedFields"
  }
}
```

## 🚨 エラーハンドリング例

### 設定エラーのテスト
```json
{
  "name": "configure_jira",
  "arguments": {
    "baseUrl": "not-a-valid-url",
    "email": "not-an-email", 
    "apiToken": ""
  }
}
```

予想される応答：
```json
{
  "error": {
    "code": -32602,
    "message": "Invalid configuration: baseUrl: Invalid url, email: Invalid email, apiToken: String must contain at least 1 character(s)"
  }
}
```

### 未設定状態でのイシュー取得
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "TEST-123"
  }
}
```

予想される応答：
```json
{
  "error": {
    "code": -32600,
    "message": "Jira is not configured. Please use configure_jira tool first."
  }
}
```

## 🎯 使用ケース別設定

### 日次スタンドアップ用
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "DAILY-001",
    "fields": ["summary", "status", "assignee", "progress"],
    "expand": "changelog"
  }
}
```

### スプリントレビュー用
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "SPRINT-001", 
    "fields": [
      "summary", "description", "status", "storypoints",
      "timetracking", "sprint", "epic"
    ],
    "expand": "renderedFields,comments"
  }
}
```

### バグトリアージ用
```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "BUG-001",
    "fields": [
      "summary", "description", "status", "priority", 
      "severity", "reporter", "assignee", "environment"
    ],
    "expand": "comments,changelog"
  }
}
```

## 🔒 セキュリティ設定

### API トークンの管理

**❌ 悪い例：**
```json
{
  "apiToken": "ATATT3xFfGF0T8X9Y7Z6W5V4U3S2R1Q0P9O8N7M6L5K4J3I2H1"
}
```

**✅ 良い例：**
```bash
# 環境変数で管理
export JIRA_API_TOKEN="ATATT3xFfGF0T8X9Y7Z6W5V4U3S2R1Q0P9O8N7M6L5K4J3I2H1"
export JIRA_BASE_URL="https://company.atlassian.net"
export JIRA_EMAIL="user@company.com"
```

### 最小権限の原則

Jira での権限設定：
- 必要なプロジェクトのみ閲覧可能
- イシューの作成・編集は必要な場合のみ
- 管理者権限は避ける

## 📊 監視・ログ設定

### 詳細ログの有効化

環境変数での制御：
```bash
export DEBUG=true
export LOG_LEVEL=debug
```

対応するコード例：
```typescript
const DEBUG = process.env.DEBUG === 'true';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

if (DEBUG) {
  console.error(`[DEBUG] ${message}`);
}
```

### パフォーマンス監視
```typescript
// リクエスト時間の記録
const startTime = Date.now();
// ... API call ...
const duration = Date.now() - startTime;
console.error(`[PERF] API call took ${duration}ms`);
```

これらの設定例を参考に、あなたの環境や使用ケースに合わせてカスタマイズしてください！

---

## 🔧 MCPサーバーの移動・共有の正しい手順

### 💡 重要な修正

**間違い**：「`build/index.js` さえあればどこでも動作」
**正解**：「3つのファイル/フォルダがすべて必要」

### 📁 移動時に必要なもの（完全版）

```
📁 移動先フォルダ/
├── 📄 build/index.js      # メインプログラム
├── 📄 package.json        # プロジェクト設定
└── 📁 node_modules/       # 依存ライブラリ（約44個のパッケージ）
```

### 🚀 実際の移動手順

#### 方法1: プロジェクト全体をコピー（推奨）
```bash
# 一番確実で簡単
xcopy "d:\Users\ksk01\Documents\develop\vscode_develop\Copilot\Atlassian\Jira" "C:\shared\mcp-servers\jira\" /E /I
```

#### 方法2: 必要最小限をコピー + npm install
```bash
mkdir "C:\shared\mcp-servers\jira"
copy "build\index.js" "C:\shared\mcp-servers\jira\"
copy "package.json" "C:\shared\mcp-servers\jira\"
cd "C:\shared\mcp-servers\jira"
npm install  # node_modules を再作成
```

#### 方法3: 手動で全てコピー
```bash
xcopy "build" "C:\shared\mcp-servers\jira\build\" /E /I
xcopy "node_modules" "C:\shared\mcp-servers\jira\node_modules\" /E /I
copy "package.json" "C:\shared\mcp-servers\jira\"
```

### ✅ 正しい理解

- **MCPサーバーはポータブル**だが、**複数ファイルが必要**
- **どこでも動作する**が、**3点セットを移動する必要がある**
- **設定でパスを指定**すれば、**どこからでも使用可能**
