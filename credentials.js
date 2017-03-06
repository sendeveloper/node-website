

module.exports = {
    session : {
        secretKey : "p5GGMzvZQyBl"
    }

    , mongo : {
        development : {
            connectionString : "mongodb://localhost:27017/testing"
        }
        , production : {
            primary     : "mongodb://productionApp:gGqEXtjXHn4b7JA35gTy@ds031592-a0.vls52.fleet.mongolab.com:31592,ds031592-a1.vls52.fleet.mongolab.com:31592/critrsch552133874535?replicaSet=rs-ds031592&ssl=true"
            , secondary : "mongodb://productionApp:gGqEXtjXHn4b7JA35gTy@ds031592-a0.vls52.fleet.mongolab.com:31592,ds031592-a1.vls52.fleet.mongolab.com:31592/critrsch552133874535?replicaSet=rs-ds031592&ssl=true"
            , internal : "mongodb://productionApp:gGqEXtjXHn4b7JA35gTy@ds031592-a0-internal.vls52.fleet.mongolab.com:31592,ds031592-a1-internal.vls52.fleet.mongolab.com:31592/critrsch552133874535?replicaSet=rs-ds031592&ssl=true"
            //, external : "mongodb://productionApp:gGqEXtjXHn4b7JA35gTy@ds031592-a0-external.vls52.fleet.mongolab.com:31592,ds031592-a1-external.vls52.fleet.mongolab.com:31592/critrsch552133874535?replicaSet=rs-ds031592&ssl=true"
            , external : "mongodb://productionApp:gGqEXtjXHn4b7JA35gTy@ds031592-a0-external.vls52.fleet.mongolab.com:31592/critrsch552133874535?ssl=true"
        }
    }

    , aws : {
        s3 : {
            development : {
                accessKeyId :  'AKIAICLJF3KVKEVKQWRA'
                , secretAccessKey : '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'
                , region : 'us-west-2'   //make sure you know the region, else leave this option out
                , bucketName : 'elasticbeanstalk-us-west-2-063095259653/research-reports'
                , acl : 'public-read'
                , baseurl : "https://s3-us-west-2.amazonaws.com/"
            }
            , production : {
                accessKeyId :  'AKIAJGL5E3ADDXIUHHXA'
                , secretAccessKey : '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'
                , region : 'us-west-2'   //make sure you know the region, else leave this option out
                , bucketName : 'elasticbeanstalk-us-west-2-189760161902/research-reports'
                , acl : 'public-read'
                , baseurl : "https://s3-us-west-2.amazonaws.com/"
            }
            , reports : {
                accessKeyId :  'AKIAJGL5E3ADDXIUHHXA'
                , secretAccessKey : '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'
                , region : 'us-west-2'   //make sure you know the region, else leave this option out
                , bucketName : 'research.criterionrsch.com'
                , acl : 'public-read'
                , baseurl : "http://research.criterionrsch.com/"
            }
        }
    }

    , google_url: {
        criterion_twitter_feed : {
            api_key: "AIzaSyA5qY4aQenywJJapyNItLxk23GDe344R5s"
        }
    }

    , gmail : {
        info : {
            username : "info@criterionrsch.com"
            , password : "U6SRDJptQGZw2q8h"
        }
        , support : {
            username : "support@criterionrsch.com"
            , password : "qqqcwY3NNf4g4MT8"
        }
        , reports : {
            username : "criterion_reports@criterionrsch.com"
            , password : "GDX3QTuQuwoPSV7dJ"
        }
    }

    , mandrill : {
        host : "smtp.mandrillapp.com"
        , port : "587"
        , username : "Criterion Research"
        , password : "dBw8wO0u1LsKe6_o0RsA-g"
        , apiKey : "dBw8wO0u1LsKe6_o0RsA-g"
    }

    , postgres : {
        connectionString : "postgres://globaladmin23421:zV00OumPAjSjTi8HC@critrsch-postgres992261.cpnwxlr0qvdm.us-west-2.rds.amazonaws.com:5432/consol"
    }

    , eia : {
        apiKey : "3E47F2D4BBF5ADE0E7EEF2EBDA268583"
        , baseUrl : "http://api.eia.gov/series/?api_key="
    }

    , neo4j : {
        connectionStringHttps: "https://neo4j:S9clb9DkFkQf1fjjs@52.88.142.63:7473"
        ,connectionStringHttp: "http://neo4j:S9clb9DkFkQf1fjjs@52.88.142.63:7474"
        ,connectionStringInternal: "http://neo4j:S9clb9DkFkQf1fjjs@172.31.40.18:7474"
    }

    , twitter : {
        apiKey : "vEUXxZXI41cef5SjUGOrQG3BX"
        , consumer_key : "vEUXxZXI41cef5SjUGOrQG3BX"
        , consumer_secret : "wfKxYb9mnsoOhYG51GShI7zhEyJb9VmXwN9rfakm6a9jNIanof"
        , access_token_key: "3193240394-fgKMualORlyP5FsLj9dUmiAE3ZRePbREvCpUlFP"
        , access_token_secret: "HNwdF14vQwdV8FNprwgQpMQGhEUEa9X5VCfmz9JZyVF1H"
    }

    , linkedin : {
        clientId : "78edmx6232oeen"
        , clientSecret : "zFyCO1mPkzfOhOya"
    }

    , wunderlist : {
        clientId: "825504159f574d2a2876"
        , clientSecret : "a947bea498c9f05d33bd65380ed183a1b5e5da8d7b7da841294c59df6482"
        , accessToken : "8afb6a1f328886f4d382ee1eaa6a5966061bc2e2f10c2b8ac0300f3e0eaa"
        , appUrl : "https://criterionrsch.com"
        , callbackUrl : "https://criterionrsch.com/wlistauth"
        , listPressReleaseFollowUp : 235811355
    }

};