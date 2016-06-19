var net = require('net');
var QueuesManager = require('./QueuesManager');
var DestinationManager = require('./DestinationManager');
//var MessageEncoder = require('./MessageEncoder');
var Message = require('./../common/Message');
var Destination = require('./Destination');
var MessageBrokerEncoder = require('./MessageBrokerEncoder');


//Constantes
var HOST = '192.168.1.123';
//var HOST = '192.168.43.197';
var SERVER_PORT = 5678;
var CLIENT_PORT = 5679;

//Atributos
var client;
var server;
var destinationManager;
var queuesManager;

function Broker() {
	queuesManager = new QueuesManager();
	destinationManager = new DestinationManager();
}

Broker.prototype.startServerService = function () {
	server = net.createServer(connectListener);
	server.on('listening', function () {
		address = server.address();
		console.log('Started ServerService on %j', address);
	});
  	server.on('error', errorListener);
	server.listen(SERVER_PORT, HOST);
	console.log('Starting Broker Server ...');
}

Broker.prototype.startClientService = function () {
	client = net.createServer(connectClientListener);
	client.on('listening', function(){
		address = client.address();
		console.log('Started ClientService on %j', address);	
	});
  	client.on('error', errorListener);
	client.listen(CLIENT_PORT, HOST);
	console.log('Starting Broker Client Server ...');
}

/*var listeningListener = function (_server) {
	
}*/

var errorListener = function (error) {
	console.log(error);
}

var connectClientListener = function (socket) {
	console.log('New Client: ' + socket.remoteAddress + ':' + socket.remotePort);
	ClientConnection.createInstance(socket, queuesManager.getEmitter());
}

function onReceiveRequest (request) {
	console.log('onReceiveRequest');
	var head = MessageBrokerEncoder.getHead(request);
	console.log('head = ', head);
	queuesManager.enqueueRequest(head.destinationId, request);

}

var connectListener = function (socket) {
	console.log('New Server: ' + socket.remoteAddress + ':' + socket.remotePort);
	Destination.createInstance(socket, eventCallback, queuesManager.getEmitter());
}

function eventCallback(event, destination){
	switch(event) {
		case 'connect':
		    destinationManager.add(destination);
			break;
		case 'close':
		    destinationManager.remove(destination);
			break;
	}
}

module.exports = Broker;