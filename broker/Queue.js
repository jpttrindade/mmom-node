
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
	console.log('Queue.enqueue: ', request);
	requests.push(request);
}


Queue.prototype.dequeue = function() {
	return requests.shift();
}

Queue.prototype.peek = function(){
	return requests[0];
}

module.exports = Queue;