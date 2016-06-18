
var destinationUuid;
var requests;

function Queue (_destinationUuid) {
	destinationUuid = _destinationUuid
	requests = [];
}

Queue.prototype.getDestinationUuid = function() {
	return destinationUuid;
}

Queue.prototype.enqueue = function(request) {
	requests.push(requests);
}


Queue.prototype.dequeue = function() {
	return requests.shift();
}

module.exports = Queue;