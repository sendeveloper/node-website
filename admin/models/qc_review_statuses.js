var mongoose = require('mongoose');


// The CSR stuff should be handled through salesforce
var qc_review_statuses_schema = mongoose.Schema({
    REVIEW_STATUS : { type: String, required: true, trim: true }
});

var qc_review_statuses = mongoose.model('qc_review_statuses', qc_review_statuses_schema);
module.exports = qc_review_statuses;