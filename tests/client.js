var net = require('net');
var Buffer =  require('buffer').Buffer;
var MessageEncoder = require('../client/MessageEncoder');
var Message = require('../common/Message');

var HOST = '192.168.1.123';
//var HOST ='192.168.43.197';
var PORT = 5679;


var client = new net.Socket();

client.on('data', onResponse);

client.connect(PORT, HOST, function () {
  console.log('Connected!');
  var message = new Message();
  message.setCode(1);
  message.setRequestId('request_1');
  message.setDestinationId('uuid1');
  //message.setType(1);
  //message.setContent('exec_takepic');
  message.setContent('get_hour()');
  client.write(MessageEncoder.encode(message));

  //client.end();

});

function onResponse(response) {
	message = MessageEncoder.decode(response);
	console.log('Response: ', message);
}