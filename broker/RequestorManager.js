
var qmEmitter;
var requestors;

function RequestorManager() {
	requestors = {};
	size = 0;
}

RequestorManager.prototype.setQueuesManagerEmitter = function (_emitter) {
	qmEmitter = _emitter;
	qmEmitter.on('send_response', this.sendResponse);
}

RequestorManager.prototype.sendResponse = function (requestorId, response) {
	//console.log("######### RequestorManager.sendResponse: ", requestorId)
	if (requestors[requestorId]) {
		requestors[requestorId].onReceiveResponse(response);
	} else {
		console.log('requestorId not found: ', requestorId);
	}
}


RequestorManager.prototype.add = function (requestor) {
	size += requestors[requestor.getRequestorId()] ? 0 : 1;
	requestors[requestor.getRequestorId()] = requestor;

	//console.log('xxxxxxxxxx: ',requestor.getRequestorId());
	qmEmitter.on(requestor.getRequestorId(), requestor.onReceiveResponse);
	qmEmitter.emit('requestor_connect', requestor.getRequestorId());

	console.log('Requestor added with key:', requestor.getRequestorId());
	console.log('RequestorManager.count: ', size);
}

RequestorManager.prototype.remove = function (requestor) {
	console.log('requestorId = ', requestor.getRequestorId());
	requestors[requestor.getRequestorId()] === null || (function (){
		delete requestors[requestor.getRequestorId()];
		size--;
	}());

	qmEmitter.removeListener(requestor.getRequestorId(), requestor.onReceiveResponse);
	console.log('Requestor removed with key=', requestor.getRequestorId());
	console.log('RequestorManager.count: ', size);
}

RequestorManager.prototype.size = function () {
	return size;
}

module.exports = RequestorManager
