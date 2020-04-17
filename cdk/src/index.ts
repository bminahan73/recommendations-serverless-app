import 'source-map-support/register';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { StaticSite } from './static-site';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { UserPool, VerificationEmailStyle } from '@aws-cdk/aws-cognito';
import path = require('path');

export class RecommendationsAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const recommendationsTable = new Table(this, "RecommendationsTable", {
            partitionKey: {
                name: "id",
                type: AttributeType.STRING
            },
            serverSideEncryption: true
        });

        const users = new UserPool(this, "Users", {
            selfSignUpEnabled: true,
            userVerification: {
                emailStyle: VerificationEmailStyle.LINK,
                emailSubject: "bminahan.com Recommendations Registration Confirmation"
            }
        });

        const getRecommendations = new Function(this, "GetRecommendationsFunction", {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(path.join(__dirname, '../../lambdas/get-recommendations/dist')),
            environment: {
                TABLE_NAME: recommendationsTable.tableName
            }
        });

        const makeRecommendations = new Function(this, "MakeRecommendationsFunction", {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(path.join(__dirname, '../../lambdas/make-recommendations/dist')),
            environment: {
                TABLE_NAME: recommendationsTable.tableName
            }
        });

        const site = new StaticSite(this, 'StaticSite', {
            domainName: this.node.tryGetContext('domain'),
            siteSubDomain: this.node.tryGetContext('subdomain'),
            contentsDir: './frontend/dist'
        });
    }
}

const app = new App();

new RecommendationsAppStack(app, 'RecommendationsAppStack', { env: {
    // Stack must be in us-east-1, because the ACM certificate for a
    // global CloudFront distribution must be requested in us-east-1.
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
}});