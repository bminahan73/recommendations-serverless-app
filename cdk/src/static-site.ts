import { CloudFrontWebDistribution, SSLMethod, SecurityPolicyProtocol, OriginProtocolPolicy, OriginSslPolicy, CloudFrontAllowedMethods, CloudFrontAllowedCachedMethods, Behavior } from '@aws-cdk/aws-cloudfront';
import { ARecord, RecordTarget, IHostedZone } from '@aws-cdk/aws-route53';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { CfnOutput, RemovalPolicy } from '@aws-cdk/core';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets/lib';
import { Construct } from '@aws-cdk/core';

export interface StaticSiteProps {
    zone: IHostedZone,
    siteDomain: string;
    contentsDir: string
}

export class StaticSite extends Construct {

    constructor(parent: Construct, name: string, props: StaticSiteProps) {
        super(parent, name);

        new CfnOutput(this, 'Site', { value: `https://${props.siteDomain}` });

        const siteBucket = new Bucket(this, 'SiteBucket', {
            bucketName: props.siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            removalPolicy: RemovalPolicy.DESTROY,
            publicReadAccess: true
        });
        new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

        const certificateArn = new DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName: props.siteDomain,
            hostedZone: props.zone
        }).certificateArn;
        new CfnOutput(this, 'Certificate', { value: certificateArn });

        const CreateCacheBehavior = function (pathPattern: string) : Behavior {
            return {
                isDefaultBehavior: false,
                compress: true,
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                pathPattern: pathPattern
            };
        };

        const distribution = new CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [
                    props.siteDomain,
                ],
                sslMethod: SSLMethod.SNI,
                securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    //custom instead of S3 because we need to be able to do server-side logic for React (Routing)
                    customOriginSource: {
                        domainName: siteBucket.bucketWebsiteDomainName,
                        originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY
                    },
                    behaviors: [
                        { 
                            isDefaultBehavior: true,
                            compress: true,
                            allowedMethods: CloudFrontAllowedMethods.ALL,
                            cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                            forwardedValues: {
                                queryString: true,
                                cookies: {
                                    forward: 'all'
                                }
                            }
                        },
                        CreateCacheBehavior("*.css"),
                        CreateCacheBehavior("*.js"),
                        CreateCacheBehavior("*.png"),
                        CreateCacheBehavior("*.svg"),
                        CreateCacheBehavior("*.jpg"),
                        CreateCacheBehavior("*.jpeg")
                    ]
                }
            ],
            errorConfigurations: [
                {
                    errorCode: 403,
                    responseCode: 200,
                    responsePagePath: '/index.html'
                },
                {
                    errorCode: 404,
                    responseCode: 200,
                    responsePagePath: '/index.html'
                }
            ]
        });
        new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

        new ARecord(this, 'AliasRecord', {
            recordName: props.siteDomain,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            zone: props.zone
        });

        new BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [Source.asset(props.contentsDir)],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}