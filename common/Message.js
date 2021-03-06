

// Message = require('./Message')
// m = new Message();	
function Message() {
	this.head  = {};
	this.body = {};
}

Message.prototype.setCode = function (code) {
	if (typeof code === 'number') {
		this.head.code = code;
	} else {
		throw new Error('tipo errado');
	}
}

Message.prototype.setRequestorId = function (requestorId) {
	if (typeof requestorId === 'string') {
		this.head.requestorId = requestorId;
	} else {
		throw new Error('tipo errado');
	}
}

Message.prototype.setRequestId = function (id) {
	if (typeof id === 'string') {
		this.head.requestId = id;
	} else {
		throw new Error('tipo errado');	
	}
}

Message.prototype.setContent = function (content) {
	this.body.content = content;
}

Message.prototype.setFileName = function (fileName) {
	if (typeof fileName === 'string') {
		this.body.fileName = fileName;
	} else {
		throw new Error('tipo errado');	
	}
}

Message.prototype.setDestinationId = function (destinationId) {
	if(typeof destinationId === 'string') {
		this.head.destinationId = destinationId;
	} else {
		throw new Error('tipo errado');
	}
}

Message.prototype.setType = function (type) {
	if(typeof type === 'number') {
			this.head.type = type;
		} else {
			throw new Error('tipo errado');
		}
}

module.exports = Message;
