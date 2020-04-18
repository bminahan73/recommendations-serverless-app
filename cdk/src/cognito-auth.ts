import { HostedZone } from '@aws-cdk/aws-route53';
import { Construct, Duration, CfnOutput } from '@aws-cdk/core';
import { UserPool, VerificationEmailStyle, CfnUserPoolDomain, UserPoolClient, OAuthScope, CfnUserPoolResourceServer } from '@aws-cdk/aws-cognito';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';

export type CognitoAuthProps = {
    baseDomain: string;
    authSubDomain: string;
    callbackUrls: string[];
}

export class CognitoAuth extends Construct {
    constructor(parent: Construct, name: string, props: CognitoAuthProps) {
        super(parent, name);

        const authDomain = `${props.authSubDomain}.${props.baseDomain}`;

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
            domainName: authDomain,
            hostedZone: HostedZone.fromLookup(this, "Zone", { domainName: props.baseDomain })
        });

        const userPoolDomain = new CfnUserPoolDomain(this, "UserPoolDomain", {
            userPoolId: userPool.userPoolId,
            domain: authDomain,
            customDomainConfig: {
                certificateArn: userPoolCertificate.certificateArn
            }
        });
        new CfnOutput(this, 'UserPoolDomainName', { value: authDomain });


        const resourceServer = new CfnUserPoolResourceServer(this, "ResourceServer", {
            identifier: `https://${authDomain}`,
            name: authDomain,
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
                    OAuthScope.COGNITO_ADMIN
                ],
                callbackUrls: props.callbackUrls
            }
        });
        new CfnOutput(this, 'AppClientId', { value: appClient.userPoolClientId });
    }
}