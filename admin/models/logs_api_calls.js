var mongoose = require('mongoose');

var logs_api_calls_schema = mongoose.Schema({
    LOGIN_USERNAME : {type: String}
    , TARGET_PAGE : String
    , LOGIN_SUCCESSFUL : {type: Boolean, required: true}   // This can either be true  || false
    , REMOTE_IP : {type: String, required: true}
    , REMOTE_AGENT : String
    , LOGIN_TIMESTAMP: Date
    , ERROR : String
});

var logs_api_calls = mongoose.model('logs_api_calls', logs_api_calls_schema);
module.exports = logs_api_calls;
