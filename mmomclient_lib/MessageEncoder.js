var Message = require('./Message');
var Buffer =  require('buffer').Buffer;


function MessageEncoder() {}


// type.(requestIdSize.requestId)+.(mimetypeSize.mimetype)+.(content)
MessageEncoder.encode = function (message) {
	console.log('message: ', message);
	var bufferSize = getBufferSize(message);
	var buffer = new Buffer(bufferSize);

	index = writeCode(message.head.code, buffer, 0);
	index = writeDestinationId(message.head.destinationId, buffer, index);
	index = writeRequestorId(message.head.requestorId, buffer, index);
	index = writeRequestId(message.head.requestId, buffer, index);
	index = writeType(message.head.type, buffer, index);
	index = writeFileName(message.body.fileName, buffer, index);

	if (message.head.code === 1) {
		index = writeTextContent(message.body.content, buffer, index);
	}

	if (message.head.code === 2){
		if (message.head.type === 1){
			index = writeTextContent(message.body.content, buffer, index);
		} else {
			index = writeFileContent(message.body.content, buffer, index);
		}

	}
	writeEnd(buffer,index);
	return buffer;
}

MessageEncoder.decode = function (buffer) {
	var message = new Message();
	var index = 0;
	index = readCode(message, buffer, index);
	index = readDestinationId(message, buffer, index);
	index = readRequestorId(message, buffer, index);
	index = readRequestId(message, buffer, index);
	index = readType(message, buffer, index);
	index = readFileName(message, buffer, index);
	console.log('message: ', message);

	if (message.head.code === 1){
		index = readTextContent(message, buffer, index);
	}

	if (message.head.code === 2){
		if(message.head.type === 1) {
			index = readTextContent(message, buffer, index);
		} else {
			index = readFileContent(message, buffer, index);
		}
	}

	return message;
}

function readCode (message, buffer, index) {
	code = buffer[index];
	message.setCode(code);
	index++;
	return index;
}

function readType (message, buffer, index) {
	if(message.head.code==2){
		type = buffer[index];
		message.setType(type);
		index++;
	}
	return index;
}

function readRequestorId (message, buffer, index) {
	if(message.head.code === 1) {
		requestorIdSize = buffer[index];
		index++;
		requestorId = buffer.toString('utf8', index, index+requestorIdSize);
		message.setRequestorId(requestorId);
		index += requestorIdSize;
	}
	return index;
}

function readRequestId (message, buffer, index) {
	if (message.head.code > 0) {
		requestIdSize = buffer[index];
		index++;
		requestId = buffer.toString('utf8', index, index+requestIdSize);
		message.setRequestId(requestId);
		index += requestIdSize;
	}
	return index;
}

function readDestinationId (message, buffer, index) {
	//if (message.head.code > 0) {
		destinationIdSize = buffer[index];
		index++;
		destinationId = buffer.toString('utf8', index, index+destinationIdSize);
		message.setDestinationId(destinationId);
		index += destinationIdSize;
	//}
	return index;
}

function readFileName (message, buffer, index) {
	if (message.head.code === 2 && message.head.type === 2) {
		fileNameSize = buffer[index];
		index++;
		fileName = buffer.toString('utf8', index, index+fileNameSize);
		message.setFileName(fileName);
		index += fileNameSize;
	}
	return index;
}

function readTextContent (message, buffer, index) {
	contentSize = buffer[index];
	console.log('contentSize: ',contentSize);
	index++;
	bufferTemp = buffer.slice(index);
	content = buffer.toString('utf8', index, index+contentSize);
	message.setContent(content);
	index += contentSize;
	return index;
}


function readFileContent (message, buffer, index) {
	contentSize = buffer.length - index - 2;
	contentBuffer = new Buffer(contentSize);
	buffer.copy(contentBuffer, 0, index, buffer.length);
	message.setContent(contentBuffer);
	index += contentSize;
	return index;
}

function writeCode(code, buffer, index) {
	codeBuffer = new Buffer(1);
	codeBuffer.fill(code);
	codeBuffer.copy(buffer, index);
	return index+1;
}

function writeType(type, buffer, index) {
	if (type) {
		typeBuffer = new Buffer(1);
		typeBuffer.fill(type);
		typeBuffer.copy(buffer, index);
		index++;
	}
	return index;
}

function writeRequestorId(requestorId, buffer, index) {
	if (requestorId) {
		requestorIdSizeBuffer = new Buffer(1);
		requestorIdSizeBuffer[0] = requestorId.length;
		requestorIdSizeBuffer.copy(buffer, index, 0, 1);
		index++;
		requestorIdBuffer = new Buffer(requestorId);
		requestorIdBuffer.copy(buffer, index, 0, requestorId.length);
		index += requestorId.length;
	}
	return index;
}

function writeRequestId(requestId, buffer, index) {
	if (requestId) {
		writeRequestIdSizeBuffer = new Buffer(1);
		writeRequestIdSizeBuffer[0] = requestId.length;
		writeRequestIdSizeBuffer.copy(buffer, index, 0, 1);
		index++;
		requestIdBuffer = new Buffer(requestId);
		requestIdBuffer.copy(buffer, index, 0, requestId.length);
		index += requestId.length;
	}
	return index;
}

function writeDestinationId(destinationId, buffer, index) {
	if(destinationId) {
		writeDestinationIdSizeBuffer = new Buffer(1);
		writeDestinationIdSizeBuffer[0] = destinationId.length;
		writeDestinationIdSizeBuffer.copy(buffer, index, 0, 1);
		index++;
		destinationIdBuffer = new Buffer(destinationId);
		destinationIdBuffer.copy(buffer, index, 0, destinationId.length);
		index += destinationId.length;
	}
	return index;
}

function writeFileName(fileName, buffer, index) {
	if (fileName) {
		fileNameSizeBuffer = new Buffer(1);
		fileNameSizeBuffer[0] = fileName.length;
		fileNameSizeBuffer.copy(buffer,index);
		index++;
		fileNameBuffer = new Buffer(fileName);
		fileNameBuffer.copy(buffer, index)
		index += fileName.length;
	}
	return index;
}

function writeTextContent(content, buffer, index) {
	contentSizeBuffer = new Buffer(1);
	contentSizeBuffer[0] = content.length;
	contentSizeBuffer.copy(buffer,index);
	index++;
	contentBuffer = new Buffer(content);
	console.log('buffer.size: ', buffer.length);
	console.log('index: ', index);
	contentBuffer.copy(buffer, index)
	index += content.length;
	return index;
}

function writeFileContent(content, buffer, index) {
	content.copy(buffer, index);
	index += content.length
	return index;
}


function writeEnd(buffer, index) {
	var end = new Buffer('\n\n');
	end.copy(buffer, index);
}

function getBufferSize (message) {
	size = 1 /*code*/;

	if(message.head.requestorId) {
		size += 1 + message.head.requestorId.length;
	}
	if (message.head.requestId) {
		size += 1 /*requestId size*/ + message.head.requestId.length /*requestId*/;
	}
	if (message.head.destinationId) {
		size += 1 /*requestId size*/ + message.head.destinationId.length /*requestId*/;
	}
	if (message.head.type) {
		size += 1;
	}
	if (message.body.fileName){
		size += 1 /*fileName size*/+ message.body.fileName.length;/*fileName*/
	}



	if(message.head.code == 1 || message.head.type == 1){

		/*content size*/
		size++;
	}

	if(message.head.code > 0) {
		size += message.body.content.length /*content*/;
	}

	size += 2 /*end size*/;
	return size;
}

module.exports = MessageEncoder;
