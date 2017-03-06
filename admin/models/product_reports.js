var mongoose = require('mongoose');


var product_reports_schema = mongoose.Schema({
    CATEGORY_ID : [{ type : mongoose.Schema.Types.ObjectId, ref: 'product_categories', required: true}]
    , PRODUCT_NAME : {type: String, required : true, trim: true}
    , PRODUCT_DESC : {type: String, required : true, trim: true}
    , RELEASE_SCHEDULE : [{type: String, required : true, trim: true}]
    , OWNER : [{ type : mongoose.Schema.Types.ObjectId, ref: 'users'}]
    , COMMODITY_TYPE : [{ type : mongoose.Schema.Types.ObjectId, ref: 'misc_commodity_classes'}]
    , CATEGORY_CLASS : [{ type : mongoose.Schema.Types.ObjectId, ref: 'misc_category_classes'}]
    , PRODUCT_STATUS : String
});

var product_reports = mongoose.model('product_reports', product_reports_schema);
module.exports = product_reports;