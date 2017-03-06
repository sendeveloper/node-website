var mongoose = require('mongoose');

//
var portfolio_types_schema = mongoose.Schema({
    PORTFOLIO_TYPE_DESC : { type: String, required: true, trim: true }  // news, data points or fundamentals
});

var portfolio_types = mongoose.model('portfolio_types', portfolio_types_schema);
module.exports = portfolio_types;