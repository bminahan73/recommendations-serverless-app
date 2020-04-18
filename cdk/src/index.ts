import 'source-map-support/register';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { StaticSite } from './static-site';
import { HostedZone } from '@aws-cdk/aws-route53';
import { CognitoAuth } from './cognito-auth';
import { join as joinpath } from 'path';
import { Backend } from './backend';

export class RecommendationsAppStack extends Stack {

    baseDomain: string = this.node.tryGetContext('basedomain');
    siteSubDomain: string = this.node.tryGetContext('sitesubdomain');
    authCallbackPath: string = this.node.tryGetContext('authcallbackuri') || 'auth-callback';
    localUiPort: number = this.node.tryGetContext('localuiport') || 3000;

    siteDomain: string = `${this.siteSubDomain}.${this.baseDomain}`;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const zone = HostedZone.fromLookup(this, 'Zone', { domainName: this.baseDomain });

        new Backend(this, 'Backend');

        const site = new StaticSite(this, 'StaticSite', {
            zone: zone,
            siteDomain: this.siteDomain,
            contentsDir: joinpath(__dirname, '../../frontend/build')
        });

        const cognitoAuth = new CognitoAuth(this, "CognitoAuth", {
            zone: zone,
            authDomain: `auth.${this.siteDomain}`,
            callbackUrls: [
                `http://localhost:${this.localUiPort}/${this.authCallbackPath}`,
                `https://${this.siteDomain}/${this.authCallbackPath}`
            ],
            logoutUrls: [
                `http://localhost:${this.localUiPort}`,
                `https://${this.siteDomain}`
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