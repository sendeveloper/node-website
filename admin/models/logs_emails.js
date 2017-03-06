var mongoose = require('mongoose');

var logs_emails_schema = mongoose.Schema({
    reportId : { type : mongoose.Schema.Types.ObjectId, ref: 'rpt_common_reports', required: true}
    , sentTime : Date
    , emails : [{
        email : String
        , first_name : String
        , last_name : String
        , user_status : { type : mongoose.Schema.Types.ObjectId, ref: 'user_statuses'}
    }]
});

var logs_emails = mongoose.model('logs_emails', logs_emails_schema);
module.exports = logs_emails;
