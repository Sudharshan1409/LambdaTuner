'use strict';

const AWS = require('aws-sdk');

module.exports.handler = async(event, context) => {

    console.log('event:', JSON.stringify(event));

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const lambda = new AWS.Lambda();
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

    const getFunctionParams = {
        FunctionName: event.lambdaARN
    }
    let current_lambda = await lambda.getFunction(getFunctionParams).promise();
    
    
    const updateItemParams = {
        TableName: process.env.DETAILS_TABLE,
        Key: {
            Arn: event.lambdaARN
        },
        UpdateExpression: 'add executions :inc set latestExecution = :latestExecution, power = :power, #durationOfLambda = :durationOfLambda, functionName = :functionName',
        ExpressionAttributeNames: {
            '#durationOfLambda': 'duration'
        },
        ExpressionAttributeValues: {
            ':latestExecution' : `${Date.now()}`,
            ':inc': 1,
            ':power': event.analysis.power,
            ':durationOfLambda': event.analysis.duration,
            ':functionName': current_lambda.Configuration.FunctionName
        }
    }
    
    const updateResponse = await dynamodb.update(updateItemParams).promise();
    console.log('updateResponse', updateResponse)
    
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
