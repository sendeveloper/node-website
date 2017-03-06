var mongoose = require('mongoose');

// This is from the customer site with the lead requests
var misc_delivery_methods_schema = mongoose.Schema({
    DELIVERY_METHOD_DESC : { type: String, required: true, trim: true }
});

var misc_delivery_methods = mongoose.model('misc_delivery_methods', misc_delivery_methods_schema);
module.exports = misc_delivery_methods;