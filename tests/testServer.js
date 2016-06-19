var net = require('net');
var MessageEncoder = require('../client/MessageEncoder');
var Message = require('../common/Message');

var HOST = '192.168.1.123';
//var HOST ='192.168.43.197';
var PORT = 5678;


var client = new net.Socket();

client.on('data', function(data) {
	console.log('data: ', data);
	message = MessageEncoder.decode(data);
	console.log('message: ', message);

	
});

client.connect(PORT, HOST, function () {
  console.log('Connected!');
  var message = new Message();
  message.setCode(0);
  //message.setRequestId('request_1');
  //message.setDestinationId('destinationId_333');
  //message.setType(1);
  message.setDestinationId('destinationId_333');
  client.write(MessageEncoder.encode(message));
  //client.end();

});