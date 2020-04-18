import { ARecord, RecordTarget, IHostedZone } from '@aws-cdk/aws-route53';
import { Construct, Duration, CfnOutput } from '@aws-cdk/core';
import { UserPool, VerificationEmailStyle, CfnUserPoolDomain, UserPoolClient, OAuthScope, CfnUserPoolResourceServer, CfnIdentityPool, CfnUserPoolClient } from '@aws-cdk/aws-cognito';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';

export type CognitoAuthProps = {
    zone: IHostedZone,
    authDomain: string;
    callbackUrls: string[];
    logoutUrls: string[];
}

export class CognitoAuth extends Construct {
    constructor(parent: Construct, name: string, props: CognitoAuthProps) {
        super(parent, name);

        const userPool = new UserPool(this, "UserPool", {
            selfSignUpEnabled: true,
            userVerification: {
                emailStyle: VerificationEmailStyle.LINK,
                emailSubject: "bminahan.com Recommendations Registration Confirmation"
            },
            passwordPolicy: {
                minLength: 12,
                requireDigits: true,
                requireLowercase: true,
                requireSymbols: true,
                requireUppercase: true,
                tempPasswordValidity: Duration.days(1)
            },
            requiredAttributes: {
                email: true
            },
            signInAliases: {
                email: true,
                phone: true,
                preferredUsername: true,
                username: true
            }
        });
        new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });

        const userPoolCertificate = new DnsValidatedCertificate(this, "AuthCertificate", {
            domainName: props.authDomain,
            hostedZone: props.zone
        });

        const userPoolDomain = new CfnUserPoolDomain(this, "UserPoolDomain", {
            userPoolId: userPool.userPoolId,
            domain: props.authDomain,
            customDomainConfig: {
                certificateArn: userPoolCertificate.certificateArn
            }
        });
        new CfnOutput(this, 'UserPoolDomainName', { value: props.authDomain });

        const describeCognitoUserPoolDomain = new AwsCustomResource(
            this,
            'DescribeCognitoUserPoolDomain',
            {
                resourceType: 'Custom::DescribeCognitoUserPoolDomain',
                onCreate: {
                    region: 'us-east-1',
                    service: 'CognitoIdentityServiceProvider',
                    action: 'describeUserPoolDomain',
                    parameters: {
                        Domain: userPoolDomain.domain,
                    },
                    physicalResourceId: PhysicalResourceId.of(userPoolDomain.domain),
                },
                policy: AwsCustomResourcePolicy.fromSdkCalls({
                    resources: AwsCustomResourcePolicy.ANY_RESOURCE,
                }),
            }
        );
        describeCognitoUserPoolDomain.node.addDependency(userPoolDomain);

        const userPoolDomainDistribution = describeCognitoUserPoolDomain.getResponseField('DomainDescription.CloudFrontDistribution');

        new CfnOutput(this, 'UserPoolDomainDistribution', { value: userPoolDomainDistribution });

        new ARecord(this, 'UserPoolDomainAliasRecord', {
            recordName: userPoolDomain.domain,
            target: RecordTarget.fromAlias({
                bind: _record => ({
                    hostedZoneId: 'Z2FDTNDATAQYW2', // CloudFront Zone ID
                    dnsName: userPoolDomainDistribution,
                }),
            }),
            zone: props.zone
        });

        const resourceServer = new CfnUserPoolResourceServer(this, "ResourceServer", {
            identifier: `https://${props.authDomain}`,
            name: props.authDomain,
            userPoolId: userPool.userPoolId,
            scopes: [
                {
                    scopeName: 'full',
                    scopeDescription: 'full access to application'
                }
            ]
        });
        new CfnOutput(this, 'UserPoolResourceServerName', { value: resourceServer.ref });

        const appClient = new UserPoolClient(this, "AppClient", {
            userPool: userPool,
            authFlows: {
                adminUserPassword: true,
                refreshToken: true,
                userPassword: true
            },
            generateSecret: false,
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                    implicitCodeGrant: true
                },
                scopes: [
                    OAuthScope.EMAIL,
                    OAuthScope.OPENID,
                    OAuthScope.COGNITO_ADMIN,
                    OAuthScope.PROFILE,
                    OAuthScope.custom(`${resourceServer.ref}/full`)
                ],
                callbackUrls: props.callbackUrls
            },
        });

        //escape hatch to apply supported identity providers, and logout urls, not included in construct.
        const cfnUserPoolClient = appClient.node.defaultChild as CfnUserPoolClient;
        cfnUserPoolClient.supportedIdentityProviders = ['COGNITO'];
        cfnUserPoolClient.logoutUrLs = props.logoutUrls;

        new CfnOutput(this, 'AppClientId', { value: appClient.userPoolClientId });
    }
}