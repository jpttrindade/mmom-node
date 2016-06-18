var net = require('net');
var QueuesManager = require('./QueuesManager');
var DestinationManager = require('./DestinationManager');
var MessageEncoder = require('./MessageEncoder');
var Message = require('./Message');
var Destination = require('./Destination');


//Constantes
var HOST = '192.168.1.123';
var PORT = 5678;

//Atributos
var server;
var destinationManager;
var queuesManager;

function Broker() {
	queuesManager = new QueuesManager();
	destinationManager = new DestinationManager();
}

Broker.prototype.startServer = function () {
	server = net.createServer(connectListener);
	server.on('listening', listeningListener);
  	server.on('error', errorListener);
	server.listen(PORT, HOST);
	console.log('Starting Broker Server ...');
}

var listeningListener = function () {
	address = server.address();
	console.log('Started server on %j', address);
}

var errorListener = function (error) {
	console.log(error);
}

var connectListener = function (socket) {
	console.log('New Client: ' + socket.remoteAddress + ':' + socket.remotePort);
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