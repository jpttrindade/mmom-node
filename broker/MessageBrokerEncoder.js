
function MessageBrokerEncoder() {
	
}

//head = {code: '', requestId: '', destination: '', type: ''}
MessageBrokerEncoder.getHead = function(buffer) {
	var index = 0;
	var head = {};
	head.code = buffer[index];
	index++;

	if (head.code > 0){
		//get requestID
		requestIdSize = buffer[index];
		index++;
		requestId = buffer.toString('utf8', index, index+requestIdSize);
		head.requestId = requestId;
		index += requestIdSize;
	}

	//request ou response
	//get destination
	destinationIdSize = buffer[index];
	index++;
	console.log('>>>buf: ', buffer);
	console.log('>>>buf: ', buffer.toString('utf8'));
	console.log('>>>buf: ', index);
	console.log('>>>buf: ', buffer.length);
	destinationId = buffer.toString('utf8', index, index+destinationIdSize);
	head.destinationId = destinationId;
	index += destinationIdSize;
	
	if(head.code == 2) {
		head.type = buffer[index];
	}
	return head;
}

module.exports = MessageBrokerEncoder;

