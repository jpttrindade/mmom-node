var EventEmitter = require('events').EventEmitter;
var Queue = require('./Queue');

var responseQueues;

function ResponseQueuesManager() {

	responseQueues = [];
	emitter = new EventEmitter();
	emitter.on('connect', onClientConnect);

	emitter.on('request', onRequest);
	emitter.on('response', onResponse);
	emitter.on('connect', onClientDisconnect);	

}


function onClientConnect(clientConnection) {
	sendResponse(clientConnection.);
}

function onRequest() {

}

function onResponse() {

}
function onClientDisconnect(){

}