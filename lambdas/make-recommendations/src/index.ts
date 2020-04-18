import { IRecommendation, Recommendation } from '../../../common/Recommendation';

const AWS = require('aws-sdk');

var dynamodb  = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

export const handler = function (event: IRecommendation) {

    console.info(`event received:\n${JSON.stringify(event)}`);
    let item = new Recommendation(event.type,event.title,event.additionalNotes);
    
    console.debug(`item generated:\n${JSON.stringify(item)}`);

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: AWS.DynamoDB.Converter.marshall(item)
    };

    console.debug(`params generated:\n${JSON.stringify(params)}`);

    dynamodb.putItem(params).promise().then(
        function(err: any, data: any) {
            if (err) {
                console.info('err');
                console.error(err, err.stack);
            }
            else {
                console.info('no err');
                console.log(data);
            }
        }
    );

    console.debug('after dynamo putItem');
}