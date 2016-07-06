//var Socket = require('net').Socket;
var destinations;
var size;
var qmEmitter;

function ResponderManager () {
	destinations = {};
	size = 0;
}

ResponderManager.prototype.setQueuesManagerEmitter = function (emitter) {
	qmEmitter = emitter;
}

ResponderManager.prototype.add = function (responder) {
	size += destinations[responder.getResponderId()] ? 0 : 1;
	destinations[responder.getResponderId()] = responder;
	qmEmitter.on(responder.getResponderId(), responder.onReceiveRequest);
	qmEmitter.emit('responder_connect', responder.getResponderId());

	console.log('Responder added with key:', responder.getResponderId());
	console.log('ResponderManager.count: ', size);
}


ResponderManager.prototype.remove = function (responder) {
	destinations[responder.getResponderId()] === null || (function() {
		delete destinations[responder.getResponderId()];
		size--;
	}());

	qmEmitter.removeListener(responder.getResponderId(), responder.onReceiveRequest);
  	//qmEmitter.emit('disconnect', responder.getDestinationId());
  	//emitter.emit('disconnect', destinationId);

	console.log('Responder removed with key=', responder.getResponderId());
	console.log('ResponderManager.count: ', size);
}

ResponderManager.prototype.size = function () {
	return size;
}

module.exports = ResponderManager;
