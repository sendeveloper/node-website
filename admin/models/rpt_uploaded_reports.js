var mongoose = require('mongoose');
var cat_class = require('./../../editorial/models/misc_category_classes.js');
var sub_cat = require('./../../editorial/models/misc_sub_categories.js');
var misc_cmdty_class = require('./../../editorial/models/misc_commodity_classes');
var misc_periods = require('./../../editorial/models/misc_periods');
var common_reports = require('./rpt_common_reports');

// This is for all the customer reports that get populated on the website
var rpt_uploaded_reports_schema = mongoose.Schema({
    REPORT_NAME : { type: String, required: true, trim: true }       // Report Name
    , REPORT_DESC : { type: String, required: true, trim: true }  // detailed description of the report
    , REPORT_FREQ_ID : {type: mongoose.Schema.Types.ObjectId, ref: 'misc_periods', required: true}
    , REPORT_FREQ_DESC : String  // This is from the PERIOD_DESC field from misc_peiods
    , REPORT_FREQ_SHORT : String  // This is from the PERIOD_SHORT field from misc_peiods
    , REPORT_LOCATION : { type: String, required: true, trim: true }  //Link to the physical report
    , REPORT_UPLOAD_DATE : { type: Date, required: true, trim: true }  // date uploaded
    , REPORT_AUTHOR : String       // Report Name
    , REPORT_AUTHOR_ID : {type: mongoose.Schema.Types.ObjectId, ref: 'users'}       // Report Name
    , CMDTY_CLASS_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'misc_commodity_classes', required: true}
    , CMDTY_CLASS_DESC : String        // Links back to Misc Categories
    , CAT_CLASS_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'misc_category_classes'}]
    , CAT_CLASS_SHORT : String        // Links back to Misc Categories
    , CAT_CLASS_DESC : String         // Links back to Misc Categories
    , SUB_CAT_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'misc_sub_categories'}]
    , SUB_CAT_DESC : String     // Links back to Misc Categories
    , OUTPUT : [{
        FILE_TYPE : String  // This is pdf, excel, ppt, etc...
        , FILE_ICON : String  //  glyphicon item
    }]
    , COMMON_REPORT_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'rpt_common_reports'}
    , REPORT_TITLE : String
    , EMAIL_BODY : String
    , PUBLIC_FLAG : {type: Boolean, default: false}
    , QC : {
        REVIEW_STATUS : String    // This is the status in the queue, i.e. created, approved, trashed, revert, approved with edits
        , QC_ID : Number            // QC (Editor) ID (User ID)
        , QC_DATE : Date            // Our date it was reviewed
        , POST_DATE : Date          // Date Posted
        , CREATION_DATE : Date          // Date Created
        , UPDATE_DATE : Date        // when it was last updated
    }
});
var rpt_uploaded_reports = mongoose.model('rpt_uploaded_reports', rpt_uploaded_reports_schema);
module.exports = rpt_uploaded_reports;
