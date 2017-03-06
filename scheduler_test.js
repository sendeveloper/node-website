var schedule = require('node-schedule');
var ferc = require("./editorial/controllers/ferc");
var keyItems = require("./keyItems.json");
var adminCf = require('./admin/shared/common_functions.js');

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

scheduleFerc();