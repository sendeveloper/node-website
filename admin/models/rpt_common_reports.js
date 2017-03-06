var mongoose = require('mongoose');
var cat_class = require('./../../editorial/models/misc_category_classes.js');
var sub_cat = require('./../../editorial/models/misc_sub_categories.js');
var misc_periods = require('./../../editorial/models/misc_periods');
var misc_cmdty_class = require('./../../editorial/models/misc_commodity_classes');



// This is for all the customer reports that get populated on the website
var rpt_common_reports_schema = mongoose.Schema({
    REPORT_NAME : { type: String, required: true, trim: true }       // Report Name
    , REPORT_DESC : { type: String, required: true, trim: true }  // detailed description of the report
    , REPORT_FREQ_ID : {type: mongoose.Schema.Types.ObjectId, ref: 'misc_periods', required: true}
    , REPORT_FREQ_DESC : String  // This is from the PERIOD_DESC field from misc_peiods
    , REPORT_FREQ_SHORT : String  // This is from the PERIOD_DESC field from misc_peiods
    , CMDTY_CLASS_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'misc_commodity_classes', required: true}]
    , CMDTY_CLASS_DESC : String        // Links back to Misc Categories
    , CAT_CLASS_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'misc_category_classes'}
    , CAT_CLASS_SHORT : String        // Links back to Misc Categories
    , CAT_CLASS_DESC : String         // Links back to Misc Categories
    , SUB_CAT_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'misc_sub_categories'}
    , SUB_CAT_DESC : String     // Links back to Misc Categories
    , OUTPUT : [{
        FILE_TYPE : String  // This is pdf, excel, ppt, etc...
        , FILE_ICON : String  //  glyphicon item
    }]
    , NOTES : { type: String, trim: true }
    , STATUS : String
});
var rpt_common_reports = mongoose.model('rpt_common_reports', rpt_common_reports_schema);
module.exports = rpt_common_reports;
