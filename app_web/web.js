var static = require('node-static');
var IMMomClient = require('mmomclient');

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;


var fileServer = new static.Server('./public');

var HOST = '172.22.68.46';
var PORT = 5679;

var REQUESTOR_ID = 'client_3';
var REQUEST_ID = 1;
var mSocket;

var requests = JSON.parse(fs.readFileSync('requests.json', 'utf8'));

var onReceiveResponse = function (requestId, type, body) {
  switch (type) {
    case 1:
      if (requests[requestId] === 'get_hour()') {
        mSocket.emit('response_gethour', body.content);
      } else if (requests[requestId] === 'get_gps()') {
        mSocket.emit('response_getgps', body.content);
      } else {
        console.log("ops");
      }
      break;
    case 2:
      var file = fs.appendFileSync('public/imgs/'+body.fileName, body.content);
      mSocket.emit('response_takepic', 'imgs/'+body.fileName);
      break
    default:

  }
  delete requests[requestId];
  fs.writeFileSync('requests.json',  JSON.stringify(requests));
  console.log('onReceiveResponse', requestId + ' - ' + JSON.stringify(body));

}

var onConnectionEstablished = function () {
  console.log('onConnectionEstablished');
  mSocket.emit('connected');
}

var onConnectionClosed = function () {
  console.log('onConnectionClosed');
  mSocket.emit('disconnected');
}


var brokerEventCallback = new EventEmitter();
brokerEventCallback.on('response', onReceiveResponse);
brokerEventCallback.on('connected', onConnectionEstablished);
brokerEventCallback.on('disconnected', onConnectionClosed);

var mmomClient = new IMMomClient(HOST, PORT);

//mmomClient.connect(REQUESTOR_ID, brokerEventCallback);

app.listen(3000);

function handler(req, res) {
  req.addListener('end', function () {
      fileServer.serve(req, res);
  }).resume();
}

io.on('connection', function (socket) {
  mSocket = socket;

  socket.on('connectToBroker', function () {
    mmomClient.connect(REQUESTOR_ID, brokerEventCallback);
  });

  socket.on('disconnectFromBroker', function () {
    mmomClient.closeConnection();
  });

  socket.on('gethour', function () {
    mmomClient.sendRequest('request_'+REQUEST_ID, 'RESPONDER_1','get_hour()');

    requests['request_'+REQUEST_ID] = 'get_hour()'
    fs.writeFileSync('requests.json',  JSON.stringify(requests));
    REQUEST_ID++;
  });
  socket.on('getgps', function () {
    mmomClient.sendRequest('request_'+REQUEST_ID, 'RESPONDER_1', 'get_gps()');
    requests['request_'+REQUEST_ID] = 'get_gps()'
    fs.writeFileSync('requests.json',  JSON.stringify(requests));

    REQUEST_ID++;
  })
  socket.on('takepic', function () {
    mmomClient.sendRequest('request_'+REQUEST_ID,'camera_1', 'get_image()');
    requests['request_'+REQUEST_ID] = 'takepic'
    fs.writeFileSync('requests.json',  JSON.stringify(requests));
    REQUEST_ID++;
  })
});
