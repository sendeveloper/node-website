var mongoose = require('mongoose');

// This is from the customer site with the lead requests
var portfolio_views_schema = mongoose.Schema({
    PORTFOLIO_VIEW_DESC : { type: String, required: true, trim: true }
    , VIEW_ELEMENTS : [String]
});

var portfolio_views = mongoose.model('portfolio_views', portfolio_views_schema);
module.exports = portfolio_views;