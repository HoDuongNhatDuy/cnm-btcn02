var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {  });
});

function send_https_GET_request(url, result) {

    let req = https.get(url, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            console.log(output);
            let obj = JSON.parse(output);
            result(obj);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    req.end();
}

router.get('/get-instagram-location-media', function(req, res, next) {

    let location_id = req.query.location_id;
    let url = `https://www.instagram.com/explore/locations/${location_id}/?__a=1`;

    // send_https_GET_request(url, function (response) {
    //     res.json(response);
    // });
    res.end("123");
});

module.exports = router;
