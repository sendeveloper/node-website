var schedule = require('node-schedule');
var async = require('async');
var chalk = require('chalk');
var moment = require('moment-timezone');
var _ = require('lodash');
var ObjectId = require('./lib/mongoose/index.js').Types.ObjectId;

var Users = require('./admin/models/users');
var Portfolios = require('./admin/models/portfolios');
var PortfolioSnapshots = require('./admin/models/portfolio_snapshots');
var mandrill = require('./admin/controllers/mandrill');
var cf = require('./customer/shared/common_functions');
var adminCf = require('./admin/shared/common_functions');
var ferc = require("./editorial/controllers/ferc");
var keyItems = require("./keyItems.json");

var reversePopulation = require('./editorial/controllers/reverse_population');

var emailScheduledJob = null;

module.exports = {
    testPorfolio : function(req, res){
        //res.send("ok");
        var results = sendPortfolioEmails(true);
        //res.json(results);
    }
};

var sendPortfolioEmails = function sendPortfolioEmails(test) {
    // schedule tomorrow's:
    //var test = false;  //*** this is the testing location ***//
    var now = new Date();
    var yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    var query;
    if (typeof test !== 'undefined' && test === true){
        console.log("this should be the test");
        query = {USER_NAME : {$in : ["jbest2231", "jbevan553", "rsharmacr"]}};
        //query = {$or : [{USER_STATUS_ID : ObjectId("5537aca6993fce9c0c640ed6")}, {$and : [{USER_STATUS_ID : ObjectId("5537acb1993fce9c0c640ed7")}, {TRIAL_END_DATE : {$gte : Date.now()} }]}]}, {USER_EMAIL: 1, USER_FIRST_NAME: 1}
    } else {
        query = {$or : [{USER_STATUS_ID : ObjectId("5537aca6993fce9c0c640ed6")}, {$and : [{USER_STATUS_ID : ObjectId("5537acb1993fce9c0c640ed7")}, {TRIAL_END_DATE : {$gte : Date.now()} }]}]}, {USER_EMAIL: 1, USER_FIRST_NAME: 1}
        console.log("This is teh query: " + JSON.stringify(query));
    }

    Users.find(query)
        .populate("CUSTOMER_ID", "CUSTOMER_NAME")
      .exec(function(err, users) {
          if (err) {
            console.log('Failed to fetch users to send daily portfolio emails');
            return console.log(err);
          }

      async.eachSeries(users, function(user, callback) {
        var portfolioQuery = {
          "$or": [
            {"USER_ID": user._id}
            , {"SHARED_PORTFOLIO": true, "SHARED_USERS": user._id}
          ]
        };
        Portfolios.find(portfolioQuery)
            .populate('USER_ID', 'USER_EMAIL')
            .exec(function(err, portfolios) {
                  if (err || !portfolios || !portfolios.length) {
                    // not returning an error, hopefully can keep going and process other users anyway
                    return callback();
                  }
          async.map(portfolios, function(portfolio, cb) {
            cf.fetchPortfolioSnippets({
              portfolioQuery: {_id : portfolio._id},
              mapPortfolioToSnippets: false,
              dateRange: {
                start: yesterday,
                end: now
              }
            }, function(err, result) {
              if (err) {
                return cb(err);
              }
              cb(null, {
                    PORTFOLIO_NAME: portfolio.USER_PORTFOLIO_NAME
                    , PORTFOLIO_ID : portfolio._id
                    , USER_ID : portfolio.USER_ID
                    , allItems: result.allItems
              });
            });
          }, function(err, portfolioResults) {
            if (err) {
              console.log('Failed to process user daily update email ', err);
              // not returning an error, hopefully can keep going and process other users anyway
              return callback();
            }

            var portfolioDisplay = portfolioResults.map(function(results) {
              var allItems = results.allItems;
              var itemDisplay = '';
              if (typeof allItems !== 'undefined' && allItems.length) {
                  itemDisplay = allItems.map(function(item) {
                  if (item.snippet) {
                    var snippet = item.snippet;
                    var snippetBody = ((snippet.NCO_SNIPPET_BODY.length >= 170)? snippet.NCO_SNIPPET_BODY.substring(0,170) + '...' :snippet.NCO_SNIPPET_BODY.toString());
                      return '<div class="portfolioSectionItem">' +
                        '<a class="itemHeader" href="https://criterionrsch.com/c/snippet?snippet_id=' + snippet._id + '">' +'<strong>' +  snippet.NCO_SNIPPET_TITLE + '</strong>' + '</a>' +
                        '<div class="itemContent">' + snippetBody  + '</div></div>';
                  } else if (item.ferc) {
                    var ferc = item.ferc;
                      var fercImpact = (typeof item.ferc.impact !== 'undefined' && item.ferc.impact != null && typeof item.ferc.impact[0] != 'undefined' )? item.ferc.impact[0].impact : "General Update";
                      var fercTitle = (typeof item.ferc.PROJECT_ID !== 'undefined' && typeof item.ferc.PROJECT_ID[0] !== 'undefined')? item.ferc.PROJECT_ID[0].PROJECT_NAME : (typeof item.ferc.ASSET_ID !== 'undefined' && typeof item.ferc.ASSET_ID[0] !== 'undefined')? item.ferc.ASSET_ID[0].ASSET_NAME : (typeof item.ferc.ENTITY_ID !== 'undefined' && typeof item.ferc.ENTITY_ID[0] !== 'undefined')? item.ferc.ENTITY_ID[0].ENTITY_NAME : "";
                        var fercSummary = ((ferc.summary.length >= 170)? ferc.summary.substring(0,170) + '...' :ferc.summary.toString());
                      return '<div class="portfolioSectionItem">' +
                          '<a class="itemHeader" href="https://criterionrsch.com/si_ferc/highlight?highlight_id=' + ferc._id + '">' + '<strong>' + fercImpact + '</strong> - ' + fercTitle + '</a>' +
                          '<div class="itemContent">' + fercSummary + '</div></div>';
                  }
                  return '';
                }).join('');
              }
                var portfolioName = results.PORTFOLIO_NAME + (results.USER_ID._id.toString() == user._id.toString() ? '' : (' Shared by ' + results.USER_ID.USER_EMAIL));
                var portfolioSection = "";
                if (itemDisplay !== ""){
                    portfolioSection = '<table class="tableDefaults"><tr><td class="portfolioHeaderSpacing"><table class="portfolioHeaderBorder"><tr><td class="portfolioTitleText">' + portfolioName + '</td></tr></table></td></tr></table>' +
                        '<table class="portfolioTableDefaults"><tr><td class="portfolioSectionPadding">' + itemDisplay + '</td></tr></table>';
                }
                return portfolioSection;
            }).join('');
              //console.log("This is the display Portofolio: " + JSON.stringify(portfolioDisplay));
            if (portfolioDisplay.length > 0) {
              var mailOptions = {
                  to: user.USER_EMAIL,
                  from: 'criterion_reports@criterionrsch.com',
                  subject: 'Daily Portfolio Updates',
                  html: '<p>Dear ' + user.USER_FIRST_NAME + ',</p>' +
                  '<p>Here are your portfolio updates for today:</p>' +
                  portfolioDisplay +
                  '<p><small>To unsubscribe from this email, please contact your customer service representative at <a href"mailto:support@criterionrsch.com">support@criterionrsch.com</a></small></p>'
              };

              var snapshot = new PortfolioSnapshots({
                USER_ID: user._id
                , SNAPSHOTS : portfolioResults.map(function(results) {
                  var portfolio = results.portfolio;
                  var snippets = results.snippets;

                  return {
                    PORTFOLIO_ID: results.PORFOLIO_ID
                    , SNIPPET_ID: _.pluck(snippets, '_id')
                  }
                })
                , SNAPSHOT_DATE: moment(now).format('M/DD/YYYY')
                , SNAPSHOT_TIMESTAMP: now
              });

              snapshot.save(function(err) {
                if (err) {
                  return console.log('failed to save snapshot', err);
                }

               var mandrillOptions = {
                   templateId : 'newportfolioupdates-160727'  //'portfolio-updates'
                  , subject : "Daily Portfolio Updates - " + moment(new Date()).format("M/D/YYYY")
                  , fromEmail : "criterion_reports@criterionrsch.com"
                  , fromName : "Criterion Reports"
                  , emails : [{
                       email : user.USER_EMAIL
                       , first_name : user.USER_FIRST_NAME
                       , last_name : user.USER_LAST_NAME
                   }]
                  , title : "Daily Portfolio Updates"
                  , portfolios : portfolioDisplay
                   , preview : ""
                   , username : user.USER_FIRST_NAME + " " + user.USER_LAST_NAME
                  , company : user.CUSTOMER_ID.CUSTOMER_NAME
                   //, portfolioResults : portfolioResults
                };
                  if (test == true){
                      //console.log("These are the mandrillOptions: " + JSON.stringify(mandrillOptions));
                      console.log("This is the email: " + user.USER_EMAIL);
                      if (mandrillOptions.portfolios == ""){
                          callback()
                      } else {
                          //createTestResults(mandrillOptions, 'json');
                          callback();
                          //mandrill.sendPortfolioEmail(mandrillOptions, callback);
                      }
                  } else {
                      if (mandrillOptions.portfolios == ""){
                          callback()
                      } else {
                          //createTestResults(mandrillOptions, 'json');
                          //callback();
                          mandrill.sendPortfolioEmail(mandrillOptions, callback);
                      }
                  }
              });
            } else {
              callback();
            }
          });
        });
      }, function(err) {
        if (err) { console.log(err); }
      });
    });
};

// schedules the email in a timezone and DST aware manner
var scheduleEmail = function scheduleEmail() {
  var desiredHour = 16;
  var centralOffset = moment.tz.zone('America/Chicago').offset(new Date().getTime()) / 60;
  var now = new Date();
  var currentOffset = now.getTimezoneOffset() / 60;
  var nextTime = new Date();

  // uses the timesets to determine the right time
  nextTime.setHours(desiredHour - (currentOffset - centralOffset));
  nextTime.setMinutes(0);
  nextTime.setSeconds(0);

  // make sure it's a time in the future
  if (now >= nextTime) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  console.log(chalk.bold.red('Schedule next email check for:', nextTime));

  // use date scheduling instead of recurring to prepare for DST changes if the server does not change
  emailScheduledJob = schedule.scheduleJob(nextTime, sendPortfolioEmails);
};



var scheduleFerc = function(){
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(1, 5)];
  rule.hour = keyItems.fercScheduler.hour;
  rule.minute = keyItems.fercScheduler.minute;

  var j = schedule.scheduleJob(rule, function(){
    try{
      console.log('The FERC upload ran correctly! ' + new Date());
      ferc.updateFercDocuments();
    } catch (err){
      console.log('The FERC upload Failed ' + new Date() + ' ' + err);
      var mailOptions = {
        to: 'jbest@criterionrsch.com',
        from: 'support@criterionrsch.com',
        subject: 'The FERC Upload failed',
        text: 'The ' + new Date() + ' upload failed.  ' + err
      };
      adminCf.emailSupport(mailOptions, function(err) {
        //req.flash('message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
        return done;
      });
    }

  });
};


var scheduleAssetTypeUpdate = function(){
  var desiredHour = 20;

  // moment will know if it is DST and gets the correct offset in minutes
  var centralOffset = moment.tz.zone('America/Chicago').offset(new Date().getTime()) / 60;
  var now = new Date();
  var currentOffset = now.getTimezoneOffset() / 60;
  var nextTime = new Date();

  // uses the timesets to determine the right time
  nextTime.setHours(desiredHour - (currentOffset - centralOffset));
  nextTime.setMinutes(0);
  nextTime.setSeconds(0);

  // make sure it's a time in the future
  if (now >= nextTime) {
    nextTime.setDate(nextTime.getDate() + 1);
  }

  // use date scheduling instead of recurring to prepare for DST changes if the server does not change
  var scheduleReversePopulation = schedule.scheduleJob(nextTime, reversePopulation.updateAssetTypesModel());

};



function truncate(text, len){
    if (text.length > len){
        return text.substr(0,len) + "...";
    } else {
        return text;
    }
}

function createTestResults(stuff, type){
    var test;
    var fileName;
    switch(type){
        case "json":
            test = JSON.stringify({stuff : stuff});
            fileName =  "samplePortfolio.json";
            break;
        case "html":
            test = stuff;
            fileName = "sampleHtml.html";
            break;
    }
    // console.log('run through portfolios');
    var fs = require('fs');
    if (fs.exists(fileName) == true) {
        fs.unlinkSync(fileName);
    }
    fs.writeFile(fileName, test, function(err){
        if (err) {console.log("this is the err: " + err)}
        else {console.log("The file wrote correctly")}
    });

}

// schedule it immediately
if (typeof process.env.PUBLISH !== 'undefined' && process.env.PUBLISH == 'true') {
    scheduleEmail();
    scheduleAssetTypeUpdate();
    //scheduleFerc();
} else {
    console.log(chalk.bold.red("************ NOTHING SCHEDULED ********************"))
}
