var net = require('net');

function BrokerConnection(_host, _port) {
  var requestorId;
  var eventCallback;

  var host = _host;
  var port = _port;

  var connection = new net.Socket();

  this.connect = function (_requestorId, connectionData, _eventCallback) {
    requestorId = requestorId;
    eventCallback = _eventCallback;

    setImmediate(function() {
      connection.connect(port, host, function () {
        connection.write(connectionData);
        console.log('connection code sended');
        eventCallback.emit('connected');
      });
    });
  }

  this.request = function (data) {
    setImmediate(function () {
      connection.write(data);
    });
  }

  var onResponse = function (responseData) {
    setImmediate(function() {
      eventCallback.emit('response', responseData);
    });
  }
  var onClose = function (had_error) {
    setImmediate(function () {
      eventCallback.emit('disconnected');
    });
  }
  connection.on('data', onResponse);
  connection.on('close', onClose);
}


module.exports = BrokerConnection;
