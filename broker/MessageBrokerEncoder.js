
function MessageBrokerEncoder() {
	
}

//head = {code: '', requestorId: '',requestId: '', destination: '', type: ''}
MessageBrokerEncoder.getHead = function(buffer) {
	var index = 0;
	var head = {};
	head.code = buffer[index];
	index++;

	//request ou response
	//get destination
	destinationIdSize = buffer[index];
	index++;
	destinationId = buffer.toString('utf8', index, index+destinationIdSize);
	head.destinationId = destinationId;
	index += destinationIdSize;

	if (head.code === 1) {
		//get requestorId
		requestorIdSize = buffer[index];
		index++;
		requestorId = buffer.toString('utf8', index, index+requestorIdSize);
		head.requestorId = requestorId;
		index += requestorIdSize;
	}

	if (head.code > 0) {
		//get requestID
		requestIdSize = buffer[index];
		index++;
		requestId = buffer.toString('utf8', index, index+requestIdSize);
		head.requestId = requestId;
		index += requestIdSize;
	}

	

	
	if(head.code == 2) {
		head.type = buffer[index];
	}
	return head;
}

module.exports = MessageBrokerEncoder;

