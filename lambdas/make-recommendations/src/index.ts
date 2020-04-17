import { IRecommendation } from '../../../common/Recommendation';
const aws = require('aws-sdk');
const uuid = require('uuid');

var docClient = new aws.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = async (event: IRecommendation): Promise<any> => {
    const id = uuid.v5();
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: event
    };

    docClient.put(params, function (err: any) {
        if (err) {
            console.error(`unable to add ${event.type} recommendation for ${event.title}. Error: ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`added recommendation with id ${id}`);
        }
    });
}