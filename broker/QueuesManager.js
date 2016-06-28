var EventEmitter = require('events').EventEmitter;
var Queue = require('./Queue');

var responderManager;
var requestorManager;

var responseQueues;
var requestQueues;

var emitter;
var online;

function QueuesManager(_requestorManager, _responderManager) {
	responderManager = _responderManager;
	requestorManager = _requestorManager;

	online = [];
	requestQueues = [];
	responseQueues = [];

	emitter = new EventEmitter();
	emitter.on('request', onEnqueueRequest);
	emitter.on('response', onEnqueueResponse);
	emitter.on('requestor_connect', onRequestorConnect);
	emitter.on('responder_connect', onResponderConnect);
	emitter.on('response_delivered', onResponseDelivered);
	//emitter.on('disconnect', onResponderDisconnect);

	responderManager.setQueuesManagerEmitter(emitter);
	requestorManager.setQueuesManagerEmitter(emitter);
}

QueuesManager.prototype.getEmitter = function() {
	return emitter;
}

function onResponseDelivered (requestorId) {
	console.log('QueuesManager.onResponseDelivered');

	dequeueResponse(requestorId);
}

function onEnqueueResponse (responderId, requestId, requestorId, response) {
	console.log('QueuesManager.onResponse');
	console.log(responderId+", "+requestId+", "+requestorId);
	//retira a requisicao do inicio da fila.
	dequeueRequest(responderId);

	//coloca o response na fila do respectivo Requestor.
	var responseQueue = getResponseQueue(requestorId);
	if (!responseQueue) {
		console.log('criando uma nova fila para ', requestorId);
		responseQueue = new Queue(requestorId);
		responseQueues.push(responseQueue);
	}
	responseQueue.enqueue(response);

	sendResponse(requestorId);
}

function onEnqueueRequest(requestorId, responderId, request) {
	console.log('QueueManager.onEnqueueRequest to: ', responderId);
	var queue = getRequestQueue(responderId);
	if (!queue) {
		console.log('criando uma nova fila para ', responderId);
		queue = new Queue(responderId);
		requestQueues.push(queue);
	}
	queue.enqueue(request);
	sendRequest(responderId);
}

function onResponderConnect(responderId) {
	console.log('QueuesManager.onResponderConnect: ', responderId);
	sendRequest(responderId);
}

function onRequestorConnect(requestorId) {
	console.log('QueuesManager.onRequestorConnect: ', requestorId);
	sendResponse(requestorId);
}

// function onResponderDisconnect(destinationId) {
//     console.log('QueuesManager.onResponderDisconnect: ', destinationId);
// }


function dequeueRequest(responderId) {
	console.log('QueuesManager.dequeueRequest: ',responderId);
	var queue = getRequestQueue(responderId);
	if (queue){
		request = queue.dequeue();
		console.log('dequeuing request to: ', responderId);
	}
	sendRequest(responderId);
}

function dequeueResponse(requestorId) {
	console.log('QueuesManager.dequeueResponse: ',requestorId);
	var queue = getResponseQueue(requestorId);
	if (queue){
		response = queue.dequeue();
		console.log('dequeuing response to: ', requestorId);
	}
	sendResponse(requestorId);
}

function sendRequest(responderId) {
	console.log('QueuesManager.sendRequest(): ', responderId);
	var queue = getRequestQueue(responderId);
	if (queue){
		request = queue.peek();
		if (request) {
			emitter.emit(responderId, request);
		}
	} else {
		console.log('Sem request na fila de: ', responderId);
	}
}

function sendResponse(requestorId) {
	console.log('QueuesManager.sendResponse(): ', requestorId);
	var queue = getResponseQueue(requestorId);
	console.log('responseQueue: ', queue);
	if (queue){
		response = queue.peek();
		if (response) {
		//requestorManager.sendResponse(requestorId, response);
			emitter.emit(requestorId, response);
			console.log('>>>>>>>>>>>: ', requestorId);
		} else {
			console.log('Sem response na fila de: ', requestorId);
		}
	} else {
		console.log('Sem response na fila de: ', requestorId);
	}


}

function getRequestQueue(responderId) {
	console.log('QueuesManager.getRequestQueue()');
	console.log('queues: ', requestQueues);
	var queue;
	var result = requestQueues.filter(function (queue) {
		return responderId === queue.getDestinationUuid();
	});
	if (result.length) {
		queue = result[0];
	}

	return queue;
}

function getResponseQueue(requestorId) {
	console.log('QueuesManager.getResponseQueue()');
	var queue;
	var result = responseQueues.filter(function (queue) {
		return requestorId === queue.getDestinationUuid();
	});
	console.log('result: ', result);
	if (result.length) {
		queue = result[0];
	}
	return queue;
}
/*
function isOnline(destinationId) {
	return online.indexOf(destinationId) >= 0;
}
*/
module.exports = QueuesManager;
