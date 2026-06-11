const EventEmitter = require('events');

class NyayEventBus extends EventEmitter {}

module.exports = new NyayEventBus();
