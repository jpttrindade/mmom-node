var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var IMMomClient = require('mmomclient');
var EventEmitter = require('events').EventEmitter;
var static = require('node-static');

var fileServer = new static.Server('./public');

var HOST = '192.168.1.123';
var PORT = 5679;

var REQUESTOR_ID = 'client_3';
var REQUEST_ID = 1;
var mSocket;

var requests = {};

var onReceiveResponse = function (requestId, type, body) {
  switch (type) {
    case 1:
      if (requests[requestId] === 'get_hour()') {
        mSocket.emit('response_gethour', body.content);
      } else if (requests[requestId] === 'get_gps()') {
        mSocket.emit('response_getgps', body.content);
      }
      break;
    case 2:
      var file = fs.appendFileSync('public/imgs/'+body.fileName, body.content);
      mSocket.emit('response_takepic', 'imgs/'+body.fileName);
      break
    default:

  }
  console.log('onReceiveResponse', requestId + ' - ' + JSON.stringify(body));

}

var onConnectionEstablished = function () {
  console.log('onConnectionEstablished');
}

var onConnectionClosed = function () {
  console.log('onConnectionClosed');
}


var brokerEventCallback = new EventEmitter();
brokerEventCallback.on('response', onReceiveResponse);
brokerEventCallback.on('connected', onConnectionEstablished);
brokerEventCallback.on('disconnected', onConnectionClosed);

mmomClient = new IMMomClient(HOST, PORT);

mmomClient.connect(REQUESTOR_ID, brokerEventCallback);

app.listen(3000);

function handler(req, res) {
  req.addListener('end', function () {
      fileServer.serve(req, res);
  }).resume();
}

io.on('connection', function (socket) {
  mSocket = socket;
  socket.on('gethour', function () {
    mmomClient.sendRequest('request_'+REQUEST_ID, 'RESPONDER_1','get_hour()');
    requests['request_'+REQUEST_ID] = 'get_hour()'
    REQUEST_ID++;
  });
  socket.on('getgps', function () {
    mmomClient.sendRequest('request_'+REQUEST_ID, 'RESPONDER_1', 'get_gps()');
    requests['request_'+REQUEST_ID] = 'get_gps()'
    REQUEST_ID++;
  })
  socket.on('takepic', function () {
    mmomClient.sendRequest('request_'+REQUEST_ID,'camera_1', 'get_image()');
    REQUEST_ID++;
  })
});
