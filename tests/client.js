var net = require('net');
var Buffer =  require('buffer').Buffer;

var HOST = '192.168.1.103';
var PORT = 2021;


var client = new net.Socket();

client.connect(PORT, HOST, function () {
  console.log('Connected!');
  var ola = 'Ola';

  const buf = new Buffer(ola.length);
  console.log(buf);
  buf.fill(ola);
  console.log(buf);
  client.write(buf);
  client.end();
});
