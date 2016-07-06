
//var destinationUuid;
//var datas;

function Queue (_destinationUuid) {
	//destinationUuid = _destinationUuid
	//datas = [];
	this.destinationUuid = _destinationUuid
	this.datas = [];
}

Queue.prototype.getDestinationUuid = function() {
	return this.destinationUuid;
}

Queue.prototype.enqueue = function(data) {
	console.log('Queue.enqueue to: ', this.destinationUuid);
	this.datas.push(data);
}


Queue.prototype.dequeue = function() {
	console.log('Queue.dequeue.antes: ', this.datas);
	data = this.datas.shift();
	console.log('Queue.dequeue.depois: ', this.datas);
	return data;
}

Queue.prototype.peek = function(){
	return this.datas[0];
}

module.exports = Queue;