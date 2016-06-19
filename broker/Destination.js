var MessageBrokerEncoder = require('./MessageBrokerEncoder');
var MessageEncoder = require('../client/MessageEncoder');

var socket;
var destinationId;
var emitter;
var eventCallback;
var destination;
var processing;

function Destination(_socket, _eventCallback, _emitter) {
	destination = this;
	emitter = _emitter;
	eventCallback = _eventCallback;
	socket = _socket;
	socket.on('connect', onConnect);
	socket.on('data', onData);
	socket.on('close',  onClose);
}

Destination.createInstance = function(_socket, _eventCallback, _emitter) {
	return new Destination(_socket, _eventCallback, _emitter);
}

Destination.prototype.getDestinationId = function() {
	return destinationId;
}

function onConnect() {
	console.log('onConnect');
}

function onData(data) {
	console.log('onData');
	
	var head = MessageBrokerEncoder.getHead(data);
	
	console.log('head = ', head);
	switch(head.code){
		case 0:
		    console.log('Connetion data.');
		    receiveConnectionData(head.destinationId);
		    break;
		case 1:
			//nao se aplica
		    break;
		case 2:

			receiveResponseData(head.requestId, head.destinationId, data)
			break;
	}
}

function onClose(had_error) {
  	console.log('onClose: ', had_error);
  	emitter.removeListener(destinationId, onReceiveRequest);
  	emitter.emit('disconnect', destinationId);
  	eventCallback('close', destination);
}

function receiveConnectionData(_destinationId) {
	destinationId = _destinationId;
	emitter.on(destinationId, onReceiveRequest);
	emitter.emit('connect', destinationId);
	eventCallback('connect', destination);
}

function receiveResponseData(requestId, destinationId, response) {
	emitter.emit('response', requestId, destinationId, response);

	processing = false;
}

function onReceiveRequest(request) {
	console.log('onReceiveRequest: ', request);
	console.log('buffer.size: ', request.length);
	if(!processing) {
		socket.write(request);
		processing = true;
	}

}

module.exports = Destination;