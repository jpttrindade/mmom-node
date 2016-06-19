var Broker = require('./../broker/Broker');
var broker = new Broker();
broker.startServerService();
broker.startClientService();