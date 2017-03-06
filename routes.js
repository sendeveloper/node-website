var security = require('./admin/security/user_functions');

var urls = require('./admin/models/urls');

var customer_hndlr = require('./customer/handlers/hndlr_customer.js')
    , editorial = require('./editorial/handlers/editorial.js')
    , earnings_calendars = require('./editorial/controllers/earnings_calendars.js')
    , new_items_hndlr = require('./editorial/handlers/hndlr_new_items.js')
    , entities_hndlr = require('./editorial/handlers/hndlr_entities.js')
    , assets_hndlr = require('./editorial/handlers/hndlr_assets.js')
    , projects_hndlr = require('./editorial/handlers/hndlr_projects.js')
    , geo_hndlr = require('./editorial/handlers/hndlr_geo_items.js')
    , data_hndlr = require('./editorial/handlers/hndlr_data.js')
    , snippet_hndlr = require('./editorial/handlers/hndlr_snippets.js')
    , source_hndlr = require('./editorial/handlers/hndlr_source_input.js')
    , reports_cntrl = require('./admin/controllers/cntrl_reports')
    , reports_widgets = require('./admin/dataTables/customer_reports_widgets')
    , users_cntrl = require('./admin/controllers/cntrl_users')
    , snip_cntrl = require('./customer/controllers/snippets')
    , snippet_widgets = require('./customer/dataTables/snippet_widgets')
    , marketing_hndlr = require('./marketing/handlers/hndlr_marketing')
    , news_hndlr = require('./marketing/handlers/news')
    , leads_hndlr = require('./admin/controllers/cntrl_leads')
    , admin_hndlr = require('./admin/handlers/hndlr_admin')
    , users_dataTables = require('./admin/dataTables/users_dataTables')
    , portfolios_cntrl = require('./admin/controllers/cntrl_portfolios')
    , snippets_cntrl = require('./editorial/controllers/snippets_review')
    , myfolders_cntrl = require('./customer/controllers/my_folders')
    , entities_dataTables = require('./editorial/data_tables/entities_dataTables')
    , potential_articles = require('./editorial/controllers/potential_articles')
    , data_points_review = require('./editorial/controllers/data_points_review')
    , postgres_api = require('./editorial/data_tables/postgres_api')
    , postgres_metadata = require('./editorial/controllers/postgres_metadata')
    , admin_api = require('./admin/controllers/admin_api')
    , users = require('./admin/models/users')
    , resultsAPI = require('./customer/controllers/resultsAPI')
    , neoAPI = require('./editorial/controllers/neo4j_api')
    , neoController = require('./editorial/controllers/neo4j')
    , users_api = require('./admin/controllers/users_api')
    , customers_api = require('./editorial/controllers/customer_api')
    , ferc = require('./editorial/controllers/ferc')
    , fercFirm = require('./editorial/controllers/ferc_firm_transport')
    , scrapy_check = require('./editorial/controllers/scrapy_check')
    , aggregators = require('./editorial/controllers/aggregators')
    , marketing_site = require('./editorial/controllers/marketing_site')
    , alerts = require('./editorial/handlers/hndlr_alerts')
    , customer_alerts = require('./customer/controllers/alerts')
    , editorial_testing = require('./editorial/controllers/testing')
    , press_releases = require('./editorial/controllers/press_releases')
    , investor_presentations = require('./editorial/handlers/hndlr_investor_presentations')
    , products = require('./editorial/controllers/products')
    , si_highlights = require('./customer/strategic_intelligence/highlights')
    , reversePop = require('./editorial/controllers/reverse_population')
    , projectsWeekly = require('./customer/strategic_intelligence/projects-weekly')
    , details_hedges = require('./editorial/controllers/hedges')
    , production = require('./editorial/controllers/production')
    , check_sheets = require('./editorial/controllers/check_sheets')
    , firm_commitments = require('./editorial/controllers/firm_commitments')
    , images = require('./editorial/controllers/images')
    , files = require('./editorial/controllers/file_uploads')
    , testing = require('./editorial/controllers/testing')
    , logs_changes = require('./editorial/controllers/logs_changes')
    , midstream = require('./customer/strategic_intelligence/midstream')
    , excel_api = require('./admin/controllers/excel_api')
    , transactions = require('./editorial/handlers/hndlr_transactions')
    , lng = require('./customer/strategic_intelligence/lng')
    , mandrill = require('./admin/controllers/mandrill')
    , siProduction = require('./customer/strategic_intelligence/production')
    , atomApi = require('./customer/controllers/atom_postgres_api')
    , customerFiles = require('./customer/controllers/customer_files')
    , reportsWidgets = require('./editorial/controllers/reports-widgets')
    , mergersAcquisitions = require('./customer/controllers/mergers_acquisitions')
    , user_subscription_agreements = require('./admin/controllers/user_subscription_agreements')
    , state_production = require('./editorial/production/state_production')

    ;


module.exports = function (app, passport, csrfProtection) {

    //  create the redirect to secure
    switch(process.env.COMPUTERNAME) {
        case 'CRITERION-JCB':
            break;
        case 'GIGIBIT131221':
            break;
        default:
            console.log("****** This is the default process.env.COMPUTERNAME: " + process.env.COMPUTERNAME +" *******");
            app.all('*', ensureSec);
    }

    // change password redirect
    function changePassword(req, res, next){
        if (req.user.CHANGE_PASSWORD_ON_NEXT_LOGIN === true){
            // this has been partially superseded by sending them an email directly
            // and not letting them set their own password
        } else {
            next();
        }
    }


    // marketing section
    app.get('/', marketing_hndlr.home);
    app.get('/index', marketing_hndlr.home);
    app.get('/home', marketing_hndlr.home);
    app.get('/focus', marketing_hndlr.focus);
    app.get('/products', marketing_hndlr.products);
    app.get('/news', news_hndlr.marketingNews);
    app.get('/news_results', news_hndlr.marketingNews);   //This is a testing version
    app.get('/news_article/:collection', news_hndlr.singleArticle);   //This is a testing version
    app.get('/events', marketing_hndlr.about);
    app.get('/about', marketing_hndlr.about);
    app.get('/scrapy_check', marketing_hndlr.home);
    app.get('/contact', marketing_hndlr.contact);
    app.post('/contact', leads_hndlr.createNewLead);
    app.get('/trial_expired', marketing_hndlr.trialExpired);
    app.get('/account_inactive', marketing_hndlr.accountInactive);
    app.get('/account_locked', marketing_hndlr.accountLocked);
    app.get('/login', marketing_hndlr.login);
    app.get('/login_pw_updated', marketing_hndlr.login_pw_updated);
    //app.get('/reset/:token', marketing_hndlr.resetPassword);
    app.get('/reset/:token', function(req, res) {
        users.findOne({
                RESET_PASSWORD_TOKEN : req.params.token
                , RESET_PASSWORD_EXPIRES : { $gt: Date.now() }
            }
            , function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/');
            }
            console.log('correct token');
            var user_subscription_agreements_schema = require('./admin/models/user_subscription_agreements');
            user_subscription_agreements_schema.find()
                .sort({LOAD_DATE: -1})
                .limit(1)
                .exec(function(err, results){
                    console.log("These are the results: " + JSON.stringify(results));
                    res.render('marketing/reset_password'
                        ,{ layout: 'marketing/partials/mkt_layout'
                            , page:{"title" : "Reset Password"
                                , "description" : ""
                            }
                            , token : user.RESET_PASSWORD_TOKEN
                            , DOCUMENT : results[0].DOCUMENT
                            , LOCATION : results[0].LOCATION
                            , LOAD_DATE : results[0].LOAD_DATE
                        }
                    )
                });
        });
    });
    app.post('/reset/:token', users_cntrl.resetPassword);


    //testing
    //app.get('/si_highlights/natural_gas_highlights2', si_highlights.renderNaturalGasHighlights);



    // excel web queries....
    app.get('/excel/midstream_results', excel_api.apiVerification, midstream.excelProjectSummary);
    app.get('/xls/:CUSTOMER_ID/:ITEM',excel_api.apiVerification, excel_api.checkAndRedirect);  //, excel_api.checkAndRedirect
    // http://localhost:3000/xls/5537eefc4abb1d283337da46/midstreamResults?username=jbest2&token=6f8b3e044e89f3177707bfd0aac49f99ec8e64b1

    // atom api
    app.get('/atom/:CUSTOMER_ID/:ITEM',excel_api.apiVerification, excel_api.checkAndRedirect);


    // process the login form
app.post('/c/login', function(req, res, next) {
        //console.log("this is the req.body.returnurl: " + JSON.stringify(req.body));
        //console.log("this is the req.query: " + JSON.stringify(req.query));
        var redirectTo = req.body.returnurl || '/c/';
        passport.authenticate('local-login', {
            successRedirect : redirectTo, // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
      })(req, res, next);
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // ***** global declarations ******
    // ***** http://expressjs.com/api.html ******
    // ***** comment this out to remove all password protection *****
    app.all('*', isLoggedIn);
    app.all('*', csrfProtection);

    //TODO Need to build in the customer contract into this section so that if the contract has expired the coverage stops
    //

    // set website permissions for the user roles
    function allowCustomer(req, res, next){
        var roles = ["customer","admin","editor","developer"];
        var status = ["active"];
        //console.log(req.user.USER_ACCOUNT_LOCKED);
        if (req.user.USER_STATUS_DESC === 'trial'){
            if (req.user.TRIAL_END_DATE < Date.now()){
                res.redirect('/trial_expired')
            } else {
                next();
            }
        }else if ( status.indexOf(req.user.USER_STATUS_DESC) ===-1){
            res.redirect('/account_inactive')
        } else if (req.user.USER_ACCOUNT_LOCKED !==false){
            res.redirect('/account_locked')
        } else if (roles.indexOf(req.user.USER_ROLE_DESC) ===-1){
            res.redirect('/customer/not_authorized')
        } else {
            //console.log('next item');
            next();
        }
    }

    function allowEditors(req, res, next){
        console.log("This is the allowEditors, USER_ROLE_DESC: " + req.user.USER_ROLE_DESC);
        var roles = ["editor","admin","developer"];
        var status = ["active"];
        if ( status.indexOf(req.user.USER_STATUS_DESC) ===-1){
            res.redirect('/account_inactive')
        } else if (req.user.USER_ACCOUNT_LOCKED !==false){
            res.redirect('/account_locked')
        } else if (roles.indexOf(req.user.USER_ROLE_DESC) ===-1) {
            //console.log('this is the not authorized section');
            res.redirect(303, '/customer/not_authorized')
        } else {
            //console.log('next item');
            next();
        }
    }

    function allowAdmin(req, res, next){
        var roles = ["admin","developer"];
        var status = ["active"];
        if ( status.indexOf(req.user.USER_STATUS_DESC) ===-1){
            res.redirect('/account_inactive')
        } else if (req.user.USER_ACCOUNT_LOCKED !==false){
            res.redirect('/account_locked')
        } else if (roles.indexOf(req.user.USER_ROLE_DESC) ===-1) {
            //console.log(req.user.USER_ROLE_DESC);
            //console.log('this is the not authorized section');
            res.redirect(303, '/customer/not_authorized')
        } else {
            //console.log('next item');
            next();
        }
    }

    // Customer Pages       // http://expressjs.com/guide/routing.html
    app.get('/c/', allowCustomer, customer_hndlr.dashboard);
    app.get('/c/index', allowCustomer, customer_hndlr.dashboard);
    app.get('/c/dashboard', allowCustomer, customer_hndlr.dashboard);
    app.get('/c/power', allowCustomer, customer_hndlr.power);
    app.get('/c/natural_gas', allowCustomer, customer_hndlr.natural_gas);
    app.get('/c/crude_oil', allowCustomer, customer_hndlr.crude_oil);
    app.get('/c/alert', allowCustomer, customer_hndlr.alert);
    app.get('/c/news_query', allowCustomer, customer_hndlr.news_query);
    app.get('/c/data_series', allowCustomer, customer_hndlr.data_series);
    app.get('/c/news_summary', allowCustomer, customer_hndlr.news_summary);
    app.get('/c/query_graph', allowCustomer, customer_hndlr.query_graph);
    app.get('/c/query_home', allowCustomer, customer_hndlr.query_home);
    app.get('/c/query_entities', allowCustomer, customer_hndlr.query_entities);
    app.get('/c/query_entities_tickers', allowCustomer, entities_hndlr.searchEntityTicker);
    app.get('/c/query_assets', allowCustomer, customer_hndlr.query_assets);
    app.get('/c/query_projects', allowCustomer, customer_hndlr.query_projects);
    app.get('/c/query_ferc', allowCustomer, customer_hndlr.query_ferc);
    app.get('/c/ferc_documents', allowCustomer, ferc.fercByCollection);  //single snippet modal
    app.get('/c/ferc_results', allowCustomer, ferc.fercDocumentsDockets);
    app.get('/c/relationships_query', allowCustomer, customer_hndlr.relationships_query);
    app.get('/c/reports', allowCustomer, customer_hndlr.reports);
    app.get('/c/entity', allowCustomer, resultsAPI.renderCollection);
    app.get('/c/asset', allowCustomer, resultsAPI.asset);
    app.get('/c/project', allowCustomer, resultsAPI.project);
    app.get('/c/snippet', allowCustomer, snip_cntrl.singleSnippet);
    app.get('/c/postgres_excel', allowCustomer, customer_hndlr.postgres_excel_setup);
    app.get('/c/mergers_acquisitions', allowCustomer, mergersAcquisitions.renderMergersPage);
    app.post('/c/mergers_acquisitions', allowCustomer, mergersAcquisitions.getTransactionResults);


    // FERC FIRM TRANSPORTATION
    app.get('/c/ferc_firm_transport', allowCustomer, fercFirm.renderFirmTransport);
    app.get('/c/ferc_firm_entity', allowCustomer, fercFirm.entityResults);
    app.get('/c/ferc_firm_asset', allowCustomer, fercFirm.assetResults);
    app.get('/c/ferc_firm_points', allowCustomer, fercFirm.pointResults);
    app.get('/c/ferc_query', allowCustomer, fercFirm.queryFirmTransport);


    // Portfolio and related items
    app.get('/c/portfolio_home', allowCustomer, snippet_widgets.portfoliosResults);
    app.get('/c/portfolio_setup', allowCustomer, customer_hndlr.portfolio_setup);
    app.get('/c/portfolio_snapshots', allowCustomer, customer_hndlr.portfolio_snapshots);
    app.get('/api/v2/portfolio_updates', allowCustomer, portfolios_cntrl.portfolioSnapshots);
    app.get('/api/v2/portfolio_dates', allowCustomer, portfolios_cntrl.portfolioSnapshotDates);
    app.post('/api/p1/portfolio_setup', allowCustomer, portfolios_cntrl.createOrUpdatePortfolio);
    app.get('/r/p', allowCustomer, portfolios_cntrl.getUserPortfolios);
    app.post('/r/p', allowCustomer, portfolios_cntrl.deleteUserPortfolios);
    app.get('/u/p', allowCustomer, portfolios_cntrl.userPortfolioResults);
    app.get('/u/pt', allowCustomer, portfolios_cntrl.testingPortfolioDeconstruct);
    app.get('/api/v2/customer_users', allowCustomer, portfolios_cntrl.apiCompanyUsers);


    // Saved folders and related items
    app.get('/c/my_folders', allowCustomer, myfolders_cntrl.my_folders);
    app.get('/c/my_folders_print', allowCustomer, myfolders_cntrl.printPage);
    app.get('/api/v2/folder_names', allowCustomer, myfolders_cntrl.folder_names);
    app.get('/api/v2/belongs_to_folders', allowCustomer, myfolders_cntrl.belongs_to_folders);

    app.post('/api/v2/email_articles', allowCustomer, myfolders_cntrl.emailArticles);
    app.post('/api/v2/create_folder', allowCustomer, myfolders_cntrl.create_folder);
    app.post('/api/v2/rename_folder', allowCustomer, myfolders_cntrl.rename_folder);
    app.post('/api/v2/remove_folder', allowCustomer, myfolders_cntrl.remove_folder);
    app.post('/api/v2/move_all_in_folder', allowCustomer, myfolders_cntrl.move_all_in_folder);
    app.post('/api/v2/copy_all_in_folder', allowCustomer, myfolders_cntrl.copy_all_in_folder);
    app.post('/api/v2/add_to_folder', allowCustomer, myfolders_cntrl.add_to_folder);
    app.post('/api/v2/remove_from_folder', allowCustomer, myfolders_cntrl.remove_from_folder);


    //this is the testing version of the new resultsAPI
    app.get('/c/collection', allowCustomer, resultsAPI.renderCollection);


    //Strategic Intelligence Group
    app.get('/si_highlights/:page', allowCustomer, si_highlights.highlights);
    app.post('/si_highlights/:page', allowCustomer, si_highlights.updateReports);
    app.get('/si_types/:page', allowCustomer, reversePop.reversePopulation);
    app.get('/si_ferc/day', allowCustomer, ferc.renderDailyQuery);
    app.get('/si_ferc/day_results', allowCustomer, ferc.dailyFercFilings);
    app.get('/si_ferc/ferc_highlights', allowCustomer, ferc.renderFercHighlights);
    app.get('/si_ferc/highlight', allowCustomer, ferc.fercHighlightLanding);
    app.get('/si_projects/weekly_projects', allowCustomer, projectsWeekly.weeklyProjects);
    app.get('/si_projects/midstream_publisher', allowEditors, projectsWeekly.midstreamReport);
    app.post('/si_projects/midstream_publisher', allowEditors, projectsWeekly.updateKeyProjects);
    app.get('/si_projects/lng_publisher', allowEditors, projectsWeekly.midstreamReport);
    app.post('/si_projects/lng_publisher', allowEditors, projectsWeekly.updateKeyProjects);
    app.get('/si_projects/midstream', allowCustomer, midstream.dashboard);
    app.get('/si_lng/lng_dashboard', allowCustomer, lng.dashboard);
    app.get('/si_projects/midstream_results', allowCustomer, midstream.projectSummaries);
    app.get('/si_projects/lng_results', allowCustomer, lng.projectSummaries);
    app.get('/si_projects/midstream_changes', allowCustomer, midstream.weeklyChanges);
    app.get('/si_projects/lng_changes', allowCustomer, lng.weeklyChanges);
    app.get('/si_projects/aggregate_data', allowCustomer, midstream.aggregateData);
    app.get('/si_projects/lng_aggregate_data', allowCustomer, lng.aggregateData);
    app.get('/si_projects/midstream_edit', allowEditors, midstream.dashboard);

    app.get('/si_production/natural_gas', allowCustomer, siProduction.renderNaturalGasProduction);
    app.get('/si_production/crude_oil', allowCustomer, siProduction.renderCrudeOilProduction);

    // widgets
    app.get('/widgets/production_by_operator', allowCustomer, siProduction.productionByOperator);


    // Froala Upload Editor
    app.post('/editorial/uploadReportImage', allowEditors, reportsWidgets.uploadImage);


    // Change Logs Rendering
    app.get('/logs/change_test', allowCustomer, logs_changes.renderLogs);


    app.post('/s/s', allowCustomer, snippets_cntrl.querySnippets);

    // Editorial Pages
    app.get('/editorial/', allowEditors, editorial.article_input);
    app.get('/editorial/editorial_home', allowEditors, editorial.article_input);
    app.get('/editorial/article_input', allowEditors, editorial.article_input);
    app.get('/editorial/article_review', allowEditors, editorial.article_review);
    app.get('/editorial/alert_input', allowEditors, editorial.alert_input);
    app.post('/editorial/alert_input', allowEditors, alerts.createAlert);
    app.post('/editorial/alert_release', allowEditors, alerts.releaseAlerts);
    app.get('/editorial/document_upload', allowEditors, editorial.document_upload);
    app.get('/editorial/feed_summary', allowEditors, editorial.feed_summary);
    app.get('/editorial/new_items', allowEditors, editorial.new_items);
    app.get('/editorial/source_input', allowEditors, editorial.source_input);
    app.get('/editorial/entities', allowEditors, editorial.entities);
    app.get('/editorial/assets', allowEditors, editorial.assets);
    app.get('/editorial/projects', allowEditors, editorial.projects);
    app.get('/editorial/snippets_approval', allowEditors, snippets_cntrl.reviewList);
    app.get('/editorial/snippet_edit', allowEditors, snippets_cntrl.reviewSingleSnippet);
    app.post('/editorial/snippet_edit', allowEditors, snippets_cntrl.snippetsUpsert);
    app.post('/editorial/snippet_edit2', allowEditors, snippet_hndlr.updateSnippetText);
    app.get('/editorial/data_point_edit', allowEditors, data_points_review.reviewSingleDataPoint);
    app.post('/editorial/data_point_edit', allowEditors, data_points_review.dataPointUpsert);
    app.post('/editorial/trash_data_point', allowEditors, data_points_review.trashDataPoint);
    app.post('/api/p1/article-release', allowEditors, snippets_cntrl.snippetRelease);
    //app.get('/editorial/postgres_metadata', allowEditors, editorial.postgresMetadata);
    app.get('/editorial/postgres_metadata', allowEditors, postgres_metadata.renderMetadataPage);
    app.post('/editorial/postgres_metadata', allowEditors, postgres_metadata.createOrUpdatePostgresMetadata);
    app.get('/editorial/get_postgres_dataseries', allowEditors, postgres_metadata.getDataSeries);

    app.get('/editorial/neo4jupdate', allowAdmin, editorial.neo4jupdate);
    app.get('/editorial/company_mappings', allowEditors, aggregators.prMissingCompanies);
    app.post('/editorial/createNewTicker', allowEditors, entities_hndlr.createNewTicker);
    app.get('/editorial/marketing_event_input', allowEditors, editorial.marketing_events);
    app.post('/editorial/marketing_event_input', allowEditors, marketing_site.createMarketingEvent);
    app.get('/editorial/press_releases_review', allowEditors, press_releases.reviewPressReleases);
    app.get('/editorial/widgetPressReleases', allowEditors, press_releases.reviewPressReleases);
    app.post('/editorial/press_releases_review', allowEditors, press_releases.updatePressReleases);
    app.get('/editorial/upload_investor_presentations', allowEditors, editorial.investor_presentations);
    app.post('/editorial/upload_investor_presentations', allowEditors, investor_presentations.UploadNewPresentation);
    app.get('/editorial/product_input', allowEditors, products.createCommentary);
    app.post('/editorial/product_input', allowEditors, products.updateCommentary);
    app.get('/editorial/product_review', allowEditors, products.getCommentaryToReivew);
    app.get('/editorial/widgets/widgetCommentaryReview', allowEditors, products.reviewSingleProduct);
    app.post('/editorial/image_upload', allowEditors, images.uploadImage);
    app.post('/editorial/file_upload', allowEditors, files.uploadFile);
    app.post('/editorial/copy_project_to_asset', allowEditors, projects_hndlr.copyProjectToAsset);


    // State Production Items
    app.get('/editorial/production_state_mappings', allowEditors, state_production.RenderStateMappings);
    app.post('/editorial/production_state_mappings', allowEditors, state_production.updateStateMappings);
    app.post('/editorial/createEntityAndOperatorMappings', allowEditors, state_production.createAndUpdateEntityOperators);


    // Hedges and related
    app.post('/editorial/hedge_input', allowEditors, details_hedges.createOrUpdateHedges);

    // Production and related
    app.post('/editorial/production_input', allowEditors, production.createOrUpdateProduction);

    // ferc update and display
    app.get('/editorial/ferc', allowEditors, ferc.getNewCompanies);
    app.post('/editorial/ferc', allowEditors, ferc.updateCompanies);
    app.get('/editorial/ferc_documents', allowEditors, ferc.pullFercDocuments);
    app.post('/editorial/ferc_update_docs', allowEditors, ferc.updateFercDocuments);
    app.post('/editorial/ferc_update_docs_status', allowEditors, ferc.updateReviewedFlag);
    app.get('/editorial/ferc_docket_mappings', allowEditors, aggregators.fercDocketsMappings);
    app.post('/editorial/ferc_docket_mappings', allowEditors, aggregators.updateFercDocketsMappings);
    app.get('/editorial/ferc_render', allowEditors, aggregators.testGetDocketsAndDailyFilings);
    app.post('/editorial/ferc_docket_highlights', allowEditors, ferc.createHighlight);
    app.get('/c/ferc_document_types', allowEditors, ferc.reBuildFercDocumentTypes);  //single snippet modal

    // Check Sheets
    app.get('/editorial/check_dashboard', allowEditors, check_sheets.getDashboard);

    // Firm Transportation and Commitments
    app.get('/editorial/firm_commitments', allowEditors, firm_commitments.firm_commitments);
    app.post('/editorial/firm_commitments', allowEditors, firm_commitments.createUpdateFirmCommitment);

    // Transaction Sheets
    app.get('/editorial/transactions', allowEditors, transactions.renderTransactionPage);
    app.get('/editorial/transactions_data', allowEditors, transactions.getTransactionResults);
    app.post('/editorial/transactions', allowEditors, transactions.createOrUpdateTransaction);

    // render region tree and related
    app.get('/editorial/region_tree', allowEditors, geo_hndlr.renderRegionTree);
    app.get('/editorial/region_all_children', allowEditors, geo_hndlr.createAllChildren);

    // render atom api support pages
    app.get('/atom/paths', allowAdmin, atomApi.renderApiInputPage);
    app.post('/atom/create_paths', allowAdmin, atomApi.createOrUpdateOdataPostgresPaths);



    app.get('/editorial/earnings_calendar', allowEditors, earnings_calendars.yahoo_earnings_calendar_view);
    app.get('/api/e1/earnings_calendar', allowEditors, earnings_calendars.yahoo_earnings_api);
    app.get('/e/sr', allowEditors, snippets_cntrl.snippetsReview);
    app.get('/e/ent', allowEditors, entities_dataTables.entitiesTable);
    app.get('/api/v2/assets', allowEditors, entities_dataTables.assetsTable);
    app.get('/api/v2/projects', allowEditors, entities_dataTables.projectsTable);

    app.get('/editorial/article_scraper_results', allowEditors, potential_articles.article_scraper_results);
    app.get('/api/e1/new_articles', allowEditors, potential_articles.new_articles_api);
    app.post('/api/e1/new_articles', allowEditors, potential_articles.new_articles_update);
    app.post('/api/e1/follow_up_articles', allowEditors, potential_articles.clearFollowUpArticles);
    app.get('/editorial/follow_up_articles', allowEditors, potential_articles.follow_up_articles);
    app.get('/api/e1/follow_up_articles/:DaysBack', allowEditors, potential_articles.follow_up_articles_api);



    // Administration routes
    app.get('/admin/', allowAdmin, editorial.article_input);
    app.get('/admin/user_functions', allowAdmin, users_cntrl.userFunctions);
    app.get('/admin/signup', allowAdmin, users_cntrl.signup);
    app.post('/admin/signup', allowAdmin, passport.authenticate('local-signup', {
        successRedirect : '/c/', // redirect to the secure profile section
        failureRedirect : '/c/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.post('/admin/newUser', allowAdmin, users_cntrl.createOrUpdateUser); //createNewUser // this is jcb version of creating a new user
    app.post('/api/p1/customers', allowAdmin, users_cntrl.createOrUpdateCustomer);
    app.post('/api/p1/coverages', allowAdmin, users_cntrl.createCoverage);
    app.get('/admin/file_upload', allowAdmin, reports_cntrl.reportUploadPage);
    app.post('/admin/report_upload', allowAdmin, reports_cntrl.UploadNewReport);
    app.post('/api/p1/rpt_common_reports', allowAdmin, reports_cntrl.CreateCommonReport);
    app.get('/r/u', allowCustomer, reports_widgets.naturalGasReports);
    app.get('/r/c', allowCustomer, reports_widgets.customerReports);
    app.get('/admin/portfolio_admin', allowAdmin, admin_hndlr.portfolio_admin);
    app.post('/api/p1/delivery_methods', allowAdmin, portfolios_cntrl.createDeliveryMethod);
    app.post('/api/p1/portfolio_deliveries', allowAdmin, portfolios_cntrl.createPortfolioDeliveries);
    app.post('/api/p1/portfolio_types', allowAdmin, portfolios_cntrl.createPortfolioTypes);
    app.post('/api/p1/portfolio_views', allowAdmin, portfolios_cntrl.createPortfolioViews);
    app.post('/admin/usr_lock', allowAdmin, users_cntrl.unlockAccount);
    app.post('/admin/usr_status', allowAdmin, users_cntrl.updateUserStatus);
    app.post('/admin/usr_trial', allowAdmin, users_cntrl.updateTrialDates);
    app.post('/admin/usr_pw_unlock', allowAdmin, users_cntrl.resetUserPassword);
    app.get('/api/p1/users', allowAdmin, users_dataTables.customersUsersTable);
    app.get('/admin/users_coverages', allowAdmin, reports_cntrl.getUsersCoverages);
    app.get('/admin/upload_new_subscriber_agreement', allowAdmin, user_subscription_agreements.renderAddNewAgreement);
    app.post('/admin/upload_new_subscriber_agreement', allowAdmin, user_subscription_agreements.addNewAgreement);




    // dataTables routes
    app.get('/c/s/ts', allowCustomer, snippet_widgets.smallSummaryWidget);
    app.get('/c/s/s', allowCustomer, snippet_widgets.snippetsQuery);
    app.post('/c/s/p', allowCustomer, snippet_widgets.snippetsQuery);
    app.get('/c/d/s', allowCustomer, snippet_widgets.dataPointsQuery);
    app.get('/c/s/pu', allowCustomer, snippet_widgets.portfolioSnippetQuery);
    app.get('/c/s/pr', allowCustomer, snippet_widgets.portfoliosResults);
    app.get('/c/s/alert', allowCustomer, customer_alerts.renderCustomerAlerts);


    // Production API
    app.post('/api/p1/geo_countries', allowEditors, geo_hndlr.createNewCountry);
    app.post('/api/p1/geo_regions' , allowEditors, geo_hndlr.createNewRegion);
    app.post('/api/p1/geo_regions_pc' , allowEditors, geo_hndlr.createUpdateRegion);
    app.post('/api/geo/states', allowEditors, geo_hndlr.createNewState);

    app.get('/api/geo/states', allowCustomer, geo_hndlr.states);
    app.get('/api/geo/states/:id', allowCustomer, geo_hndlr.allStatesFromCountry);
    app.get('/api/geo/provinces', allowCustomer, geo_hndlr.provinces);
    app.get('/api/geo/provinces/:id', allowCustomer, geo_hndlr.allProvincesFromCountry);
    app.get('/api/geo/countries', allowCustomer, geo_hndlr.countries);
    app.get('/api/geo/countries/:id', allowCustomer, geo_hndlr.singleCountry);

    //FERC Specific Items ** DO NOT DELETE **  This doesn't translate to the new API
    app.get('/api/v2/fercDistinct', allowCustomer, ferc.fercDistinctAPI);
    app.get('/api/v2/fercDocuments', allowCustomer, ferc.fercResultsAPI);


    app.get('/api/entities', allowCustomer, entities_hndlr.entities);
    app.post('/api/entities', allowEditors, entities_hndlr.createNewEntity);
    app.post('/api/assets', allowEditors, assets_hndlr.createNewAsset);
    app.post('/api/projects', allowEditors, projects_hndlr.createOrUpdateProject);

    app.post('/api/p1/source_categories', allowEditors, source_hndlr.createNewSourceCategory);
    app.post('/api/p1/source_types', allowEditors, source_hndlr.createNewSourceType);
    app.post('/api/p1/source_data', allowEditors, source_hndlr.createNewSourceData);
    app.post('/api/p1/source_subscriptions', allowEditors, source_hndlr.createNewSubscription);
    app.post('/api/p1/source_scraper_details', allowEditors, source_hndlr.createNewScraper);
    app.post('/api/p1/source_docs', allowEditors, source_hndlr.createNewDocument);


    // Data and Metadata items
    app.post('/api/p1/metadata_items', allowEditors, data_hndlr.createNewMetadata);
    app.post('/api/p1/data_points', allowEditors, data_hndlr.createNewDataPoint);
    app.post('/api/p1/snippets', allowEditors, snippet_hndlr.createNewSnippet);

    // misc items used to populate the editorial pages.
    // Most of these need to be shifted to the api
    app.get('/api/misc/asset_status', allowCustomer, new_items_hndlr.asset_statuses);
    app.get('/api/misc/asset_status/:id', allowCustomer, new_items_hndlr.asset_status);
    app.post('/api/misc/asset_status', allowEditors, new_items_hndlr.createNewAssetStatus);
    app.get('/api/misc/categories', allowCustomer, new_items_hndlr.categories);
    app.get('/api/misc/categories/:id', allowCustomer, new_items_hndlr.category);
    app.get('/api/misc/cmdty_class', allowCustomer, new_items_hndlr.cmdty_class);
    app.post('/api/misc/cmdty_class', allowEditors, new_items_hndlr.createNewCmdty);
    app.get('/api/misc/exchanges', allowCustomer, new_items_hndlr.exchanges);
    app.get('/api/misc/io', allowCustomer, new_items_hndlr.io);
    app.post('/api/misc/io', allowEditors, new_items_hndlr.createNewIO);
    app.post('/api/misc/friendly_names', allowEditors, new_items_hndlr.createNewFriendlyName);
    app.post('/api/p1/misc_periods', allowEditors, new_items_hndlr.createNewPeriod);
    app.post('/api/p1/misc_tags', allowEditors, new_items_hndlr.createNewTag);
    app.get('/api/misc/project_status', allowCustomer, new_items_hndlr.project_statuses);
    app.get('/api/misc/project_status/:id', allowCustomer, new_items_hndlr.project_status);
    app.get('/api/misc/project_types', allowCustomer, new_items_hndlr.project_types);
    app.get('/api/misc/project_types/:id', allowCustomer, new_items_hndlr.project_type);
    app.post('/api/misc/project_types', allowEditors, new_items_hndlr.createNewProjectType);
    app.get('/api/misc/sub_cat', allowCustomer, new_items_hndlr.sub_categories);
    app.post('/api/misc/sub_cat', allowEditors, new_items_hndlr.createNewSubCategory);
    app.get('/api/misc/sub_cat_group/:id', allowCustomer, new_items_hndlr.sub_category_group);
    app.get('/api/misc/sub_cat/:id', allowCustomer, new_items_hndlr.singleSubCat);
    app.get('/api/misc/sub_cmdty', allowCustomer, new_items_hndlr.sub_commodities);
    app.get('/api/misc/sub_cmdty/:id', allowCustomer, new_items_hndlr.sub_commodity_group);
    app.get('/api/misc/units', allowCustomer, new_items_hndlr.units);
    app.post('/api/misc/units', allowEditors, new_items_hndlr.createNewUnit);
    app.post('/api/misc/firm_commitment_type', allowEditors, new_items_hndlr.updateMiscFirmCommitmentTypes);
    app.post('/api/misc/image_types', allowEditors, images.createNewImageType);
    app.post('/api/misc/transaction_categories', allowEditors, new_items_hndlr.createTransactionCategory);
    app.post('/api/entities/sectors', allowEditors, new_items_hndlr.createNewSector);
    app.post('/api/entities/industries', allowEditors, new_items_hndlr.createNewIndustry);

    app.get('/api/v2/snippet_titles', allowEditors, snippets_cntrl.snippetTitles);
    app.get('/api/v2/entity_names', allowEditors, entities_hndlr.EntityNames);
    app.post('/api/p1/misc_financial_categories', allowEditors, new_items_hndlr.createNewFinancialCategory);
    app.post('/api/p1/misc_asset_types', allowEditors, new_items_hndlr.createNewAssetType);

    // postgres api
    app.get('/api/v2/postgres_metadata', allowEditors, postgres_api.postgresMetadataList);
    app.get('/api/v2/consol/:schemaDb', allowCustomer, postgres_api.postgresDataSeries);
    app.get('/api/v2/maxPostDateMaxVersion', allowCustomer, postgres_api.postgresMaxPostDateMaxVersion);
    app.get('/api/v2/maxPostDateMaxVersionForecast', allowCustomer, postgres_api.postgresMaxPostDateMaxVersionForecast);
    app.get('/api/v2/maxPostDateMaxVersionMulti', allowCustomer, postgres_api.multiplePostgresMaxPostDateMaxVersion);
    app.get('/api/v2/pg_combined', allowAdmin, postgres_api.pgCombined);
    app.get('/api/v2/metadataPostgres', allowCustomer, postgres_api.metadataPostgres);
    app.post('/api/v2/metadataPostgres', allowCustomer, postgres_api.metadataPostgres);

    app.get('/api/v2/scrapy_check', allowEditors, scrapy_check.checkItems);    // This is visible to the public so need to be careful with it

    // neo4j api
    app.get('/api/v2/neo/createFullArrayRelationship', allowAdmin, neoAPI.createFullArrayRelationship);
    app.get('/api/v2/neo/createFullSingleRelationship', allowAdmin, neoAPI.createFullSingleRelationship);
    app.get('/api/v2/neo/createNestedArray', allowAdmin, neoAPI.createNestedArray);
    app.get('/api/v2/neo/testUpdateId', allowAdmin, neoAPI.testUpdateId);
    app.get('/api/v2/neo/testUpdateNestedId', allowAdmin, neoAPI.testNestedUpdateId);
    app.get('/api/v2/neo/cypherQuery', allowCustomer, neoAPI.runCypherQuery);
    app.get('/api/v2/neo/cypherRelationships', allowCustomer, neoAPI.cypherRelationships);
    app.get('/api/v2/neo/neo4j_sidebar', allowCustomer, neoAPI.neo4jSidebar);


    //MongoDb Admin API
    app.get('/api/v2/users', allowAdmin, users_api.usersApi);
    app.get('/api/admin1/:collection', allowAdmin, users_api.adminAPI);

    //Customer API, which will replace the express-restify-mongoose
    app.get('/api/v3/:collection', allowCustomer, customers_api.customerAPI);


    // Customer Specific Pages
    app.get('/c/customer_files', allowCustomer, customerFiles.getCustomerFiles);



    // testing
    app.get('/editorial/calcDiff', allowEditors, editorial_testing.calcDiff);
    app.get('/editorial/testing_article_input', allowEditors, editorial.testing_article_input);
    app.get('/admin/testing', allowAdmin, admin_hndlr.testing);
    app.get('/admin/blank', allowAdmin, admin_hndlr.testing);
    app.get('/admin/flash', function(req, res){
        // Set a flash message by passing the key, followed by the value, to req.flash().
        req.flash('info', 'Flash is back!');
        res.redirect('/admin');
    });
    app.get('/editorial/blank', allowAdmin, editorial.blank);
    app.get('/editorial/test_asset', allowAdmin, snippets_cntrl.testQuery);
    app.get('/c/chart_single', allowAdmin,postgres_api.singlePostgresChart);

    app.get('/api/v2/neo/insert', allowCustomer, neoAPI.testInsert);
    app.get('/api/v2/neo/read', allowCustomer, neoAPI.testRead);
    app.get('/api/v2/neo/readLabels', allowCustomer, neoAPI.testReadLabels);
    app.get('/api/v2/neo/listLabelIndexes', allowCustomer, neoAPI.testListLabelIndexes);
    app.get('/api/v2/neo/listAllLabels', allowCustomer, neoAPI.testListAllLabels);
    app.get('/api/v2/neo/readNodesWithLabelsAndProperties', allowCustomer, neoAPI.testReadNodesWithLabelsAndProperties);
    app.get('/api/v2/neo/neoCreateEntityAsset', allowAdmin, neoAPI.neoCreateAssetEntity);

    app.get('/editorial/getWunderlist/:collection', allowEditors, press_releases.getWunderlistLists);
    app.get('/editorial/sampleTask', allowEditors, press_releases.getWunderlistTasks);
    app.get('/admin/testCoverage', allowAdmin, reports_cntrl.testCoverages);


    app.get('/c/testing', allowAdmin, customer_hndlr.testing);
    //app.get('/c/feedRss', allowAdmin, news_hndlr.renderRss);

    //test mandrill
    app.get('/admin/mandrillTest', allowAdmin, mandrill.testingMandrill);


    //test capture changes
    app.get('/editorial/testing_change_capture', allowAdmin, testing.logChanges);


    // Test reverse Population
    app.get('/editorial/reversePop', allowCustomer, reversePop.reversePopulation);
    app.get('/editorial/updateAssetTypes', allowEditors, reversePop.updateAssetTypesModel);

    // Test PDF Creation
    //app.get('/editorial/createPdf', allowEditors, si_highlights.createPdf);

    // Froala Editor
    app.get('/editorial/testFroala', allowEditors, reportsWidgets.testingFroala);


    // not sure if this is a test.... this may be in production
    app.get('/reset_password', function(req, res){
        var user_subscription_agreements_schema = require('./admin/models/user_subscription_agreements');
        user_subscription_agreements_schema.find()
            .sort({LOAD_DATE: -1})
            .limit(1)
            .exec(function(err, results){
                console.log("These are the results: " + JSON.stringify(results));
                res.render('./views/marketing/reset_password'
                    ,{ layout: 'marketing/partials/mkt_layout'
                        , page:{"title" : "Reset Password"
                            , "description" : ""
                        }
                        , token : user.RESET_PASSWORD_TOKEN
                        , DOCUMENT : results[0].DOCUMENT
                        , LOCATION : results[0].LOCATION
                        , LOAD_DATE : results[0].LOAD_DATE
                    }
                )
            });
    });

    // Test the portfolio stuff
    var scheduler = require('./scheduler.js');
    app.get('/test/portfolios', allowEditors, scheduler.testPorfolio);



    // Testing API
    app.get('/c/geotest', allowAdmin, snip_cntrl.GeoCountries);
    app.get('/api/v2/crit/rpt_uploaded_reports', allowAdmin, reports_widgets.reportMatchTest);
    //app.get('/admin/reportResults', allowAdmin, reports_cntrl.emailReport);
    app.get('/api/v2/env', allowAdmin,function(req, res){
        res.json(process.env);
    });
    app.get('/api/v100', allowAdmin, customers_api.testRegex)

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login?returnurl=' + req.url);
}

function ensureSec(req, res, next){
    console.log(req.headers["x-forwarded-proto"]);
    if (req.headers["x-forwarded-proto"] === "https"){
        return next();
    } else {
        res.redirect("https://" + req.headers.host + req.url);
    }
}
