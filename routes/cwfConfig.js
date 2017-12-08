var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    var environmentParm = req.query.env && req.query.env.toLowerCase();
    var signinParm = req.query.signIn && req.query.signIn.toLowerCase();
    var isTestEnv = environmentParm && (environmentParm === 'test' || environmentParm === 'dev' || environmentParm === 'stage');
    var baseUrl = isTestEnv ? 'https://' + environmentParm + '.lds.org/' : 'https://www.lds.org/';
    var baseSigninUrl = isTestEnv ? 'https://ident-int.lds.org/' : 'https://ident.lds.org/';
    // we've some switches in dev between signin-int.lds.org and ident-int.lds.org, seemingly  randomly. So we're adding
    // it as an optional parameter so we don't have to deploy a new version of the app with a change to the baseSigninUrl
    // everytime the church changes something.
    if( signinParm ){
        baseSigninUrl = 'https://' + signinParm + '.lds.org/';
    }
    var baseDirectoryInstance = isTestEnv ? 'directory/' : 'mobiledirectory/';
    res.send({
        ldsEndpointUrls: {USER_DATA: baseUrl + baseDirectoryInstance + 'services/v2/ldstools/current-user-detail',
            SIGN_IN: baseSigninUrl + 'login.html',
            SIGN_OUT: baseUrl + 'signinout/?lang=eng&signmeout',
            MEMBER_LIST: baseUrl + 'htvt/services/v1/:unitNum/members',
            MEMBER_LIST_SECONDARY: baseUrl + baseDirectoryInstance + 'services/ludrs/1.1/mem/mobile/member-detaillist/:unitNum',
            // MEMBER_LIST: baseUrl + baseDirectoryInstance + 'services/v2/ldstools/member-detaillist-with-callings/56030',
            UPDATE_CALLING: baseUrl + 'mls/mbr/services/orgs/callings?lang=eng',
            CALLING_LIST: baseUrl + 'mls/mbr/services/orgs/sub-orgs-with-callings'},
        orgTypes: [{id: 1179, name: 'Bishopric'}, {id: 69, name: 'High Priests Group'}, {id: 70, name:'Elders Quorum'},
            {id: 74, name:'Relief Society'}, {id: 73, name:'Young Men'}, {id: 76, name:'Young Women'},
            {id: 75, name:'Sunday School'},{id: 77, name:'Primary'},{id: 1310, name:'Ward Missionaries'},
            {id: 1185, name:'Other Callings'}]
    });
});

module.exports = router;
