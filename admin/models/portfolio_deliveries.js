var mongoose = require('mongoose');
var misc_delivery_methods = require('./misc_delivery_methods');
var misc_periods = require('./../../editorial/models/misc_periods');

// This is from the customer site with the lead requests
var portfolio_deliveries_schema = mongoose.Schema({
    DELIVERY_FRIENDLY_NAME : String
    , DELIVERY_METHOD_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'misc_delivery_methods', required: true}
    , DELIVERY_METHOD_DESC : { type: String, required: true, trim: true }  // api, email, ftp, etc....
    , PERIOD_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'misc_periods', required: true}
    , PERIOD_DESC : String  // Year, Month, Day, Quarter
    , RELEASE_TIME : String  // i.e. 3:00 PM
});

var portfolio_deliveries = mongoose.model('portfolio_deliveries', portfolio_deliveries_schema);
module.exports = portfolio_deliveries;
