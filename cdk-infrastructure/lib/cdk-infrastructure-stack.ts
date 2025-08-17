import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class CdkInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 認証情報テーブルの作成
    const authTable = new dynamodb.Table(this, 'AuthTable', {
      tableName: 'AuthData',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda関数用のロール作成
    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

        // DynamoDBアクセス権限をLambdaに付与
    authTable.grantReadWriteData(lambdaRole);

    // Lambda関数の作成
    const authFunction = new lambda.Function(this, 'AuthFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'auth.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      role: lambdaRole,
      environment: {
        AUTH_TABLE_NAME: authTable.tableName,
        DEFAULT_REDIRECT_URL: process.env.DEFAULT_REDIRECT_URL || 'https://example.com/default',
        DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD || 'default123',
      },
    });

    // API Gatewayの作成
    const api = new apigateway.RestApi(this, 'ServerlessApi', {
      restApiName: 'Serverless Auth API',
      description: 'API Gateway with Lambda and DynamoDB for authentication',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // API Gatewayのリソースとメソッドの作成
    const authResource = api.root.addResource('auth');
    authResource.addMethod('POST', new apigateway.LambdaIntegration(authFunction));

    // 出力
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'AuthTableName', {
      value: authTable.tableName,
      description: 'DynamoDB Auth Table Name',
    });
  }
}
