# 🚀 JIRA MCP サーバー 完全ガイド - 初心者向け

このガイドでは、Model Context Protocol (MCP) とは何か、このプロジェクトがどのように構成されているか、そして実際にどのように使用するかを詳しく説明します。

## 📚 目次

1. [MCPとは何か？](#mcpとは何か)
2. [このプロジェクトの目的](#このプロジェクトの目的)
3. [ディレクトリ構成の詳細解説](#ディレクトリ構成の詳細解説)
4. [各ファイルの役割](#各ファイルの役割)
5. [セットアップ手順](#セットアップ手順)
6. [実際の使用方法](#実際の使用方法)
7. [トラブルシューティング](#トラブルシューティング)

---

## 🤔 MCPとは何か？

**Model Context Protocol (MCP)** は、AI アシスタント（ChatGPT、Claude など）が外部のツールやサービスと通信するための標準的な方法です。

### 🔄 MCPの仕組み

```
AI アシスタント ←→ MCP サーバー ←→ 外部サービス (Jira)
```

1. **AI アシスタント**: ユーザーと会話し、必要に応じてツールを使用
2. **MCP サーバー**: AI とサービスの間の橋渡し役
3. **外部サービス**: 実際のデータやサービス（この場合は Jira）

### 💡 例：実際の動作

```
ユーザー: "PROJ-123のタスクの詳細を教えて"
    ↓
AI: MCPサーバーの get_jira_issue ツールを呼び出し
    ↓  
MCPサーバー: Jira API にリクエストを送信
    ↓
Jira: タスクデータを返す
    ↓
MCPサーバー: データを整形してAIに返す
    ↓
AI: ユーザーに分かりやすく回答
```

---

## 🎯 このプロジェクトの目的

このプロジェクトは **Jira のタスク情報を取得する MCP サーバー** です。

### できること
- ✅ Jira のタスク（イシュー）の詳細情報を取得
- ✅ スプリント、エピック、ストーリーポイントなどのアジャイル情報も含む
- ✅ AI アシスタントが Jira の情報を理解して回答

### できないこと
- ❌ タスクの作成や編集（読み取り専用）
- ❌ 複数のタスクの一括取得
- ❌ Jira の管理機能

---

## 📁 ディレクトリ構成の詳細解説

```
📁 Jira/                           # プロジェクトのルートフォルダ
├── 📄 package.json                # Node.js プロジェクトの設定ファイル
├── 📄 tsconfig.json               # TypeScript の設定ファイル
├── 📄 README.md                   # プロジェクトの説明文書
├── 📄 copilot-instructions.md     # 開発者向けの指示
├── 📄 JIRA_openapi_spec.json      # Jira API の仕様書
├── 📁 src/                        # ソースコード
│   └── 📄 index.ts                # メインプログラム（TypeScript）
├── 📁 build/                      # コンパイル後のファイル
│   ├── 📄 index.js                # メインプログラム（JavaScript）
│   ├── 📄 index.d.ts              # 型定義ファイル
│   └── 📄 *.map                   # デバッグ用マップファイル
├── 📁 .vscode/                    # VS Code 用設定
│   └── 📄 mcp.json                # MCP サーバーの設定
└── 📁 node_modules/               # インストールされた依存関係
```

---

## 📄 各ファイルの役割

### 🔧 設定ファイル

#### `package.json` - プロジェクトの設定書
```json
{
  "name": "jira-mcp-server",        // プロジェクト名
  "version": "1.0.0",               // バージョン
  "main": "build/index.js",         // メインファイルの場所
  "scripts": {                      // 実行可能なコマンド
    "build": "tsc",                 // TypeScript をコンパイル
    "start": "node build/index.js", // サーバーを開始
    "dev": "tsc && node build/index.js" // ビルド + 開始
  },
  "dependencies": {                 // 必要なライブラリ
    "@modelcontextprotocol/sdk": "^0.5.0",  // MCP の公式ライブラリ
    "zod": "^3.22.0",              // データ検証ライブラリ
    "node-fetch": "^3.3.2"         // HTTP リクエストライブラリ
  }
}
```

#### `tsconfig.json` - TypeScript の設定
```json
{
  "compilerOptions": {
    "target": "ES2022",             // JavaScript のバージョン
    "module": "ESNext",             // モジュールシステム
    "outDir": "./build",            // コンパイル先フォルダ
    "rootDir": "./src"              // ソースコードフォルダ
  }
}
```

### 💻 プログラムファイル

#### `src/index.ts` - メインプログラム

このファイルが MCP サーバーの心臓部です。以下の要素で構成されています：

```typescript
// 1. 必要なライブラリをインポート
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from "zod";

// 2. データの形式を定義（Zod スキーマ）
const JiraConfigSchema = z.object({
  baseUrl: z.string().url(),     // Jira のURL
  email: z.string().email(),     // メールアドレス
  apiToken: z.string()           // API トークン
});

// 3. MCP サーバークラス
class JiraMCPServer {
  // サーバーの設定と初期化
  constructor() { ... }
  
  // 利用可能なツールを定義
  setupToolHandlers() { ... }
  
  // Jira の設定を保存
  configureJira(args) { ... }
  
  // Jira からタスクを取得
  getJiraIssue(args) { ... }
  
  // サーバーを起動
  run() { ... }
}
```

### 📚 ドキュメントファイル

#### `README.md` - プロジェクトの説明書
- プロジェクトの概要
- インストール方法
- 使用方法
- API の説明

#### `JIRA_openapi_spec.json` - Jira API の仕様書
- Jira が提供する API の詳細仕様
- どのような データが取得できるかの定義
- 21,000行以上の詳細な仕様書

### ⚙️ VS Code 設定

#### `.vscode/mcp.json` - MCP サーバーの接続設定
```json
{
  "servers": {
    "jira-mcp-server": {           // サーバー名
      "type": "stdio",             // 通信方式
      "command": "node",           // 実行コマンド
      "args": ["build/index.js"]   // 引数
    }
  }
}
```

---

## 🛠️ セットアップ手順

### ステップ 1: 依存関係のインストール

```bash
# プロジェクトフォルダに移動
cd "d:\Users\ksk01\Documents\develop\vscode_develop\Copilot\Atlassian\Jira"

# 依存関係をインストール
npm install
```

**何が起こる？**
- `node_modules` フォルダが作成される
- `package.json` に記載されたライブラリがダウンロードされる

### ステップ 2: プロジェクトのビルド

```bash
# TypeScript を JavaScript にコンパイル
npm run build
```

**何が起こる？**
- `src/index.ts` → `build/index.js` に変換
- `build` フォルダにコンパイル済みファイルが作成

### ステップ 3: Jira API トークンの準備

1. **Jira にログイン**
   - あなたの Jira インスタンス (`https://your-domain.atlassian.net`) にアクセス

2. **API トークンを作成**
   - アカウント設定 → セキュリティ → API トークン
   - 「トークンを作成」をクリック
   - トークンをコピーして保存

### ステップ 4: サーバーの起動

```bash
# サーバーを起動
npm start
```

**何が起こる？**
- MCP サーバーが起動
- 標準入出力で通信待機状態になる

---

## 🎮 実際の使用方法

### シナリオ：AI アシスタントと会話

#### 1. 設定フェーズ

**ユーザー:** "Jira に接続して"

**AI アシスタント:** MCP の `configure_jira` ツールを使用

```json
{
  "name": "configure_jira",
  "arguments": {
    "baseUrl": "https://your-company.atlassian.net",
    "email": "you@company.com", 
    "apiToken": "ATATT3xFfGF0..."
  }
}
```

**結果:** Jira 接続が設定される

#### 2. タスク取得フェーズ

**ユーザー:** "PROJ-123 のタスクの詳細を教えて"

**AI アシスタント:** MCP の `get_jira_issue` ツールを使用

```json
{
  "name": "get_jira_issue",
  "arguments": {
    "issueIdOrKey": "PROJ-123",
    "expand": "changelog"
  }
}
```

**MCP サーバーの処理:**
1. Jira API にリクエスト送信
2. レスポンスを受信
3. データを整形

**AI への返答例:**
```
# PROJ-123: ユーザー認証機能の実装

**プロジェクト:** Sample Project
**タイプ:** Story
**ステータス:** In Progress
**優先度:** High
**担当者:** 田中花子
**レポーター:** 佐藤太郎
**作成日:** 2024/01/15 10:30
**更新日:** 2024/01/20 14:45

**現在のスプリント:** Sprint 5 (active)
**エピック:** ユーザー管理機能 - ユーザー管理機能の実装
**ストーリーポイント:** 8

**説明:**
新しいユーザー認証システムを実装する必要があります...

**URL:** https://your-company.atlassian.net/rest/agile/1.0/issue/PROJ-123
```

#### 3. AI が理解して回答

**AI アシスタント:** 
"PROJ-123は「ユーザー認証機能の実装」というストーリーで、現在進行中です。担当者は田中花子さんで、8ストーリーポイントの作業です。Sprint 5で取り組まれており、優先度は高く設定されています。"

---

## 🔧 開発とカスタマイズ

### ツールの追加方法

新しい機能を追加したい場合：

#### 1. ツール定義の追加 (`ListToolsRequestSchema` ハンドラー)

```typescript
{
  name: "create_jira_issue",  // 新しいツール名
  description: "新しい Jira イシューを作成",
  inputSchema: {
    // パラメーターの定義
  }
}
```

#### 2. ツール実装の追加 (`CallToolRequestSchema` ハンドラー)

```typescript
case "create_jira_issue":
  return await this.createJiraIssue(request.params.arguments);
```

#### 3. メソッドの実装

```typescript
private async createJiraIssue(args: any) {
  // 実装ロジック
}
```

### デバッグ方法

#### ログの追加
```typescript
console.error("[DEBUG]", "メッセージ", data);
```

#### VS Code でのデバッグ
1. ブレークポイントを設定
2. F5 でデバッグ開始
3. MCP クライアントからリクエスト送信

---

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. "モジュールが見つかりません" エラー
```bash
Error: Cannot find module '@modelcontextprotocol/sdk'
```

**解決方法:**
```bash
npm install
```

#### 2. "認証エラー" 
```
HTTP 401: Unauthorized
```

**原因:**
- API トークンが間違っている
- メールアドレスが間違っている
- Jira インスタンス URL が間違っている

**解決方法:**
- `configure_jira` で正しい情報を再設定

#### 3. "イシューが見つかりません"
```
HTTP 404: Issue does not exist
```

**原因:**
- イシュー ID/キーが間違っている
- アクセス権限がない

**解決方法:**
- 正しいイシューキーを確認
- Jira でアクセス権限を確認

#### 4. TypeScript コンパイルエラー

```bash
npm run build
# エラーが表示される場合
```

**解決方法:**
```bash
# 型定義を再インストール
npm install @types/node --save-dev
```

### ログの確認方法

#### サーバーログ
```bash
npm start
# エラーメッセージが標準エラーに出力される
```

#### 詳細ログの有効化
```typescript
// src/index.ts に追加
console.error("[DEBUG] Request:", request);
console.error("[DEBUG] Response:", response);
```

---

## 📈 次のステップ

### レベル 1: 基本的な使用
- [x] セットアップ完了
- [x] 基本的なタスク取得
- [ ] 様々なイシューで試す

### レベル 2: カスタマイズ
- [ ] 複数イシューの取得機能追加
- [ ] フィルタリング機能追加
- [ ] エラーハンドリングの改善

### レベル 3: 高度な機能
- [ ] イシュー作成機能
- [ ] コメント機能
- [ ] 添付ファイル機能

---

## 🔗 参考リンク

- [Model Context Protocol 公式サイト](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/create-python-server)
- [Jira REST API ドキュメント](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [TypeScript 公式サイト](https://www.typescriptlang.org/)

---

## 💬 質問とサポート

このガイドでわからないことがあれば、いつでも質問してください！

- 「〇〇の部分がわからない」
- 「エラーが出て動かない」  
- 「新しい機能を追加したい」

など、どんな質問でも大歓迎です。
