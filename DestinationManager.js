

var Socket = require('net').Socket;
var destinations;
var size;

function DestinationManager () {
	destinations = {};
	size = 0;
}

DestinationManager.prototype.add = function (destination) {
	size += destinations[destination.getUuid()] ? 0 : 1;
	destinations[destination.getUuid()] = destination;
	console.log('Destination added with key:', destination.getUuid());
	console.log('DestinationManager.count: ', size);
}


DestinationManager.prototype.remove = function (destination) {
	destinations[destination.getUuid()] === null || (function() {
		delete destinations[destination.getUuid()];
		size--;
	}());
	console.log('destination removed with key=', destination.getUuid());
	console.log('DestinationManager.count: ', size);
}

DestinationManager.prototype.size = function () {
	return size;
}

module.exports = DestinationManager;