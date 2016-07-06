var EventEmitter = require('events').EventEmitter;
var MessageEncoder = require('./MessageEncoder');
var BrokerConnection = require('./BrokerConnection');
var Message = require('./Message');

function IMMomClient(_host, _port) {
  var requestorId;
  var brokerEventCallback;
  var receiveDataBuffer;

  var receiveDataCount = 0;
  var host = _host;
  var port = _port;


  var eventCallback = new EventEmitter();



  var brokerConnection = new BrokerConnection(host, port);

  this.connect = function (_requestorId, _brokerEventCallback) {
    requestorId = _requestorId;
    brokerEventCallback = _brokerEventCallback;
    var msg = new Message();
    msg.setCode(0);
    msg.setDestinationId(requestorId);
    var connectionData = MessageEncoder.encode(msg);
    brokerConnection.connect(requestorId, connectionData, eventCallback);
  }

  this.sendRequest = function (requestId, destinationId, request) {
    msg = new Message()
    msg.setCode(1);
    msg.setDestinationId(destinationId);
    msg.setRequestorId(requestorId);
    msg.setRequestId(requestId);
    msg.setContent(request);
    data = MessageEncoder.encode(msg);

    console.log(MessageEncoder.decode(data));
    brokerConnection.request(data);
  }

  this.closeConnection = function () {
    brokerConnection.closeConnection();
  }

  var onReceiveResponse = function (data) {
    var end = data.slice(data.length-2, data.length);

    console.log('end = ', end.toString('utf8')==='\n\n');

    if (end.toString('utf8') === '\n\n') {
      data = data.slice(0, data.length-2);

      if(receiveDataCount > 0) {
        data = Buffer.concat([receiveDataBuffer, data]);
      }

      var msg = MessageEncoder.decode(data);
      brokerEventCallback.emit('response', msg.head.requestId, msg.head.type, msg.body);
      //
      // if(message.head.type === 2) {
      //   console.log('Response size: ', data.length);
      //   console.log('message content size: ', message.body.content.length);
      //   fs.appendFileSync(message.body.fileName, message.body.content);
      // }

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

  var onConnectionEstablished = function () {
    brokerEventCallback.emit('connected');
  }

  var onConnectionClosed = function () {
    brokerEventCallback.emit('disconnected');
  }


  eventCallback.on('response', onReceiveResponse);
  eventCallback.on('connected', onConnectionEstablished);
  eventCallback.on('disconnected', onConnectionClosed);
}

module.exports = IMMomClient;
