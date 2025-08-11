# 環境変数設定手順

## ローカル開発環境

### 1. .env.localファイルの作成

`auth-front/.env.local`ファイルを作成し、以下を追加：

```bash
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/prod/
```

**注意**: この値は実際のAPI Gateway URLに置き換えてください。

## Vercel本番環境

### 方法1: Vercel Dashboard（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 新しい環境変数を追加：
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-api-gateway-url.amazonaws.com/prod/`
   - **Environment**: Production, Preview, Development すべて選択

### 方法2: Vercel CLI

```bash
npx vercel env add NEXT_PUBLIC_API_URL
# プロンプトで値を入力し、環境を選択
```

## セキュリティ注意事項

- ❌ **絶対にしてはいけないこと**:
  - 機密情報を`vercel.json`に記載
  - API URLやキーをGitHubにコミット
  - 環境変数を平文でコードに含める

- ✅ **推奨する方法**:
  - Vercel Dashboardで環境変数を設定
  - `.env.local`はローカル開発のみ（.gitignoreで除外済み）
  - 機密情報は設定手順書として別途管理
