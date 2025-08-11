#!/bin/bash

# スクリプトのディレクトリに移動
cd "$(dirname "$0")"

echo "🧹 Serverless API のクリーンアップを開始します..."

# 1. CDKスタックを削除
echo "🗑️  CDKスタックを削除中..."
cd cdk-infrastructure

if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ AWS認証情報が確認されました"
    
    # スタックが存在するかチェック
    if aws cloudformation describe-stacks --stack-name CdkInfrastructureStack > /dev/null 2>&1; then
        echo "📦 CDKスタックを削除中..."
        cdk destroy --force
        echo "✅ CDKスタックが削除されました"
    else
        echo "ℹ️  削除するCDKスタックが見つかりません"
    fi
else
    echo "❌ AWS認証情報が設定されていません"
    echo "   手動でAWSコンソールからリソースを削除してください"
fi

# 2. ローカルファイルのクリーンアップ
echo "🧹 ローカルファイルをクリーンアップ中..."

# フロントエンドの環境変数ファイルを削除
cd ../auth-front
if [ -f ".env.local" ]; then
    rm .env.local
    echo "✅ フロントエンドの環境変数ファイルを削除しました"
fi

# ビルドファイルを削除
cd ../cdk-infrastructure
if [ -d "cdk.out" ]; then
    rm -rf cdk.out
    echo "✅ CDKビルドファイルを削除しました"
fi

echo ""
echo "🎉 クリーンアップ完了！"
echo ""
echo "📍 手動で確認が必要な項目:"
echo "   - AWS DynamoDBテーブル: AuthData"
echo "   - AWS Lambda関数: AuthFunction"
echo "   - AWS API Gateway: ServerlessApi"
echo "   - AWS IAM Role: Lambda実行ロール"
