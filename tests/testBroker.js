var Broker = require('./../broker/Broker');
var broker = new Broker();
broker.startResponderService();
broker.startRequestorService();