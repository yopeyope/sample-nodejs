var express = require("express");
var app = express();
var iotf = require('ibmiotf');
var appConfig;

//var serverPort = 3000;
//var serverHost = 'localhost';
var serverPort = process.env.VCAP_APP_PORT || 3000;
var serverHost = process.env.VCAP_APP_HOST || 'localhost';

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    appConfig = {
                   'org' : env["iotf-service"][0].credentials.org,
                   'id' : 'yh-nodeserver',
                   'auth-key' : env["iotf-service"][0].credentials.apiKey,
                   'auth-token' : env["iotf-service"][0].credentials.apiToken
                  }
} else {
    appConfig = require('./application.json');
}

var responseString = 'Hello Coursera';

var appClient = new iotf.IotfApplication(appConfig);

app.get('/', function(req, res) {
    res.send('Hello Coursera');
});

var server = app.listen(serverPort, serverHost, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);

    appClient.connect();

    appClient.on('connect', function() {
        appClient.subscribeToDeviceEvents();
    });

    appClient.on('deviceEvent', function(deviceType, deviceId, eventType, format, payload) {
        responseString = "Device event at " + new Date().toString() + " from " + deviceType +
                          ":" + deviceId + "; event = "+ eventType +", payload = " + payload;
    });


});
