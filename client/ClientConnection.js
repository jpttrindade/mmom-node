
var socket;
var clientConnection;

function ClientConnection(_socket, _emitter) {
	clientConnection = this;
	emitter = _emitter;
	socket = _socket;
	socket.on('connect', onConnect);
	socket.on('data', onData);
	socket.on('close',  onClose);
	emitter.emit('connect', clientConnection);
}

ClientConnection.createInstance = function(_socket, _emitter) {
	return new ClientConnection(_socket, _emitter);
}

function onConnect() {
	console.log('client.onConnect');
}

function onData(request) {
	console.log('client.onData');
	var head = MessageBrokerEncoder.getHead(request);
	emitter.emit('request', head.destinationId, request);
}

function onClose(had_error) {
  	console.log('onClose: ', had_error);
  	emitter.removeListener(destinationId, onReceiveRequest);
  	emitter.emit('disconnect', destinationId);
  	eventCallback('close', destination);
}


module.exports = ClientConnection;