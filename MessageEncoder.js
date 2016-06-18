var Message = require('./Message');
var Buffer =  require('buffer').Buffer;


function MessageEncoder() {}



// type.(requestIdSize.requestId)+.(mimetypeSize.mimetype)+.(content)
MessageEncoder.encode = function (message) {
	var bufferSize = getBufferSize(message);
	var buffer = new Buffer(bufferSize);

	index = writeType(message.head.type, buffer, 0);
	index = writeRequestId(message.head.requestId, buffer, index);
	index = writeFileName(message.body.fileName, buffer, index);

	switch(message.head.type) {
		case 0:
		case 1:
			index = writeTextContent(message.body.content, buffer, index);
		    break;
		case 2:
			index = writeFileContent(message.body.content, buffer, index);

	}
	return buffer;
}

MessageEncoder.decode = function (buffer) {
	var message = new Message();
	var index = 0;
	index = readType(message, buffer, index);
	index = readRequestId(message, buffer, index);
	index = readFileName(message, buffer, index);
	switch(message.head.type) {
		case 0:
		case 1:
			index = readTextContent(message, buffer, index);
			break;
		case 2:
			index = readFileContent(message, buffer, index);
			break;
	}
	return message;
}

function readType (message, buffer, index) {
	type = buffer[index];
	message.setType(type);
	index++;
	return index;
}

function readRequestId (message, buffer, index) {
	if (message.head.type > 0) {
		requestIdSize = buffer[index];
		index++;
		requestId = buffer.toString('utf8', index, index+requestIdSize);
		message.setRequestId(requestId);
		index += requestIdSize;
	}
	return index;
}

function readFileName (message, buffer, index) {
	if (message.head.type === 2) {
		fileNameSize = buffer[index];
		index++;
		fileName = buffer.toString('utf8', index, index+ fileNameSize);
		message.setFileName(fileName);
		index += fileNameSize;
	}
	return index;
}

function readTextContent (message, buffer, index) {
	contentSize = buffer[index];
	index++;
	bufferTemp = new Buffer(contentSize);
	buffer.copy(bufferTemp, 0, index, contentSize);
	content = buffer.toString('utf8', index);
	message.setContent(content);
	index += contentSize;
	return index;
}


function readFileContent (message, buffer, index) {
	contentSize = buffer.length - index;
	contentBuffer = new Buffer(contentSize);
	buffer.copy(contentBuffer, 0, index, buffer.length);
	message.setContent(contentBuffer);
	index += contentSize;
	return index;
}

function writeType(type, buffer, index) {
	typeBuffer = new Buffer(1);
	typeBuffer.fill(type);
	typeBuffer.copy(buffer, index);
	return index+1;
}

function writeRequestId(requestId, buffer, index) {
	if(requestId) {
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


function writeFileName(fileName, buffer, index) {
	if (fileName) {
		fileNameSizeBuffer = new Buffer(1);
		fileNameSizeBuffer.fill(fileName.length);
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
	contentSizeBuffer.fill(content.length);
	contentSizeBuffer.copy(buffer,index);
	index++;
	contentBuffer = new Buffer(content);
	contentBuffer.copy(buffer, index)
	index += content.length;
	return index + content.length;
}

function writeFileContent(content, buffer, index) {
	content.copy(buffer, index);
	return index + content.length;
}


function getBufferSize (message) {
	size = 1 /*type*/;
	if (message.head.requestId) {
		size += 1 /*requestId size*/ + message.head.requestId.length /*requestId*/;
	}
	if (message.body.fileName){
		size += 1 /*fileName size*/+ message.body.fileName.length;/*fileName*/
	}
	if(message.head.type < 2){
		/*content size*/
		size++
	} 
	size += message.body.content.length /*content*/;
	return size;
}

module.exports = MessageEncoder;