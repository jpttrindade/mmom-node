var MessageBrokerEncoder = require('./MessageBrokerEncoder');
var MessageEncoder = require('../client/MessageEncoder');

var socket;
var responderId;
var emitter;
var eventCallback;
var responder;
var processing;


var receiveDataBuffer;
var receiveDataCount;

function Responder(_socket, _eventCallback, _emitter) {
	responder = this;
	emitter = _emitter;
	eventCallback = _eventCallback;
	receiveDataCount = 0;
	socket = _socket;
	socket.on('connect', onConnect);
	socket.on('data', onData);
	socket.on('close',  onClose);
}

Responder.createInstance = function(_socket, _eventCallback, _emitter) {
	return new Responder(_socket, _eventCallback, _emitter);
}

Responder.prototype.getResponderId = function() {
	return responderId;
}

Responder.prototype.onReceiveRequest = function (request) {
	console.log('Responder.onReceiveRequest: ', request);
	if(!processing) {
		socket.write(request);
		console.log('Request em processamento, aguardando response of ', responderId);
		processing = true;
	} else {
		console.log('ja esta em processamento: ', responderId);
	}
}

function onConnect() {
	console.log('onConnect');
}

function onData(data) {
	var end = data.slice(data.length-2, data.length);
	if (end.toString('utf8') === '\n\n') {
		if(receiveDataCount > 0) {
			data = Buffer.concat([receiveDataBuffer, data]);
		}
		var head = MessageBrokerEncoder.getHead(data);
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
		receiveDataCount = 0;
	} else {
		if(receiveDataCount === 0){
			receiveDataBuffer = data;
		} else {
			receiveDataBuffer = Buffer.concat([receiveDataBuffer, data]);
		}
		receiveDataCount++;
	}
}

function onClose(had_error) {
  	console.log('onClose: ', had_error);
  	//emitter.removeListener(destinationId, onReceiveRequest);
  	//emitter.emit('disconnect', destinationId);
  	eventCallback('close', responder);
}

function receiveConnectionData(_destinationId) {
	responderId = _destinationId;
	eventCallback('connect', responder);
}

function receiveResponseData(requestId, requestorId, response) {
	processing = false;
	emitter.emit('response', responderId, requestId, requestorId, response);
}



module.exports = Responder;