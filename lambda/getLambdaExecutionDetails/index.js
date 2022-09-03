'use strict';

const AWS = require('aws-sdk');

module.exports.handler = async(event, context) => {

    console.log('event:', JSON.stringify(event));

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    console.log('queryStringParameters', event.queryStringParameters)
    console.log('HISTORY_TABLE:', process.env.HISTORY_TABLE)
    console.log('DETAILS_TABLE:', process.env.DETAILS_TABLE)

    const getExecutionsParam = {
        TableName: process.env.HISTORY_TABLE,
        KeyConditionExpression: 'Arn = :Arn',
        ExpressionAttributeValues: {
            ':Arn': event.queryStringParameters.Arn,
        }
    }

    console.log(getExecutionsParam)

    const response = await dynamodb.query(getExecutionsParam).promise();
    console.log('response', response);
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: response.Items,
        })
    };
};
