var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {  });
});

function send_https_GET_request(url, result) {
    console.log(2);

    let req = https.get(url, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
            console.log(3);
        });

        res.on('end', function() {
            console.log(4);
            console.log("asdas" . output);
            let obj = JSON.parse(output);
            result(obj);
        });
    });

    req.on('error', function(err) {
        console.log(5);
        console.log(err);
    });

    console.log(6);
    req.end();
}

router.get('/get-instagram-location-media', function(req, res, next) {

    let location_id = req.query.location_id;
    let url = `https://www.instagram.com/explore/locations/${location_id}/?__a=1`;

    console.log(1);
    send_https_GET_request(url, function (response) {
        console.log(7);

        res.json(response);
        res.end();
    });
    console.log(8);
});

module.exports = router;
