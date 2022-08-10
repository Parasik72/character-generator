var SMSAPI_SID = process.env.SMSAPI_SID || 'SMSAPI_SID';
var SMSAPI_TOKEN = process.env.SMSAPI_TOKEN || 'SMSAPI_TOKEN';

const twilio = require('twilio')(SMSAPI_SID, SMSAPI_TOKEN);

module.exports = twilio;