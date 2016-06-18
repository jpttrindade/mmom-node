var Broker = require('./Broker');
//var ConnectionQueue = require('./ConnectionQueue');
var Message = require('./Message');
var MessageEncoder = require('./MessageEncoder');

var broker = new Broker();

broker.startServer();

/*
m = new Message();
m.setType(0);
m.setContent('uuidxx');
buf = MessageEncoder.encode(m);
ms = MessageEncoder.decode(buf);

m = new Message();
m.setType(1);
m.setRequestId('requestId1')
m.setContent('texto qualquer');
buf = MessageEncoder.encode(m);
ms = MessageEncoder.decode(buf);

var Message = require('./Message');
var MessageEncoder = require('./MessageEncoder');
var fs = require('fs');
file = fs.readFileSync('./hdmi.png');
m = new Message();
m.setType(2);
m.setRequestId('requestId2')
m.setFileName('hdmi2.png');
m.setContent(file);
buf = MessageEncoder.encode(m);
ms = MessageEncoder.decode(buf);*/