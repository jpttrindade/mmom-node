var net = require('net');
var QueuesManager = require('./QueuesManager');
var ResponderManager = require('./ResponderManager');
var RequestorManager = require('./RequestorManager');
//var MessageEncoder = require('./MessageEncoder');
var Message = require('./../common/Message');
var Responder = require('./Responder');
var MessageBrokerEncoder = require('./MessageBrokerEncoder');
var Requestor = require('../client/Requestor');

//Constantes
var HOST = '192.168.1.123';
//var HOST = '192.168.43.197';
var RESPONDER_PORT = 5678;
var REQUESTOR_PORT = 5679;

//Atributos
var client;
var server;
var requestorManager;
var destinationManager;
var queuesManager;

function Broker() {
	requestorManager = new RequestorManager();
	responderManager = new ResponderManager();
	queuesManager = new QueuesManager(requestorManager, responderManager);
}

Broker.prototype.startResponderService = function () {
	responder = net.createServer(connectResponderListener);
	responder.on('listening', function () {
		address = responder.address();
		console.log('Started ResponderService on %j', address);
	});
  	responder.on('error', errorListener);
	responder.listen(RESPONDER_PORT, HOST);
	console.log('Starting Responder Server ...');
}

Broker.prototype.startRequestorService = function () {
	requestor = net.createServer(connectRequestorListener);
	requestor.on('listening', function(){
		address = requestor.address();
		console.log('Started RequestorService on %j', address);	
	});
  	requestor.on('error', errorListener);
	requestor.listen(REQUESTOR_PORT, HOST);
	console.log('Starting Broker Requestor Server ...');
}

/*var listeningListener = function (_server) {
	
}*/

var errorListener = function (error) {
	console.log(error);
}

var connectRequestorListener = function (socket) {
	console.log('New Requestor: ' + socket.remoteAddress + ':' + socket.remotePort);
	Requestor.createInstance(socket, eventCallback, queuesManager.getEmitter());
}

function onReceiveRequest (request) {
	console.log('onReceiveRequest');
	var head = MessageBrokerEncoder.getHead(request);
	console.log('head = ', head);
	queuesManager.enqueueRequest(head.destinationId, request);

}

var connectResponderListener = function (socket) {
	console.log('New Server: ' + socket.remoteAddress + ':' + socket.remotePort);	
	Responder.createInstance(socket, eventCallback, queuesManager.getEmitter());
}

var eventCallback = function(event, object){

	var manager;
	if( object instanceof Requestor) {
		manager = requestorManager;
	} else if (object instanceof Responder) {
		manager = responderManager;
	}

	switch(event) {
		case 'connect':
		    manager.add(object);
			break;
		case 'close':
		    manager.remove(object);
			break;
	}
}

module.exports = Broker;