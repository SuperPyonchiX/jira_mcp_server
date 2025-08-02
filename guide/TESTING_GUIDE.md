# 🧪 MCP サーバー テストガイド

このファイルでは、作成した Jira MCP サーバーを実際にテストする方法を説明します。

## 🚀 クイックスタート

### 1. サーバーの起動

```bash
# プロジェクトフォルダに移動
cd "d:\Users\ksk01\Documents\develop\vscode_develop\Copilot\Atlassian\Jira"

# サーバーを起動
npm start
```

サーバーが正常に起動すると、以下のようなメッセージが表示されます：
```
Jira MCP server running on stdio
```

### 2. MCP クライアントでのテスト

MCP サーバーはコマンドラインから直接テストできます。

#### テスト用の JSON メッセージ

**利用可能なツールを確認:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

**Jira 設定:**
```json
{
  "jsonrpc": "2.0", 
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "configure_jira",
    "arguments": {
      "baseUrl": "https://your-domain.atlassian.net",
      "email": "your-email@example.com",
      "apiToken": "your-api-token-here"
    }
  }
}
```

**イシュー取得:**
```json
{
  "jsonrpc": "2.0",
  "id": 3, 
  "method": "tools/call",
  "params": {
    "name": "get_jira_issue",
    "arguments": {
      "issueIdOrKey": "PROJ-123"
    }
  }
}
```

## 🔧 開発者向けテスト

### デバッグモードでの実行

TypeScript を直接実行してデバッグ：

```bash
# TypeScript を監視モードでコンパイル（別ターミナル）
npx tsc --watch

# メインターミナルでサーバー実行
npm run dev
```

### ログレベルの調整

`src/index.ts` にデバッグログを追加：

```typescript
// リクエスト受信時のログ
console.error(`[DEBUG] Tool called: ${request.params.name}`);
console.error(`[DEBUG] Arguments:`, JSON.stringify(request.params.arguments, null, 2));

// Jira API 呼び出し前のログ  
console.error(`[DEBUG] Calling Jira API: ${url.toString()}`);

// レスポンス受信時のログ
console.error(`[DEBUG] Jira response status: ${response.status}`);
```

## 🎯 実際の使用シナリオ

### シナリオ 1: 基本的なタスク取得

1. **前提条件**
   - Jira インスタンスにアクセス可能
   - 有効な API トークンがある
   - 閲覧可能なイシューが存在する

2. **手順**
   ```bash
   # 1. サーバー起動
   npm start
   
   # 2. 設定（実際の値に置き換え）
   # configure_jira ツールを呼び出し
   
   # 3. テスト
   # get_jira_issue ツールで既知のイシューを取得
   ```

3. **期待する結果**
   - イシューの詳細情報が整形されて返される
   - エラーが発生しない

### シナリオ 2: エラーハンドリングのテスト

1. **不正な設定のテスト**
   ```json
   {
     "name": "configure_jira",
     "arguments": {
       "baseUrl": "invalid-url",
       "email": "invalid-email",
       "apiToken": ""
     }
   }
   ```

2. **存在しないイシューのテスト**
   ```json
   {
     "name": "get_jira_issue", 
     "arguments": {
       "issueIdOrKey": "NONEXISTENT-999"
     }
   }
   ```

3. **期待する結果**
   - 適切なエラーメッセージが返される
   - サーバーがクラッシュしない

## 📊 パフォーマンステスト

### レスポンス時間の測定

```typescript
// src/index.ts に追加
private async getJiraIssue(args: any) {
  const startTime = Date.now();
  
  try {
    // 既存の処理...
    
    const endTime = Date.now();
    console.error(`[PERF] Request took ${endTime - startTime}ms`);
    
    return result;
  } catch (error) {
    const endTime = Date.now();
    console.error(`[PERF] Failed request took ${endTime - startTime}ms`);
    throw error;
  }
}
```

### メモリ使用量の監視

```typescript
// メモリ使用量をログ出力
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.error(`[MEMORY] RSS: ${Math.round(memUsage.rss / 1024 / 1024)}MB`);
}, 30000); // 30秒ごと
```

## 🔍 トラブルシューティング・チェックリスト

### ✅ サーバー起動時

- [ ] `npm install` が成功している
- [ ] `npm run build` が成功している  
- [ ] `build/index.js` ファイルが存在する
- [ ] ポート競合がない

### ✅ Jira 接続時

- [ ] Jira インスタンス URL が正しい（https://で始まる）
- [ ] メールアドレスが正しい
- [ ] API トークンが有効（期限切れでない）
- [ ] ネットワーク接続が正常

### ✅ イシュー取得時

- [ ] イシューキーの形式が正しい（例：PROJ-123）
- [ ] イシューが存在する
- [ ] イシューへの閲覧権限がある
- [ ] プロジェクトへのアクセス権限がある

## 🚀 本番環境での使用

### 環境変数の使用

本番環境では、認証情報を環境変数で管理：

```typescript
// 環境変数から設定を読み込み
const defaultConfig = {
  baseUrl: process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN
};
```

### セキュリティ考慮事項

1. **API トークンの保護**
   - 環境変数やセキュアなストレージに保存
   - ログに出力しない
   - 定期的にローテーション

2. **通信の暗号化**
   - HTTPS を使用（Jira Cloud は標準で HTTPS）
   - 証明書の検証を有効化

3. **アクセス制御**
   - 必要最小限の権限でJiraにアクセス
   - 定期的な権限レビュー

## 📈 パフォーマンス最適化

### キャッシュの実装

```typescript
private issueCache = new Map<string, any>();
private cacheExpiry = new Map<string, number>();

private getCachedIssue(issueKey: string): any | null {
  const expiry = this.cacheExpiry.get(issueKey);
  if (expiry && Date.now() < expiry) {
    return this.issueCache.get(issueKey) || null;
  }
  return null;
}

private setCachedIssue(issueKey: string, issue: any): void {
  this.issueCache.set(issueKey, issue);
  this.cacheExpiry.set(issueKey, Date.now() + 5 * 60 * 1000); // 5分キャッシュ
}
```

### リクエストのバッチ処理

複数イシューを一度に取得する場合の実装例：

```typescript
private async getMultipleIssues(issueKeys: string[]): Promise<any[]> {
  // JQL を使用して複数イシューを一度に取得
  const jql = `key in (${issueKeys.join(', ')})`;
  // 実装...
}
```

これで、初心者の方でも MCP サーバーの仕組みを理解し、実際に使用・テスト・カスタマイズできるようになります！
