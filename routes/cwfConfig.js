var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send({
        statuses: ['proposed', 'approved', 'accepted', 'declined', 'sustained', 'setApart'],
        ldsEndpointUrls: [{MEMBER_LIST: '/directory/list'}, {CALLING_LIST: '/directory/callings'}],
        orgTypes: [{id: 5, name: 'Bishopric'}, {id: 7, name: 'High Priests Group'}, {id: 9, name:'Primary'}, {id: 11, name:'Relief Society'}]
    });
});

module.exports = router;
