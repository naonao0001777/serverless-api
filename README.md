# Serverless Authentication API

APIGateway、Lambda、DynamoDBを使用したシンプルな認証システムです。

## 🏗️ アーキテクチャ

```
Frontend (Next.js) → API Gateway → Lambda → DynamoDB
```

- **Next.js フロントエンド**: パスワード認証UI
- **API Gateway**: RESTful APIエンドポイント
- **Lambda関数**: 認証処理ロジック
- **DynamoDB**: 認証情報の永続化

## 📁 プロジェクト構造

```
serverless-api/
├── auth-front/              # Next.jsフロントエンドアプリケーション
│   ├── app/
│   │   └── page.tsx        # 認証フォームコンポーネント
│   └── package.json
├── cdk-infrastructure/      # AWS CDK インフラストラクチャ
│   ├── lib/
│   │   └── cdk-infrastructure-stack.ts  # CDKスタック定義
│   ├── lambda/
│   │   └── auth.js         # 認証Lambda関数
│   └── package.json
├── setup.sh               # 自動セットアップスクリプト
├── cleanup.sh             # クリーンアップスクリプト
└── package.json           # プロジェクトルート設定
```

## 🚀 セットアップ

### 前提条件

- Node.js (v18以上)
- AWS CLI設定済み
- AWS CDK CLI (`npm install -g aws-cdk`)

### 1. AWS認証情報の設定

```bash
aws configure
```

または環境変数で設定:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=ap-northeast-1
```

### 2. 自動セットアップ

```bash
# プロジェクトルートで実行
npm run setup
```

このスクリプトは以下を自動実行します:
- CDKインフラストラクチャのビルド
- Lambda関数の依存関係インストール
- CDKブートストラップ
- AWSリソースのデプロイ
- フロントエンドの環境変数設定

### 3. フロントエンドの起動

```bash
npm run frontend
```

ブラウザで http://localhost:3000 にアクセス

## 🔐 認証仕様

### デフォルト認証情報

- **パスワード**: `admin123`
- 認証成功時のリダイレクト先: `https://example.com/dashboard`

### API エンドポイント

- `POST /auth` - パスワード認証

#### リクエスト例

```json
{
  "password": "admin123"
}
```

#### レスポンス例（成功）

```json
{
  "success": true,
  "message": "パスワードが正しいです",
  "token": "valid-token-1703123456789",
  "redirectUrl": "https://example.com/dashboard"
}
```

#### レスポンス例（失敗）

```json
{
  "success": false,
  "message": "パスワードが間違っています"
}
```

## 🛠️ 開発用コマンド

```bash
# すべての依存関係をインストール
npm run install-all

# CDKのビルドのみ
npm run build

# CDKデプロイのみ
npm run deploy

# フロントエンド起動
npm run frontend

# リソースの削除
npm run cleanup
```

## 🗄️ DynamoDBテーブル構造

### AuthData テーブル

| 属性名 | 型 | 説明 |
|--------|----|----|
| id | String | パーティションキー（固定値: "default"） |
| password | String | 認証用パスワード |
| createdAt | String | 作成日時（ISO形式） |

## 🔧 カスタマイズ

### パスワードの変更

DynamoDBの`AuthData`テーブルで`id="default"`のレコードを更新してください。

### リダイレクト先の変更

`cdk-infrastructure/lambda/auth.js`の`redirectUrl`を変更してください:

```javascript
redirectUrl: 'https://your-domain.com/dashboard'
```

### フロントエンドのカスタマイズ

`auth-front/app/page.tsx`でUIや動作をカスタマイズできます。

- **Frontend**: Next.js アプリケーション (`auth-front/`)
- **Backend**: AWS CDK インフラストラクチャ (`cdk-infrastructure/`)
  - API Gateway: RESTful APIエンドポイント
  - Lambda Functions: 認証とユーザー管理
  - DynamoDB: ユーザーデータと認証情報の保存

## 🧹 クリーンアップ

```bash
npm run cleanup
```

このコマンドは以下を実行します:

- CDKスタックの削除
- ローカルビルドファイルの削除
- 環境変数ファイルの削除

## 📝 ライセンス

ISC License

## ⚠️ 注意事項

- このプロジェクトは開発・学習目的で作成されています
- 本番環境で使用する場合は、セキュリティの強化を行ってください
- AWS使用料金が発生する可能性があります
- DynamoDBテーブルは削除ポリシーが`DESTROY`に設定されています
