var express = require('express');
var router = express.Router();
var configs = require('../configs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {  });
});

module.exports = router;
