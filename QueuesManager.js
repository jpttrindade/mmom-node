var EventEmitter = require('events').EventEmitter;

var queues;
var emitter;
var online;

function QueuesManager() {
	online = [];
	queues = [];

	emitter = new EventEmitter();
	emitter.on('connect', onDestinationConnect);
	emitter.on('disconnect', onDestinationDisconnect);
}

QueuesManager.prototype.getEmitter = function() {
	return emitter;
}

function onDestinationConnect(uuid) {
	console.log('QueuesManager.onDestinationConnect: ', uuid);
	online.indexOf(uuid) <= 0 || online.push(uuid);
	console.log('clients online: ', online);
	dequeueRequest(uuid);
}

function onDestinationDisconnect(uuid) {
    console.log('QueuesManager.onDestinationDisconnect: ', uuid);
    index = online.indexOf(uuid);
    if(index) online.splice(index,1);
}

function dequeueRequest(uuid) {
	var queue;
	var result = queues.filter(function (queue) {
		return uuid === queue.getDestinationUuid();
	});
	if(result.length) {	
		queue = result[0];
	}
	request = queue.dequeue();
	if(request) {
		emitter.emit(uuid, request);
	}
}
module.exports = QueuesManager;