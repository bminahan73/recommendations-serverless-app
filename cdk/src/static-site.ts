import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import acm = require('@aws-cdk/aws-certificatemanager');
import cdk = require('@aws-cdk/core');
import targets = require('@aws-cdk/aws-route53-targets/lib');
import { Construct } from '@aws-cdk/core';
import { OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';

export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
    contentsDir: string
}

export class StaticSite extends Construct {
    siteDomain: string;

    constructor(parent: Construct, name: string, props: StaticSiteProps) {
        super(parent, name);

        this.siteDomain = `${props.siteSubDomain}.${props.domainName}`;
        new cdk.CfnOutput(this, 'Site', { value: `https://${this.siteDomain}` });

        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: this.siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

        const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });

        const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName: this.siteDomain,
            hostedZone: zone
        }).certificateArn;
        new cdk.CfnOutput(this, 'Certificate', { value: certificateArn });

        const accessId = new OriginAccessIdentity(this, "OriginAccessIdentity");

        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [
                    this.siteDomain,
                ],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        originAccessIdentity: accessId,
                        s3BucketSource: siteBucket
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                }
            ]
        });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

        new route53.ARecord(this, 'AliasRecord', {
            recordName: this.siteDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });

        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.asset(props.contentsDir)],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}