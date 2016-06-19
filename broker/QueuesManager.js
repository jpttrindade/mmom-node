var EventEmitter = require('events').EventEmitter;
var Queue = require('./Queue');
var requestQueues;
var emitter;
var online;

function QueuesManager() {
	online = [];
	requestQueues = [];

	emitter = new EventEmitter();
	emitter.on('request', onEnqueueRequest);
	emitter.on('response', onResponse);
	emitter.on('connect', onDestinationConnect);
	emitter.on('disconnect', onDestinationDisconnect);
}

QueuesManager.prototype.getEmitter = function() {
	return emitter;
}

function onResponse (requestId, destinationId, response) {
	console.log('QueuesManager.onResponse');
	dequeueRequest(destinationId);
	sendRequest(destinationId);

}

function onEnqueueRequest(destinationId, request) {
	console.log('QueueManager.onEnqueueRequest: ', destinationId);
	var queue = getQueue(destinationId);
	if (!queue) {
		queue = new Queue(destinationId);
		requestQueues.push(queue);
	} 
	queue.enqueue(request);

	if (isOnline(destinationId)){
		console.log(destinationId +' is online');
		sendRequest(destinationId);
	} else {
		console.log('destinationId is offline');
	}	
}

function onDestinationConnect(destinationId) {
	console.log('QueuesManager.onDestinationConnect: ', destinationId);
	if (!isOnline(destinationId)){
		online.push(destinationId);
	}
	console.log('clients online: ', online);
	sendRequest(destinationId);
}

function onDestinationDisconnect(destinationId) {
    console.log('QueuesManager.onDestinationDisconnect: ', destinationId);
    if (isOnline(destinationId)){
    	index = online.indexOf(destinationId);	
    	online.splice(index,1);
    }
}
 

function dequeueRequest(destinationId) {
	var queue = getQueue(destinationId);
	if (queue){
		request = queue.dequeue();
		console.log('dequeuing...')
	}
}

function sendRequest(destinationId) {
	var queue = getQueue(destinationId);
	if (queue){
		request = queue.peek();
		if (request) {
			emitter.emit(destinationId, request);
		}
	}
}

function getQueue(destinationId) {
	var queue;
	var result = requestQueues.filter(function (queue) {
		return destinationId === queue.getDestinationUuid();
	});
	if (result.length) {
		queue = result[0];
	}

	return queue;
}

function isOnline(destinationId) {
	return online.indexOf(destinationId) >= 0;
}

module.exports = QueuesManager;