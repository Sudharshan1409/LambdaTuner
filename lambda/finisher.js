'use strict';

const AWS = require('aws-sdk');

module.exports.handler = async(event, context) => {

    console.log('event:', JSON.stringify(event));

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const putHistoryDataParams = {
        TableName: process.env.HISTORY_TABLE,
        Item: {
            Arn: event.lambdaARN,
            stats: event.stats,
            strategy: event.strategy,
            powerValues: event.powerValues,
            power: event.analysis.power,
            cost: event.analysis.cost,
            duration: event.analysis.duration,
            date: `${Date.now()}`,
        }
    }

    
    console.log('putHistoryDataParams:', JSON.stringify(putHistoryDataParams));
    await dynamodb.put(putHistoryDataParams).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            input: event,
            data: putHistoryDataParams.Item,
        })
    };
};
