var net = require('net');
var QueuesManager = require('./QueuesManager');
var ResponderManager = require('./ResponderManager');
var RequestorManager = require('./RequestorManager');
//var MessageEncoder = require('./MessageEncoder');
var Message = require('./Message');
var Responder = require('./Responder');
var MessageBrokerEncoder = require('./MessageBrokerEncoder');
var Requestor = require('./Requestor');

//Constantes
var HOST = '172.22.68.46';
//var HOST = '192.168.43.197';
var RESPONDER_PORT = 5678;
var REQUESTOR_PORT = 5679;

var host;
//Atributos
var client;
var server;
var requestorManager;
var responderManager;
var queuesManager;

function Broker(_host) {
	host = _host;
	requestorManager = new RequestorManager();
	responderManager = new ResponderManager();
	queuesManager = new QueuesManager(requestorManager, responderManager);
}

Broker.prototype.startResponderService = function (responder_port) {
	responder = net.createServer(connectResponderListener);
	responder.on('listening', function () {
		address = responder.address();
		console.log('Started ResponderService on %j', address);
	});
  	responder.on('error', errorListener);
	responder.listen(responder_port, host);
	console.log('Starting Responder Server ...');
}

Broker.prototype.startRequestorService = function (requestor_port) {
	requestor = net.createServer(connectRequestorListener);
	requestor.on('listening', function(){
		address = requestor.address();
		console.log('Started RequestorService on %j', address);
	});
  	requestor.on('error', errorListener);
	requestor.listen(requestor_port, host);
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

var connectResponderListener = function (socket) {
	console.log('New Server: ' + socket.remoteAddress + ':' + socket.remotePort);
	Responder.createInstance(socket, eventCallback, queuesManager.getEmitter());
}

var eventCallback = function(event, object){
	console.log('>>', object);
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
