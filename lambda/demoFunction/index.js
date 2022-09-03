
const aws = require("aws-sdk");
module.exports.handler = async(event, context) => {

    console.log('event:', JSON.stringify(event));
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success',
        })
    };
};
