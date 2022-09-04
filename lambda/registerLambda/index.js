"use strict";
const aws = require("aws-sdk");
const dynamodb = new aws.DynamoDB.DocumentClient();
module.exports.handler = async (event, context) => {
  console.log("event:", JSON.stringify(event));
  console.log("Environment:", JSON.stringify(process.env));
  const event_body = JSON.parse(event.body);
  console.log("event body:", event_body, typeof event_body);
  const updateItemParams = {
    TableName: process.env.DETAILS_TABLE,
    Key: {
      Arn: event_body.FunctionArn,
    },
    UpdateExpression:
      "set functionName = :functionName, functionEvent = :functionEvent, autoUpdateFunctionConfig = :autoUpdateFunctionConfig, strategy = :strategy",
    ExpressionAttributeValues: {
      ":functionName": event_body.FunctionName,
      ":functionEvent": event_body.FunctionEvent,
      ":autoUpdateFunctionConfig": event_body.autoUpdateFunctionConfig,
      ":strategy": event_body.strategy,
    },
  };
  console.log("updateItemParams", updateItemParams);
  await dynamodb.update(updateItemParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
    }),
  };
};
