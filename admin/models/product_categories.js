var mongoose = require('mongoose');

var product_categories_schema = mongoose.Schema({
    CATEGORY_NAME : { type: String, required: true, trim: true }
    , CATEGORY_DESC : {type: String, required : true, trim: true}
});

module.exports = mongoose.model('product_categories', product_categories_schema);