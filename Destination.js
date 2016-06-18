var MessageEncoder = require('./MessageEncoder');

var socket;
var uuid;
var emitter;
var eventCallback;
var destination;

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

Destination.prototype.getUuid = function() {
	return uuid;
}

function onConnect() {
	console.log('onConnect');
}

function onData(data) {
	console.log('onData');
	message = MessageEncoder.decode(data);
	console.log(message);
	switch(message.head.type){
		case 0:
		    console.log('Connetion data.');
		    receiveConnectionData(message);
		    break;
		case 1:
		    break;
		case 2:
	}
}

function onClose(had_error) {
  	console.log('onClose: ', had_error);
  	emitter.removeListener(uuid, onReceiveRequest);
  	emitter.emit('disconnect', uuid);
  	eventCallback('close', destination);
}

function receiveConnectionData(message) {
	uuid = message.body.content;
	emitt.on(uuid, onReceiveRequest);
	emitter.emit('connect', uuid);
	eventCallback('connect', destination);
}

function onReceiveRequest(request) {
	console.log('onReceiveRequest: ', request);
}

module.exports = Destination;