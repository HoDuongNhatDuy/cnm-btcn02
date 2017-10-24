var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {  });
});

function send_https_GET_request(url, result) {

    var options = {
        url: url,
        type: "json/application",
        // headers: {
        //     "referer": "https://www.instagram.com"
        // }
    };

    request(options, function (error, response, body) {
        result(JSON.parse(body));
    });

}

router.get('/get-instagram-location-media', function(req, res, next) {

    var location_id = req.query.location_id;
    var url = `https://www.instagram.com/explore/locations/${location_id}/?__a=1`;
    send_https_GET_request(url, function (response) {
        res.json(response);
        res.end();
    });
});

module.exports = router;
