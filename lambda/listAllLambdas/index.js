"use strict";
const aws = require("aws-sdk");
const lambda = new aws.Lambda();
module.exports.handler = async (event, context) => {
  console.log("event:", JSON.stringify(event));
  const listLambdasParams = {
    FunctionVersion: "ALL",
  };
  const lambdaFunctions = await lambda
    .listFunctions(listLambdasParams)
    .promise();
  console.log("lambdaFunctions", lambdaFunctions);
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: lambdaFunctions,
    }),
  };
};
