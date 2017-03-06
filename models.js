var fs = require('fs');

exports.initialize = function() {
    fs.readdirSync("./editorial/models").forEach(function(file) {
        //console.log(file + " should be initialized")
        require('./editorial/models/' + file);
    });
};