var EventEmitter = require('events').EventEmitter;
var IMMomClient = require('../client/IMMomClient');


var HOST = '192.168.1.123';
//var HOST ='192.168.43.197';
var PORT = 5679;

var REQUESTOR_ID = 'CLIENT_3';
var mMomClient = new IMMomClient(HOST, PORT);

var brokerEventCallback = new EventEmitter();

var onReceiveResponse = function functionName() {

}

var onConnectionEstablished = function () {
  console.log('onConnectionEstablished');
}

var onConnectionClosed = function () {
  console.log('onConnectionClosed');
}

brokerEventCallback.on('response', onReceiveResponse);
brokerEventCallback.on('connected', onConnectionEstablished);
brokerEventCallback.on('disconnected', onConnectionClosed);

mMomClient.connect(REQUESTOR_ID, brokerEventCallback);
