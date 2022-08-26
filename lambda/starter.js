'use strict';

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
module.exports.handler = async(event, context) => {

    console.log('event:', JSON.stringify(event));
    const event_body = JSON.parse(event.body)
    console.log('event body:', JSON.stringify(event_body));
    console.log('Environment:', JSON.stringify(process.env));
    const stepFunction = new aws.StepFunctions();
    for(let lambdaConfig of event_body.lambdaConfig){
        const stepFunctionInput = {
            "lambdaARN": lambdaConfig.lambdaARN,
            "powerValues": event_body.powerValues ? event_body.powerValues : [128, 256, 512, 1024, 2048, 4096],
            "num": 20,
            "autoOptimize": event_body.autoUpdateLambdaConfig,
            "payload": lambdaConfig.payload,
            "autoUpdateLambdaConfig": event_body.autoUpdateLambdaConfig,
            "strategy": event_body.strategy ? event_body.strategy : "cost",
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
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success',
        })
    };
};
