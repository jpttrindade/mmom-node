var MessageBrokerEncoder = require('../broker/MessageBrokerEncoder');
var MessageEncoder = require('./MessageEncoder');

var socket;
var requestor;
var eventCallback;
var requestorId;
var qmEmitter

var receiveDataBuffer;
var receiveDataCount;

function Requestor(_socket, _eventCallback, _emitter) {
	requestor = this;
	qmEmitter = _emitter;
	eventCallback = _eventCallback;
	receiveDataCount = 0;
	socket = _socket;
	socket.on('connect', onConnect);
	socket.on('data', onData);
	socket.on('close',  onClose);
	//emitter.emit('connect', clientConnection);
}

Requestor.prototype.getRequestorId = function () {
	return requestorId;
}

Requestor.prototype.onReceiveResponse = function (response) {
	console.log('Requestor.onReceiveResponse: ', requestorId);
	socket.write(response);
	qmEmitter.emit('response_delivered', requestorId);
}


Requestor.createInstance = function(_socket, _eventCallback,_emitter) {
	return new Requestor(_socket, _eventCallback, _emitter);
}

function onConnect() {
	console.log('RequestorConnection.onConnect');
}

function onData(request) {
	console.log('Requestor.onData');
	var end = request.slice(request.length-2, request.length);

	if (end.toString('utf8') === '\n\n') {
		if(receiveDataCount > 0) {
			request = Buffer.concat([receiveDataBuffer, request]);
		}
		//console.log('mesage ==> ', MessageEncoder.decode(request));
		var head = MessageBrokerEncoder.getHead(request);

		switch(head.code) {
			case 0:
			    console.log('Connetion data.');
			    // TODO: precisa ver como nao utilizar o destinationId
			    // talvez incluir um novo attributo
			    // ou fazer o 'destinationId' generico
			    receiveConnectionData(head.destinationId)
				break;
			case 1:
				receiveRequestData(head.destinationId, request);
				break;
			case 2:
				//nao se aplica
		}
		receiveDataCount = 0;
	} else {

		if(receiveDataCount === 0){
			receiveDataBuffer = request;
		} else {
			receiveDataBuffer = Buffer.concat([receiveDataBuffer, request]);
		}
		receiveDataCount++;
	}	
}

function onClose(had_error) {
  	console.log('RequestorConnection.onClose: ', had_error);
  	//qmEmitter.removeListener(destinationId, onReceiveRequest);
  	//qmEmitter.emit('disconnect', destinationId);
  	eventCallback('close', requestor);
}

function receiveConnectionData(_requestorId) {
	requestorId = _requestorId;
	//emitter.on(destinationId, onReceiveRequest);
	//emitter.emit('connect', destinationId);
	eventCallback('connect', requestor);
}

function receiveRequestData(responderId, request) {
	console.log('ReceiveRequestData 1');
	qmEmitter.emit('request', requestorId, responderId, request);
	console.log('ReceiveRequestData 2');
}
module.exports = Requestor;