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
    console.log(2);

    var options = {
        url: 'https://www.instagram.com/explore/locations/212988663/?__a=1',
        headers: {
            'Content-Type': 'json'
        }
    };

    request(options, function (error, response, body) {
        console.log(error);
        console.log(response);
        console.log(body);
        result({abc: "sdf", xyz: "sdf"});
    });

}

router.get('/get-instagram-location-media', function(req, res, next) {

    var location_id = req.query.location_id;
    var url = `https://www.instagram.com/explore/locations/${location_id}/?__a=1`;
console.log(url);
    console.log(1);
    send_https_GET_request(url, function (response) {
        console.log(7);

        res.json(response);
        res.end();
    });
    console.log(8);
});

module.exports = router;
