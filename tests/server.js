var net = require('net');
var ConnectionMap = require('./ConnectionMap');

var Buffer =  require('buffer').Buffer;


var HOST = '192.168.1.123';
var PORT = 5678;

var socketlist = {};

var connectionMap = new ConnectionMap();

net.createServer(function (sock) {
  console.log('Connected: ' + sock.remoteAddress + ':' + sock.remotePort);


  sock.on('data', function (data) {
    type = getType(data);
    data = type.data;

    switch(type.type) {
  		case 0: //conn
  			connection = getConnectionContent(data);
  			console.log('connection.content: ', connection.content);
  			console.log('connection.data: ', connection.data);
  			connectionMap.add(connection.content, sock);
			console.log('connections: ', connectionMap.size());
  			const buf = new Buffer(1);
			buf.fill(10);
			sock.write(buf);
  			break;
  		case 1: //text
  			requestId = getRequestId(data);
			text = getText(requestId.data);
  			console.log('RequestId.content: ', requestId.content);
  			console.log('RequestId.data: ', requestId.data);

			response = JSON.parse(text.content).response;
  			console.log('Text.content: ', response);
  			console.log('Text.data: ', text.data);
  			sock.destroy();
  			break;
  	}

  });


  sock.on('close', function (had_error) {
  	console.log('on close: ', had_error);
  	connectionMap.remove(sock);
  	console.log('connections: ', connectionMap.size());

  })


}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);


function getType (buffer) {
	type = buffer[0]
	console.log('type: ', type)

	data = new Buffer(buffer.length-1);

	//buffer.copy(data, 0,length+1, buffer.length+1);

	buffer.copy(data,0, 1, buffer.length+1);

	return {
		type: type,
		data: data
	}
}

function getConnectionContent (buffer) {
	size = buffer[0];
	obj = new Buffer(size);

	buffer.copy(obj, 0, 1, size+1);

  	dataLength = buffer.length - size -1;

	data = new Buffer(dataLength);
	buffer.copy(data, 0, size+1, buffer.length+1)
	return {
		content:  obj.toString('utf8'),
		data: data
	}
}


function getRequestId (buffer) {
	size = buffer[0];
	obj = new Buffer(size);

	buffer.copy(obj, 0, 1, size+1);

  	dataLength = buffer.length - size -1;

	data = new Buffer(dataLength);
	buffer.copy(data, 0, size+1, buffer.length+1)
	return {
		content:  obj.toString('utf8'),
		data: data
	}
}

function getText (buffer) {
	size = buffer[0];
	obj = new Buffer(size);

	buffer.copy(obj, 0, 1, size+1);

  	dataLength = buffer.length - size -1;

	data = new Buffer(dataLength);
	buffer.copy(data, 0, size+1, buffer.length+1)
	return {
		content:  obj.toString('utf8'),
		data: data
	}
}

function getDestination (buffer) {
	console.log('buffer: ', buffer)
  	length = buffer[0];
  	console.log('length: ', length)
  	obj = new Buffer(length)
  	buffer.copy(obj, 0, 1, length+1);
  	console.log('obj; ', obj)
	destination = obj.toString('utf8');
	console.log('destination: ', destination)

  	dataLength = buffer.length - length -1;
  	console.log('dataLength: ', dataLength);
	data = new Buffer(dataLength);
  	buffer.copy(data, 0,length+1, buffer.length+1);

	return {
		dest: destination,
		data: data
	}
}