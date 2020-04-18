import { Construct, Duration } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { join as joinpath } from 'path';

export class Backend extends Construct {

    constructor(parent: Construct, name: string) {
        super(parent, name);

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
            code: Code.fromAsset(joinpath(__dirname, '../../lambdas/get-recommendations/dist')),
            environment: {
                TABLE_NAME: recommendationsTable.tableName
            },
            timeout: Duration.minutes(5)
        });

        recommendationsTable.grantReadData(getRecommendations);

        const makeRecommendations = new Function(this, "MakeRecommendationsFunction", {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            code: Code.fromAsset(joinpath(__dirname, '../../lambdas/make-recommendations/dist')),
            environment: {
                TABLE_NAME: recommendationsTable.tableName
            },
            timeout: Duration.minutes(1)
        });

        recommendationsTable.grantReadWriteData(makeRecommendations);

    };
}