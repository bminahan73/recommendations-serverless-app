import 'source-map-support/register';
import { App, Construct, Stack, StackProps, Duration } from '@aws-cdk/core';
import { StaticSite } from './static-site';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { CognitoAuth } from './cognito-auth';
import path = require('path');

export class RecommendationsAppStack extends Stack {

    baseDomain: string = this.node.tryGetContext('basedomain');
    siteSubDomain: string = this.node.tryGetContext('sitesubdomain');
    authCallbackPath: string = this.node.tryGetContext('authcallbackuri') || 'auth-callback';
    localUiPort: number = this.node.tryGetContext('localuiport') || 3000;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const recommendationsTable = new Table(this, "RecommendationsTable", {
            partitionKey: {
                name: "id",
                type: AttributeType.STRING
            },
            serverSideEncryption: true
        });

        const getRecommendations = new Function(this, "GetRecommendationsFunction", {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(path.join(__dirname, '../../lambdas/get-recommendations/dist')),
            environment: {
                TABLE_NAME: recommendationsTable.tableName
            },
            timeout: Duration.minutes(5)
        });

        recommendationsTable.grantReadData(getRecommendations);

        const makeRecommendations = new Function(this, "MakeRecommendationsFunction", {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(path.join(__dirname, '../../lambdas/make-recommendations/dist')),
            environment: {
                TABLE_NAME: recommendationsTable.tableName
            },
            timeout: Duration.minutes(1)
        });

        recommendationsTable.grantReadWriteData(makeRecommendations);

        const site = new StaticSite(this, 'StaticSite', {
            domainName: this.baseDomain,
            siteSubDomain: this.siteSubDomain,
            contentsDir: path.join(__dirname, '../../frontend/dist')
        });

        const cognitoAuth = new CognitoAuth(this, "CognitoAuth", {
            baseDomain: this.baseDomain,
            authSubDomain: `auth.${this.siteSubDomain}`,
            callbackUrls: [
                `http://localhost:${this.localUiPort}/${this.authCallbackPath}`,
                `https://${site.siteDomain}/${this.authCallbackPath}`
            ]
        });
        // need the A records to be created for the site before Cognito custom domain can be created.
        cognitoAuth.node.addDependency(site);
    }
}

const app = new App();

new RecommendationsAppStack(app, 'RecommendationsAppStack', { env: {
    // Stack must be in us-east-1, because the ACM certificate for a
    // global CloudFront distribution must be requested in us-east-1.
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
}});