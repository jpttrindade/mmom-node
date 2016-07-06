var MessageBrokerEncoder = require('../broker/MessageBrokerEncoder');
//var MessageEncoder = require('./MessageEncoder');

function Requestor(_socket, _eventCallback, _emitter) {
	var requestor = this;
	var qmEmitter = _emitter;
	var eventCallback = _eventCallback;
	var receiveDataBuffer;
	var receiveDataCount = 0;
	var socket = _socket;
	var requestorId;

	this.getRequestorId = function () {
		return requestorId
	}

	this.onReceiveResponse = function (response) {
		console.log('Requestor.onReceiveResponse: ', requestorId);
		socket.write(response);
		qmEmitter.emit('response_delivered', requestorId);
	}

	socket.on('data', function (request) {
		onData(request, receiveDataCount, receiveDataBuffer, function (code, destinationId) {
			switch (code) {
				case 0:
					requestorId = destinationId;
					eventCallback('connect', requestor);
					break;
				case 1:
					console.log('ReceiveRequestData 1');
					qmEmitter.emit('request', requestorId, destinationId, request);
					console.log('ReceiveRequestData 2');
					break;
				default:
				//
			}
		});
	});


	socket.on('close',  function (had_error) {
		console.log('RequestorConnection.onClose: ', had_error);
		eventCallback('close', requestor);
	});

}

Requestor.createInstance = function(_socket, _eventCallback,_emitter) {
	return new Requestor(_socket, _eventCallback, _emitter);
}

function onData(request, receiveDataCount, receiveDataBuffer, cb) {
	console.log('Requestor.onData');
	var end = request.slice(request.length-2, request.length);
	if (end.toString('utf8') === '\n\n') {
		if(receiveDataCount > 0) {
			request = Buffer.concat([receiveDataBuffer, request]);
		}
		//console.log('mesage ==> ', MessageEncoder.decode(request));
		var head = MessageBrokerEncoder.getHead(request);
		receiveDataCount = 0;
		cb(head.code, head.destinationId);
	} else {
		if(receiveDataCount === 0){
			receiveDataBuffer = request;
		} else {
			receiveDataBuffer = Buffer.concat([receiveDataBuffer, request]);
		}
		receiveDataCount++;
		cb();
	}
}

module.exports = Requestor;
