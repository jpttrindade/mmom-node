var MessageBrokerEncoder = require('./MessageBrokerEncoder');
//var MessageEncoder = require('../client/MessageEncoder');

// var socket;
// var responderId;
// var emitter;
// var eventCallback;
// var responder;
// var processing;
//
//
// var receiveDataBuffer;
// var receiveDataCount;

function Responder(_socket, _eventCallback, _emitter) {
	var responderId;
	var processing;

	var responder = this;
	var emitter = _emitter;
	var eventCallback = _eventCallback;
	var receiveDataBuffer;
	var receiveDataCount = 0;
	var socket = _socket;


	this.getResponderId = function() {
		return responderId;
	}

	this.onReceiveRequest = function (request) {
		console.log('Responder.onReceiveRequest: ', request);
		if(!processing) {
			socket.write(request);
			console.log('Request em processamento, aguardando response of ', responderId);
			processing = true;
		} else {
			console.log('ja esta em processamento: ', responderId);
		}
	}

	socket.on('data', function (data) {
		onData(data, receiveDataCount, receiveDataBuffer,
			function (_data, _receiveDataCount, _receiveDataBuffer, code, destinationId, requestId) {
			data = _data;
			receiveDataCount = _receiveDataCount;
			receiveDataBuffer = _receiveDataBuffer;
			switch(code){
				case 0:
						console.log('Connetion data.');
						responderId = destinationId;
						eventCallback('connect', responder);
						break;
				case 1:
					//nao se aplica
						break;
				case 2:
					processing = false;
					emitter.emit('response', responderId, requestId, destinationId, data);
					// receiveResponseData(requestId, destinationId, data)
					break;
				default:
					//
			}
		});
	});

	socket.on('close',  function (had_error) {
		console.log('onClose: ', had_error);
		eventCallback('close', responder);
	});
}

Responder.createInstance = function(_socket, _eventCallback, _emitter) {
	return new Responder(_socket, _eventCallback, _emitter);
}

function onData(data, receiveDataCount, receiveDataBuffer, cb) {
	var end = data.slice(data.length-2, data.length);
	if (end.toString('utf8') === '\n\n') {
		if(receiveDataCount > 0) {
			data = Buffer.concat([receiveDataBuffer, data]);
		}
		var head = MessageBrokerEncoder.getHead(data);
		receiveDataCount = 0;
		console.log('++++++ ', head);
		cb(data, receiveDataCount, receiveDataBuffer, head.code, head.destinationId, head.requestId);
	} else {
		console.log('ios')
		if(receiveDataCount === 0){
			receiveDataBuffer = data;
		} else {
			receiveDataBuffer = Buffer.concat([receiveDataBuffer, data]);
		}
		receiveDataCount++;
		console.log('ios -',receiveDataCount);

		cb(data, receiveDataCount, receiveDataBuffer);
	}
}

module.exports = Responder;
