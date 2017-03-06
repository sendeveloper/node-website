var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var debug = require('debug');       // debug software
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');                      // this is being used in the create partials application
var recursive = require('recursive-readdir');   // this is being used in the create partials application
var hbs = require('hbs');                       // handlebars
//var mongoose = require('./lib/mongoose/index.js');
var mongoose = require('mongoose');
var session = require('express-session');           // Simple session middleware for Express
var MongoStore = require('./lib/connect-mongo/connect-mongo')(session);     // MongoDB session store for Express and Connect
var credentials = require('./credentials.js');      // creds file
var multer = require('multer');         // this is for the multipart form processing.  Cannot remove
var passport = require('passport');     //  Simple, unobtrusive authentication for Node.js.
var flash = require('connect-flash');    // The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user.
var cors  = require('cors');        // middleware for dynamically or statically enabling CORS in express/connect applications
var csrf = require('csurf');       // CSRF token middleware


var app = express();

// Config file for passport
require('./admin/security/passport')(passport);

// Set up the mongoose connection  //this was the old piece.  Not sure if it did anything or not
var options = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
    //, replicaSet: 'rs-ds031592'
};
var connection;// = credentials.mongo.production.primary;
console.log("This is process.env.MongoServer: " + process.env.MongoServer);

switch(process.env.COMPUTERNAME) {
    case 'CRITERION-JCB':
        connection = credentials.mongo.development.connectionString;
        // connection = credentials.mongo.production.external;
        break;
    case 'GIGIBIT131221':
        connection = credentials.mongo.development.connectionString;
        break;
    default:
        connection = credentials.mongo.production.primary;
}

/*
if (typeof process.env.MongoServer !== 'undefined'){
    if (process.env.MongoServer == "primary"){
        connection = credentials.mongo.production.primary;
    } else {
        connection = credentials.mongo.production.secondary;
    }
}
*/
switch(app.get('env')){
    case 'development':
        console.log('App Started in Development Mode');
        console.log("This is the computer name: " + process.env.COMPUTERNAME);

        mongoose.connect(connection, options);
        app.use(session({
            store: new MongoStore({
                mongooseConnection: mongoose.connection
                , ttl: 14 * 24 * 60 * 60 // = 14 days. Default
            })
            , secret : credentials.session.secretKey
            , resave : true
            , saveUninitialized : false
        }));
        break;
    case 'production':
        console.log('App Started in Production Mode');
        //connection = credentials.mongo.production.primary;
        mongoose.connect(connection, options);
        app.use(session({
            store: new MongoStore({
                mongooseConnection: connection
                , ttl: 14 * 24 * 60 * 60 // = 14 days. Default
            })
            , secret : credentials.session.secretKey
            , resave : true
            , saveUninitialized : false
            //, cookie: { secure: true }
        }));
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}
//console.log("This is the process: " + JSON.stringify(process.env));

// TODO: this still needs to be completed on both the setup with session and on all the routes
// load csurf
//app.use(csurf({ session : true }));
//var csrfProtection = csrf({ session : true });
var csrfProtection = csrf({ cookie: true });

// load cors module
app.use(cors());

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// initialize the passport (login) information
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// flash message middleware
/*app.use(function(req, res, next){
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});*/


// supposedly this was supposed to fix the mongoose models problem, but never did anything
//require('./models.js').initialize();

// disable response headers
app.disable('x-powered-by');

// use favicon
app.use(favicon('./public/favicon.ico'));

// use domains for better error handling
app.use(function(req, res, next){
    var domain = require('domain').create();
    domain.on('error', function(err){
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function(){
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);

            // disconnect from the cluster
            //var worker = require('cluster').worker;
            //if(worker) worker.disconnect();

            // close the mongoose connection
            mongoose.connection.close();
            // stop taking new requests
            server.close();

            try {
                // attempt to use Express error route
                next(err);
            } catch(error){
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch(error){
            console.error('Unable to send 500 response.\n', error.stack);
        }
    });

    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);

    // execute the rest of the request chain in the domain
    domain.run(next);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// middleware for handling file uploads  This only handles the multipart/form-data
// and places the file in the ./uploads directory.  You have to have the post process
// take it from there and do whatever

app.use(multer({
    dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase(); //+ Date.now()
    }
    , onError: function (error, next) {
        console.log(error);
        next(error)
    }
}));


// logging
switch(app.get('env')){
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({ path: __dirname + '/log/requests.log'}));
        break;
}

// register all the partials
var recitem;
function createpartials(dir, group) {
    recursive(dir, function (err, files) {
        // Files is an array of filename
        files.forEach(function (item) {
            recitem = item;
            recitem = recitem.replace(/\\/g, "/");
            var name = recitem.substring(recitem.lastIndexOf("/") + 1, recitem.length);
            var template = fs.readFileSync(recitem, 'utf8');
            name = name.replace(".hbs", "");
            if (group.length>0){
                name = group + '.' + name;
            }
            hbs.registerPartial(name, template);
            //console.log(name + ' partial registered!!!');
        });
    });
}
createpartials('./views/customer/partials', 'cust');
createpartials('./views/editorial/partials', 'edit');
createpartials('./views/customer/templates', '');
createpartials('./views/marketing/partials', 'mkt');

// static paths
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', express.static('./marketing'));  // marketing website routes (they are all static, no hbs)

//Set the routes for the app
var router = express.Router();
app.use(router);
require ('./routes.js')(app, passport, csrfProtection);
require ('./restify.js')(router);   // This is for all the restify apis

app.use(express.static(path.join(__dirname, '/public')));  // the original route from express-generator
//app.use(routes);

// This is where all the handlebars helpers are registered
require('./hbs_helpers.js')(hbs);

// This is the cron-scheduler tasks
if (typeof process.env.PUBLISH !== 'undefined'){
    if (process.env.PUBLISH === 'true'){
        require('./scheduler.js');
    }
}else {
    //console.log("this is the schedulerElse area");
    //var scheduler = require('./scheduler.js');
    //scheduler.testPorfolio(true);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    var if_admin;
    if(req.user.USER_ROLE_DESC === 'admin') {if_admin = 'admin'}
    res.status(err.status || 500);
    res.render('error', {
        message: err.message
        , error: err
        , layout: 'customer/partials/150805-layout'
        , if_admin : if_admin
    });
});


module.exports = app;
