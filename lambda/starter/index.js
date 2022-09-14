"use strict";

/**
 * Initialize versions & aliases so we can execute everything in parallel.
 */

// lambdaEvent = {
//     "powerValues": [128, 256, 512, 1024, 2048, 4096],
//     "autoUpdateLambdaConfig": true,
//     "strategy": "speed",
//     "lambdaConfig": [
//         {
//             "lambdaARN": "arn:aws:lambda:us-east-1:454445151329:function:nops-hello-world",
//             "payload": {
//                 "key1": 90000
//             }
//         },
//         {
//             "lambdaARN": "arn:aws:lambda:us-east-1:454445151329:function:nops-hello-world",
//             "payload": {
//                 "key1": 90000
//             }
//         },
//     ],
// }
const aws = require("aws-sdk");
const stepFunction = new aws.StepFunctions();
const dynamodb = new aws.DynamoDB.DocumentClient();
module.exports.handler = async (event, context) => {
  console.log("event:", JSON.stringify(event));
  console.log("Environment:", JSON.stringify(process.env));
  const getLambdaDetailsParams = {
    TableName: process.env.DETAILS_TABLE,
    Key: {
      Arn: event.detail.responseElements.functionArn,
    },
  };
  const lambdaDetails = await dynamodb.get(getLambdaDetailsParams).promise();
  console.log("lamdbaDetails", JSON.stringify(lambdaDetails));
  if (!lambdaDetails.Item) {
    console.log("The Lambda Function is not registered");
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lambda Function is not registered",
      }),
    };
  }
  const stepFunctionInput = {
    lambdaARN: lambdaDetails.Item.Arn,
    powerValues: [
      128, 256, 512, 1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192, 9216,
      10240,
    ],
    num: 20,
    autoOptimize: lambdaDetails.Item.autoUpdateFunctionConfig,
    payload: lambdaDetails.Item.functionEvent,
    autoUpdateLambdaConfig: lambdaDetails.Item.autoUpdateFunctionConfig,
    strategy: lambdaDetails.Item.strategy,
  };
  const stepFunctionParams = {
    stateMachineArn: process.env.TUNER_ARN,
    input: JSON.stringify(stepFunctionInput),
    name: `Execution-${Date.now()}`,
  };
  const stepFuncRes = await stepFunction
    .startExecution(stepFunctionParams)
    .promise();
  console.log("stepFunctionResForGetOrg: ", JSON.stringify(stepFuncRes));
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
    }),
  };
};
