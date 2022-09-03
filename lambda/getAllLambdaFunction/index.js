'use strict';

const AWS = require('aws-sdk');

module.exports.handler = async(event, context) => {

    console.log('event:', JSON.stringify(event));

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    console.log('HISTORY_TABLE:', process.env.HISTORY_TABLE)
    console.log('DETAILS_TABLE:', process.env.DETAILS_TABLE)

    const getAllLambdaParams = {
        TableName : process.env.DETAILS_TABLE,
    }
    const response = await dynamodb.scan(getAllLambdaParams).promise();
    console.log('getAllLambdaParams:', JSON.stringify(response));

    return {
        statusCode: 200,
        body: JSON.stringify({
            data: response.Items,
        })
    };
};
