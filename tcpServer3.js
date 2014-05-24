// include the net module
var net = require("net");
var events = require("events");
var util = require("util");
var EventEmitter = events.EventEmitter;

// Here is the NumericValidator constructor
var NumericValidator = function() {};
util.inherits(NumericValidator, EventEmitter);

NumericValidator.prototype.validate = function(data) {
    this.data = data;

    if (!isNaN(data)) {
        this.emit("numeric", data);
    }
};

// Create a TCP Server Instance and set an event listener & handler for the TCP connection event emitted by the server
var tcpServer = net.createServer(function(conn) {

    var numericValidator = new NumericValidator();

    // Connection Information for Prefix Logging
    var connLogPrefix = "[" + conn.remoteAddress + ":" + conn.remotePort + "]";

    console.log(connLogPrefix, " Connected.");

    // Set an event listener & handler for the TCP data event emitted by the connection
    conn.on("data", function(data) {
        console.log(connLogPrefix, " Got Some Data: ", data);

        numericValidator.validate(data);
    });

    // Set an event listener & handler for the TCP end event emitted by the connection
    conn.on("end", function(data) {
        console.log(connLogPrefix, " Bye.");
    });

    // Set the Connection Encoding to UTF-8
    conn.setEncoding("utf-8");

    numericValidator.on("numeric", function(data){
        console.log("Numeric data recieved = ", data);
    });
});

// Set an event listener & handler for error event emitted by the server
tcpServer.on("error", console.error);

// Listen on port 3000
tcpServer.listen(process.env.PORT || 3000, function() {
    console.log("TCP Server Started. Listening on Port " + tcpServer.address().port);
});