

var Socket = require('net').Socket;
var destinations;
var size;

function DestinationManager () {
	destinations = {};
	size = 0;
}

DestinationManager.prototype.add = function (destination) {
	size += destinations[destination.getDestinationId()] ? 0 : 1;
	destinations[destination.getDestinationId()] = destination;
	console.log('Destination added with key:', destination.getDestinationId());
	console.log('DestinationManager.count: ', size);
}


DestinationManager.prototype.remove = function (destination) {
	destinations[destination.getDestinationId()] === null || (function() {
		delete destinations[destination.getDestinationId()];
		size--;
	}());
	console.log('destination removed with key=', destination.getDestinationId());
	console.log('DestinationManager.count: ', size);
}

DestinationManager.prototype.size = function () {
	return size;
}

module.exports = DestinationManager;