var restify = require('./lib/express-restify-mongoose/express-restify-mongoose');     // This creates the API
var methodOverride = require('method-override');       //  related to the express-restify-mongoose  supposedly required

module.exports = function (router){
// Collections needed for Restify Application
    //Still Active
    //var entities = require('./editorial/models/entities.js');     // This is for the express-restify-mongoose API.  Need to define routes for all items here
    //var entities_tickers = require('./editorial/models/entities_tickers.js');
    var common_reports = require('./admin/models/rpt_common_reports.js');
    var uploaded_reports = require('./admin/models/rpt_uploaded_reports.js');
    var delivery_methods = require('./admin/models/misc_delivery_methods.js');
    var portfolio_deliveries = require('./admin/models/portfolio_deliveries.js');
    var portfolio_types = require('./admin/models/portfolio_types.js');
    var portfolio_views = require('./admin/models/portfolio_views.js');
    var qc_review_statuses = require('./editorial/models/qc_review_statuses.js');


    //// Major databases
    //var assets = require('./editorial/models/assets.js');
    //var projects = require('./editorial/models/projects.js');
    //
    //// geospatial
    //var geo_regions = require('./editorial/models/geo_regions.js');
    //var geo_countries = require('./editorial/models/geo_countries.js');
    //var geo_states = require('./editorial/models/geo_states.js');
    //var geo_provinces = require('./editorial/models/geo_provinces.js');
    //var geo_counties = require('./editorial/models/geo_counties.js');
    //
    //// misc items
    //var misc_asset_status = require('./editorial/models/misc_asset_status.js');
    //var misc_category_classes = require('./editorial/models/misc_category_classes.js');     // This is for the express-restify-mongoose API.  Need to define routes for all items here
    //var misc_commodity_classes = require('./editorial/models/misc_commodity_classes.js');     // This is for the express-restify-mongoose API.  Need to define routes for all items here
    //var misc_exchanges = require('./editorial/models/misc_exchanges.js');     // This is for the express-restify-mongoose API.  Need to define routes for all items here
    //var misc_io = require('./editorial/models/misc_io.js');
    //var misc_periods = require('./editorial/models/misc_periods.js');
    //var misc_project_status = require('./editorial/models/misc_project_statuses.js');
    //var misc_project_types = require('./editorial/models/misc_project_types.js');
    //var misc_sub_cat = require('./editorial/models/misc_sub_categories.js');     // This is for the express-restify-mongoose API.  Need to define routes for all items here
    //var misc_sub_cmdty = require('./editorial/models/misc_sub_commodities.js');     // This is for the express-restify-mongoose API.  Need to define routes for all items here
    //var misc_tags = require('./editorial/models/misc_tags.js');
    //var misc_units = require('./editorial/models/misc_units.js');
    //var misc_financial_categories = require('./editorial/models/misc_financial_categories.js');
    //var misc_asset_types = require('./editorial/models/misc_asset_types.js');
    //
    //// editorial sources
    //var source_categories = require('./editorial/models/source_categories.js');
    //var source_data = require('./editorial/models/source_datas');
    //var source_scraper_details = require('./editorial/models/source_scraper_details.js');
    //var source_docs = require('./editorial/models/source_docs.js');
    //var source_types = require('./editorial/models/source_types.js');
    //var source_subscriptions = require('./editorial/models/source_subscriptions.js');
    //
    //// article entry
    //var metadata_items = require('./editorial/models/metadata_items.js');
    //var metadata_postgres = require('./editorial/models/metadata_postgres.js');
    //var data_points = require('./editorial/models/data_points.js');
    //var snippets = require('./editorial/models/snippets.js');

    // Reports

    // Administration
    //var coverages = require('./admin/models/coverages.js');
    //var customers = require('./admin/models/customers.js');
    //var portfolios = require('./admin/models/portfolios.js');
    //var user_roles = require('./admin/models/user_roles.js');
    //var user_statuses = require('./admin/models/user_statuses.js');
    //var users = require('./admin/models/users.js');

    // Portfolios


// This is important and we need to add in each new route we want the API to use
    //restify.serve(router, entities);
    //restify.serve(router, entities_tickers);
    restify.serve(router, common_reports);
    restify.serve(router, uploaded_reports);
    restify.serve(router, delivery_methods);
    restify.serve(router, portfolio_deliveries);
    restify.serve(router, portfolio_types);
    restify.serve(router, portfolio_views);
    restify.serve(router, qc_review_statuses);


    //restify.serve(router, assets);
    //restify.serve(router, projects);
    //
    //restify.serve(router, geo_regions);
    //restify.serve(router, geo_counties);
    //restify.serve(router, geo_countries);
    //restify.serve(router, geo_provinces);
    //restify.serve(router, geo_states);
    //restify.serve(router, misc_asset_status);
    //restify.serve(router, misc_category_classes);
    //restify.serve(router, misc_commodity_classes);
    //restify.serve(router, misc_exchanges);
    //restify.serve(router, misc_io);
    //restify.serve(router, misc_periods);
    //restify.serve(router, misc_project_status);
    //restify.serve(router, misc_project_types);
    //restify.serve(router, misc_sub_cat);
    //restify.serve(router, misc_sub_cmdty);
    //restify.serve(router, misc_tags);
    //restify.serve(router, misc_units);
    //restify.serve(router, misc_financial_categories);
    //restify.serve(router, misc_asset_types);
    //
    //restify.serve(router, source_categories);
    //restify.serve(router, source_data);
    //restify.serve(router, source_scraper_details);
    //restify.serve(router, source_docs);
    //restify.serve(router, source_types);
    //restify.serve(router, source_subscriptions);
    //restify.serve(router, metadata_items);
    //restify.serve(router, metadata_postgres);
    //restify.serve(router, data_points);
    //restify.serve(router, snippets);

    //restify.serve(router, coverages);
    //restify.serve(router, customers);
    //restify.serve(router, portfolios);
    //restify.serve(router, user_roles);
    //restify.serve(router, user_statuses);
    //restify.serve(router, users);


};
