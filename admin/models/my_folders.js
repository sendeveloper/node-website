var mongoose = require('mongoose');


var my_folders_schema = mongoose.Schema({
    USER_FOLDER_NAME : { type: String, required: true, trim: true }
    , USER_FOLDER_DESC : String
    , USER_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
    , ITEM_ID : [{
        id: {type: mongoose.Schema.Types.ObjectId}
        , ref: String
        , _id: false
    }]
    , ACTIVE : Boolean
});

var my_folders = mongoose.model('my_folders', my_folders_schema);
module.exports = my_folders;
