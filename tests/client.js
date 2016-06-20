var net = require('net');
var fs = require('fs');
var Buffer =  require('buffer').Buffer;
var MessageEncoder = require('../client/MessageEncoder');
var Message = require('../common/Message');
var HOST = '192.168.1.123';
//var HOST ='192.168.43.197';
var PORT = 5679;

var receiveDataCount = 0;
var receiveDataBuffer;

var client = new net.Socket();

client.on('data', onResponse);

client.connect(PORT, HOST, function () {
  console.log('Connected!');

/************************************/


  sendConnectionData();

/************************************/ 
  sendHourRequest();

/************************************/

  //sendImageRequest();

/************************************/
  //client.end();

});

function onResponse(data) {
  var end = data.slice(data.length-2, data.length);

  console.log('end = ', end.toString('utf8')==='\n\n');

  if (end.toString('utf8') === '\n\n') {
    data = data.slice(0, data.length-2);

    if(receiveDataCount > 0) {
      data = Buffer.concat([receiveDataBuffer, data]);
    }
    
    message = MessageEncoder.decode(data);
    console.log('Response: ', message);

    if(message.head.type === 2) {
      console.log('Response size: ', data.length);
      console.log('message content size: ', message.body.content.length);
      fs.appendFileSync(message.body.fileName, message.body.content);
    }

    receiveDataCount = 0;
  } else {

    if(receiveDataCount === 0){
      receiveDataBuffer = data;
    } else {
      receiveDataBuffer = Buffer.concat([receiveDataBuffer, data]);
    }
    receiveDataCount++;
  }
}

function sendConnectionData() {
  var message = new Message();
  message.setCode(0);
  message.setDestinationId('requestor_1');
  client.write(MessageEncoder.encode(message));
  console.log('connection code sended');
}

function sendHourRequest() {
  var message = new Message();
  message.setCode(1);
  message.setDestinationId('HOLA_QUE_TAL');
  message.setRequestorId('requestor_1');
  message.setRequestId('request_1');
  message.setContent('get_hour()');
  client.write(MessageEncoder.encode(message));
  console.log('hour request sended');
}

function sendImageRequest() {
  var message = new Message();
  message.setCode(1);
  message.setDestinationId('HOLA_QUE_TAL');
  message.setRequestorId('requestor_1');
  message.setRequestId('request_2');
  message.setContent('get_image:imagens.jpg');
  client.write(MessageEncoder.encode(message));
  console.log('image request sended');
}