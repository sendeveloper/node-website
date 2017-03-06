var mongoose = require('mongoose');


// Portfolio data to monitor
var portfolios_schema = mongoose.Schema({
    USER_PORTFOLIO_NAME : { type: String, required: true, trim: true }
    , USER_PORTFOLIO_DESC : String
    , USER_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
    , PORTFOLIO_TYPE_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'portfolio_types'} // news, data points or fundamentals
    , VIEW_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'portfolio_views'}]
    , DELIVERY_METHOD_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'portfolio_deliveries'}] // api, email, ftp, etc....
    , SOURCE_DATA_ID :  [{type: mongoose.Schema.Types.ObjectId, ref: 'source_data'}]
    , CAT_CLASS_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'misc_category_classes'}]
    , SUB_CAT_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'misc_sub_categories'}]
    , CMDTY_CLASS_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'misc_commodity_classes'}]
    , SUB_CMDTY_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'misc_sub_commodities'}]
    , ENTITY_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'entities'}]
    , ASSET_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'assets'}]
    , PROJECT_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'projects'}]
    , REGION_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_regions'}]
    , COUNTRY_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_countries'}]
    , STATE_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_states'}]
    , PROVINCE_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_provinces'}]
    , COUNTY_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_counties'}]
    , TAG_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'misc_tags'}]
    , EMAIL_ALERTS: Boolean
    , SHARED_PORTFOLIO : Boolean
    , SHARED_PORTFOLIO_ID : {type: mongoose.Schema.Types.ObjectId}
    , SHARED_USERS : [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
    , STATUS : String
});

var portfolios = mongoose.model('portfolios', portfolios_schema);
module.exports = portfolios;
