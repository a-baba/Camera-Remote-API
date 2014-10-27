
var Client = require('node-ssdp').Client
  // , client = new Client({log: true, logLevel: "trace"});
  , client = new Client({})
  , EventEmitter = require('events').EventEmitter
  , util = require('util')



var db = {};

var SSDPManager = function(){
  this.listen();
  this.search("upnp:rootdevice"); // do initial M-SEARCH

  // start M-SEARCH per 30 seconds.
  setInterval(function(){
    this.search("upnp:rootdevice");
  }.bind(this), 30000);

  return this.ev;
};

util.inherits(SSDPManager, EventEmitter);

SSDPManager.prototype.listen = function(){
  var self = this;

  // M-SEARCH response
  client.on('response', function(headers, statusCode, rinfo) {
    if(!db[headers.ST]) db[headers.ST] = {};

    if(!db[headers.ST][headers.USN]) db[headers.ST][headers.USN] = headers;
  });
  
  // NOTIFY (alive)
  client.on('advertise-alive', function(headers, statusCode, rinfo) {
    if(!db[headers.NT]) db[headers.NT] = {};

    if(!db[headers.NT][headers.USN]) db[headers.NT][headers.USN] = headers;

    self.emit('notify', {"NT": headers.NT, "headers": headers});
  });

  // NOTIFY (byebye)
  client.on('advertise-bye', function(headers, statusCode, rinfo) {
    if(db[headers.NT] && db[headers.NT][headers.USN]) delete db[headers.NT][headers.USN];
  });
}

// get discovered devices
SSDPManager.prototype.get = function(target){
  if(!target) return db;

  return db[target] || {};
}


SSDPManager.prototype.search = function(st){
  client.search(st);
}

module.exports = SSDPManager;

(function(){
  // belows are test code.
  if(process.argv[1].match('SSDPManager.js')) {
    var ROOTDEVICE = "upnp:rootdevice";
    var CAMERAREMOTEAPI_ST = 'urn:schemas-sony-com:service:ScalarWebAPI:1';

    var reader = require('readline').createInterface({
      input : process.stdin,
      output : process.stdout
    });

    // start SSDP Manager
    SSDPManager.start();
    SSDPManager.search(ROOTDEVICE);

    // define listener
    var self = this;
    reader.on('line', function(line) {
      switch(line) {
      case 'show':
        console.log(SSDPManager.get());
        break;
      case 'sony':
        console.log(SSDPManager.get(CAMERAREMOTEAPI_ST));
        break;
      case 'search':
        console.log(SSDPManager.search(SSDPManager.search(ROOTDEVICE)));
        break;
      case 'help':
      default:
        console.log("command - [show/sony/search]");
      }
    });


    }
}());
