const aws = require('aws-sdk');

var docClient = new aws.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = async (): Promise<any> => {
    const params = {
        TableName: process.env.TABLE_NAME,
    };

    docClient.scan(params, function (err: any, data: any) {
        if (err) {
            console.log(err, err.stack);
            return {
                errorMessage: err,
                stackStrace: err.stack
            }
        }
        else {
            return data;
        }
    });
}