This is the key information for the project


Rolling from development to production:
There are a number of changes which have to be made to roll from development to production

1) In admin/dataTables/customer_reports_widgets.js you need to update the following
var loc;
//*********  This will have to be updated between production and development ***************
loc = creds.aws.s3.development.baseurl;
admin\controllers\cntrl_reports has multiple items to be updated
admin\datatables\customer_reports_widgets


Set this to...  creds.aws.s3.production.baseurl;
The creds are defined in the credentials.js file

req.session.passport.user is how you get the user_id for the current session

    app.get('/testing/', function(req, res){
        console.log(req.session.passport.user);
        res.send(req.session.passport.user);
        //res.send('you viewed this page ' + req.session.views['/testing'] + ' times')
    });


