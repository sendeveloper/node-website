var mongoose = require('mongoose');

var portfolio_snapshots_schema = mongoose.Schema({
    USER_ID : {type : mongoose.Schema.Types.ObjectId, ref: 'users'}
    , SNAPSHOTS : [{
        PORTFOLIO_ID :  {type : mongoose.Schema.Types.ObjectId, ref: 'portfolios'}
        , SNIPPET_ID : [{type : mongoose.Schema.Types.ObjectId, ref: 'snippets'}]
    }]
    , SNAPSHOT_DATE : { type: String, required: true, trim: true }  // news, data points or fundamentals
    , SNAPSHOT_TIMESTAMP : { type: Date, default: Date.now, required: true  }  // news, data points or fundamentals
});

var portfolio_snapshots = mongoose.model('portfolio_snapshots', portfolio_snapshots_schema);
module.exports = portfolio_snapshots;
