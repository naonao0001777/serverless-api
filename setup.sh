#!/bin/bash

# スクリプトのディレクトリに移動
cd "$(dirname "$0")"

echo "🚀 Serverless API のセットアップを開始します..."

# 1. CDKインフラストラクチャのセットアップ
echo "📦 CDKインフラストラクチャをセットアップ中..."
cd cdk-infrastructure
npm install
npm run build

# 2. Lambda関数の依存関係をインストール
echo "🔧 Lambda関数の依存関係をインストール中..."
cd lambda
npm install
cd ..

# 3. AWSの設定を確認
echo "🔍 AWS認証情報を確認中..."
if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ AWS認証情報が設定されています"
    
    # 4. CDKをブートストラップ
    echo "🏗️  CDKをブートストラップ中..."
    cdk bootstrap
    
    # 5. スタックをデプロイ
    echo "🚀 CDKスタックをデプロイ中..."
    cdk deploy --require-approval never
    
    # 6. API Gateway URLを取得
    echo "📝 API Gateway URLを取得中..."
    API_URL=$(aws cloudformation describe-stacks --stack-name CdkInfrastructureStack --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' --output text)
    
    if [ ! -z "$API_URL" ]; then
        echo "✅ API Gateway URL: $API_URL"
        
        # 7. フロントエンドの環境変数を設定
        cd ../auth-front
        echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local
        echo "✅ フロントエンドの環境変数を設定しました"
        
        # 8. フロントエンドの依存関係をインストール
        echo "📦 フロントエンドの依存関係をインストール中..."
        npm install
        
        echo ""
        echo "🎉 セットアップ完了！"
        echo ""
        echo "📍 次のステップ:"
        echo "   1. フロントエンドを起動: cd auth-front && npm run dev"
        echo "   2. ブラウザで http://localhost:3000 にアクセス"
        echo "   3. パスワード 'admin123' でテスト"
        echo ""
        echo "🔗 API Endpoint: $API_URL"
    else
        echo "❌ API Gateway URLの取得に失敗しました"
    fi
else
    echo "❌ AWS認証情報が設定されていません"
    echo ""
    echo "📍 AWS認証情報を設定してください:"
    echo "   aws configure"
    echo "   または環境変数:"
    echo "   export AWS_ACCESS_KEY_ID=your-access-key"
    echo "   export AWS_SECRET_ACCESS_KEY=your-secret-key"
    echo "   export AWS_DEFAULT_REGION=ap-northeast-1"
fi
