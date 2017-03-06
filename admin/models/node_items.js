var mongoose = require('mongoose');


var node_items_schema = mongoose.Schema({
    fercScheduler : {
        hour: [Number]
        , minute: [Number]
    }

});
var node_items = mongoose.model('node_items', node_items_schema);
module.exports = node_items;
