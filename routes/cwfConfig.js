var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    let cojcOrg = '.churchofjesuschrist.org/';
    var environmentParm = req.query.env && req.query.env.toLowerCase();
    var signinParm = req.query.signIn && req.query.signIn.toLowerCase();
    var isTestEnv = environmentParm && (environmentParm === 'test' || environmentParm === 'dev' || environmentParm === 'stage');
    var baseUrl = isTestEnv ? 'https://' + environmentParm + cojcOrg : 'https://www.lds.org/';
    var baseLcrUrl = isTestEnv ? 'https://lcr-' + environmentParm + '.lds.org/' : 'https://lcr.lds.org/';
    var baseSigninUrl = isTestEnv ? 'https://signin-int' + cojcOrg : 'https://signin.lds.org/';

    let STATUS_OK = 'OK';
    let STATUS_WARN = 'WARN';
    let STATUS_ERROR = 'ERROR';

    // if we need to warn the user that something isn't working (most likely due to changes at the church), we'll do that
    // by changing appStatus to either STATUS_WARN or STATUS_ERROR, then the app will provide the appStatusMsg to the user
    var appStatus = STATUS_OK;
    var appStatusMsg = '';

    if( isTestEnv ) {
        var status = req.query.status && req.query.status.toUpperCase()
        if( status ) {
            appStatus = status;
            appStatusMsg = 'This is a ' + status + ' message.';
        }
    }


    // we've some switches in dev between signin-int.lds.org and ident-int.lds.org, seemingly  randomly. So we're adding
    // it as an optional parameter so we don't have to deploy a new version of the app with a change to the baseSigninUrl
    // everytime the church changes something.
    if( signinParm ){
        baseSigninUrl = 'https://' + signinParm + '.lds.org/';
    }
    var baseDirectoryInstance = isTestEnv ? 'directory/' : 'mobiledirectory/';
    res.send({
        ldsEndpointUrls: {USER_DATA: baseUrl + baseDirectoryInstance + 'services/v2/ldstools/current-user-detail',
        // ldsEndpointUrls: {USER_DATA: 'https://www.churchofjesuschrist.org/mobiledirectory/services/v2/ldstools/current-user-detail',
            SIGN_IN: baseSigninUrl + 'login.html',
            SIGN_OUT: baseUrl + 'signinout/?lang=eng&signmeout',
            MEMBER_LIST: baseUrl + 'htvt/services/v1/:unitNum/members',
            INDIVIDUAL_MEMBERS_LIST: baseLcrUrl + 'services/umlu/report/member-list?unitNumber=:unitNum',

            MEMBER_LIST_SECONDARY: baseUrl + baseDirectoryInstance + 'services/ludrs/1.1/mem/mobile/member-detaillist/:unitNum',
            // MEMBER_LIST: baseUrl + baseDirectoryInstance + 'services/v2/ldstools/member-detaillist-with-callings/56030',
            UPDATE_CALLING: baseLcrUrl + 'services/orgs/callings?lang=eng',
            CALLING_LIST: baseLcrUrl + 'services/orgs/sub-orgs-with-callings',
            UNIT_CALLINGS: baseLcrUrl + 'services/report/members-with-callings?unitNumber=:unitNum',
            CLASS_ASSIGNMENTS: baseLcrUrl + 'services/orgs/sub-orgs-with-callings/?subOrgId=:subOrgId'
        },
        ldsBasicAuth: [],
        ldsBasicAuth: ['USER_DATA'],
        // ldsHeaders: {},
        ldsHeaders: {USER_DATA : {lds_api_key : '10544b7b-2661-467b-a271-82338cf4a8aa',
            'User-Agent': 'LDS Tools/3.6.1 (org.lds.ldstools; build:6526; iOS 12.2.0) Alamofire/4.8.1'}},
        appStatus: {
            status: appStatus,
            message: appStatusMsg
        },
        orgTypes: [{id: 1179, name: 'Bishopric'},  {id: 70, name:'Elders Quorum'},
            {id: 74, name:'Relief Society'}, {id: 73, name:'Young Men'}, {id: 76, name:'Young Women'},
            {id: 75, name:'Sunday School'},{id: 77, name:'Primary'},{id: 1310, name:'Ward Missionaries'},
            {id: 1185, name:'Other Callings'}]
    });
});

module.exports = router;
