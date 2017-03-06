var moment = require('moment');

// need to use this for the date at the bottom
// add this into the footer pages to always have the most up to date, date {{yr}}

module.exports = function(hbs) {

    hbs.registerHelper({
        year: function () {
/*
            var dt = new Date();
            dt = dt.getFullYear();
*/
            return "2016";
        }

        , ifActive: function (index) {
            if (index == 0) {
                return "active"
            }
        }

        , ifActiveIn: function (index) {
            if (index == 0) {
                return "active in"
            }
        }

        , formatMongoDate : function(date){
            if (typeof date !== 'undefined'){
                if (date instanceof Date){
                    return moment(date).format('M/D/YYYY')
                } else {
                    return date
                }
            }
        }

        , formatDate : function(date, fmt){
            if (typeof date !== 'undefined'){
                return moment(date).format(fmt)
            }
        }

        , addDays : function(date, days){
            if (typeof date !== 'undefined'){
                return moment(date).add('days', (days)? days: 1).format('M/D/YYYY');
            }
        }


        , checkDateAndFormat : function(string){
            try{
                if (string[0].length !== null && string[0].length == 24 && isNaN(string[0].substring(0,9))== true){
                    return moment(new Date(string[0])).format('M/D/YYYY')
                } else {
                    return string;
                }
            } catch (err){
                //console.log("checkDateAndFormat err: " + err);
                return string
            }
        }

        , formatKeyChanges : function(string){
            console.log("This is the formatKeyChanges: " + string);
            try {
                switch (string){
                    case "null": return "";
                    case "" : return "";
                    default :
                        if (moment(string).isValid() == true){
                            console.log("This is the date: " + string);
                            return moment(string).format("M/D/YYYY")
                        } else {
                            console.log("This is not a date: " + string);
                            switch (string){
                                case "552152ee8215d6ac32947cb7": return "Planned";
                                case "552152ee8215d6ac32947cb8": return "Commissioning";
                                case "552152ee8215d6ac32947cb9": return "On Hold";
                                case "552152ee8215d6ac32947cba": return "Cancelled";
                                case "552152ee8215d6ac32947cb6": return "Under Construction";
                                case "55b8fcd129522dc451b5688b": return "Commercial Operation";
                                case "55ef4a87772c5d2410a361ce": return "Announced";
                                case "560448c85f0ac6a40eca8c99": return "Regulatory Filings";
                                case "56fc2d811caea2903d44c85c": return "Received Regulatory Approval";
                                case "561fdf997ea1d1a81aebfd3a": return "Front-End Engineering Design";
                                case "5762c5a501917d9c2a68e3c2": return "Tendering";
                                case "5762c5b201917d9c2a68e3c3": return "Awarded";
                                default: return string;
                            }
                            return string;
                        }
                }
            } catch (err){
                console.log("This is the formatKeyChanges error: " + err);
                return string;
            }
        }

        , inc : function(value){
            return parseInt(value) + 1;
        }

        , parseText : function(txt, parseCond){
            if (typeof txt !== 'undefined'){
                var results = [];
                results = txt[0].split(parseCond);
                return results.filter(function(n){ return n !== ''}).join(", ");
            }
        }

        , parseJson : function(txt){
            if (typeof txt !== 'undefined'){
                return JSON.parse(txt);
            }
        }
        , stringifyJson : function(txt){
            if (typeof txt !== 'undefined'){
                return JSON.stringify(txt);
            } else {
                return '\'\'';
            }
        }

        , ifZero : function(value){
            if (typeof value !=='undefined' && value !== null){
                if (value != "0"){
                    function numberWithCommas(x) {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    return numberWithCommas(value);
                } else {
                    return "0";
                }
            }
        }


        , truncate : function (str, len) {  //, len
            if (typeof str !== 'undefined'){
                if (str.length > len && str.length > 0) {
                    var new_str = str + " ";
                    new_str = str.substr (0, len);
                    new_str = str.substr (0, new_str.lastIndexOf(" "));
                    new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

                    return new hbs.SafeString ( new_str +'...' );
                }
                return str;
            }
        }

        , checkUndef : function(str){
            if (str !== "undefined"){
                return str;
            }
        }

        , preChecked : function(bool){
            if (bool == true) {
                return "checked";
            } else {
                return "";
            }
        }

        , ifCond : function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }

        , checkNullItems : function( i1, i2, i3, i4, options){
            console.log("typeof this: " + typeof i1);
            if (typeof i1 !== 'undefined' || typeof i2 !== 'undefined' || typeof i3 !== 'undefined' || typeof i4 !== 'undefined'){
                options.fn(this)
            } else {
                return options.inverse(this);
            }
        }

        , paginationActivePage : function(index,target){
            if(typeof index !== 'undefined' && typeof target !== 'undefined' ){
                return "active"
            }
        }

        , incDash: function(index){
            var inc = parseInt(index) || 0;
            if (inc > 0){
                return "-";
            }
        }

        , friendlyFeeds : function(text){
            switch (text){
                case "CriterionOil-Gas":
                    return "MarketWired";
                case "Business Wire Manufacturing News":
                    return "Business Wire";
                default:
                    return text;
            }
        }

        , selectTrueFalse : function(bool){
            if (typeof bool !== 'undefined'){
                switch (bool){
                    case true :
                        return "selected";
                    case false:
                        return "selected";
                    default :
                        return "";
                }
            }
        }

        , selectTrueFalseNew : function(bool, item){
            if (typeof bool !== 'undefined' && typeof item !== 'undefined'){
                if (bool == item){
                    return "selected"
                }
            }
        }

        , numberWithCommas: function(x) {
            try{
                if (typeof x !== 'undefined' && x !== null){
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    return x;
                }
            } catch(err){
                console.log("this is the numberWithCommas err: " + err);
                return x;
            }
        }
        , replaceChars : function(str, rep){
            return str.replace(" ", rep);
        }

        , googleFinance : function(exchange, ticker){

            if (typeof exchange !== 'undefined'){
                switch (exchange){
                    case "NYSE":
                        return '<a href="https://www.google.com/finance?q=' + exchange + '%3A' + ticker + '&fstype=ii" target="_blank">'+ exchange + ':' + ticker + ' from Google Finance</a>'
                    case "NASDAQ":
                        return '<a href="https://www.google.com/finance?q=' + exchange + '%3A' + ticker + '&fstype=ii" target="_blank">'+ exchange + ':'  + ticker + ' from Google Finance</a>'
                    case "AMEX":
                        return '<a href="https://www.google.com/finance?q=' + exchange + '%3A' + ticker + '&fstype=ii" target="_blank">'+ exchange + ':'  + ticker + ' from Google Finance</a>'
                }
            }
        }

        , pluralize : function(number, singular, plural) {
            return number === 1 ? singular : plural;
        }

        , friendlyQti : function(type, qti){
            switch (type){
                case "storage":
                    switch (qti){
                        case "M2": return "Storage Injections";
                        case "IJ": return "Storage Injections";
                        case "S8": return "Storage Injections";
                        case "MQ": return "Storage Withdrawals";
                        case "WR": return "Storage Withdrawals";
                        case "S9": return "Storage Withdrawals";
                        case "SB": return "Storage Area";
                        default: return qti;
                    }
                    break;
                case "transportation":
                    switch (qti){
                        case "M2": return "Receipt Points";
                        case "MQ": return "Delivery Points";
                        case "MV": return "Mainline";
                        case "S8": return "Receipt Points";
                        case "S9": return "Delivery Points";
                        default: return qti;
                    }
                    break;
                default:
                    return qti;
            }

        }

})
};

