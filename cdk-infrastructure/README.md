# Serverless Authentication System

DynamoDB、Lambda、API Gatewayを使用したサーバーレス認証システム。

## セットアップ

### 1. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、実際の値を設定してください：

```bash
cp .env.example .env
```

`.env`ファイルの内容を編集：

```bash
# デフォルトリダイレクトURL
DEFAULT_REDIRECT_URL=https://your-actual-redirect-url.com

# デフォルトパスワード
DEFAULT_PASSWORD=your-secure-password
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. AWSデプロイ

```bash
npx cdk deploy
```

### 4. DynamoDBの初期設定

```bash
node scripts/setup-dynamodb.js
```

## セキュリティに関する注意

- `.env`ファイルはGitリポジトリにコミットされません
- すべての機密情報は環境変数で管理されています
- 本番環境では強力なパスワードとHTTPSのリダイレクトURLを使用してください

## ファイル構成

- `auth.js`: Lambda認証関数（GitHub公開可能）
- `scripts/setup-dynamodb.js`: DynamoDB初期化スクリプト（GitHub公開可能）
- `.env`: 機密情報（.gitignoreで除外）
- `.env.example`: 環境変数のテンプレート（GitHub公開可能）

## CDK commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
