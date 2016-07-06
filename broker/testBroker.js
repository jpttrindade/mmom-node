var Broker = require('./Broker');

var HOST = '192.168.1.123';
//var HOST = '192.168.43.197';
var RESPONDER_PORT = 5678;
var REQUESTOR_PORT = 5679;

var broker = new Broker(HOST);
broker.startResponderService(RESPONDER_PORT);
broker.startRequestorService(REQUESTOR_PORT);
