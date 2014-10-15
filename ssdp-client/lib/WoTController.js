
var SONY_CameraAPI = require('./SONY_CameraAPI')  // fixme このライブラリは、テストのためだけにロードしている。本当はいらない
  , SSDPManager = require('./SSDPManager');


var WoTController = { } // static obj.



WoTController.init = function(){
  // start SSDPManager
  SSDPManager.start();

  // startConsole
  this.startConsole();
}

var selects = {};

// get device list for urn
WoTController.getDevices = function(urn){
 if(!urn) return false;

  return SSDPManager.get(urn);
}


// set device for urn
WoTController.setDevice = function(urn, uuid){
  var devices = this.getDevices(urn);
  selects[urn] = devices[uuid];
}

// get selected devices
WoTController.getSelected = function(urn){
  return selects[urn];
}

// start stdin interface to check current discovered devices
WoTController.startConsole = function(){
  var ROOTDEVICE = "upnp:rootdevice";
  var CAMERAREMOTEAPI_ST = 'urn:schemas-sony-com:service:ScalarWebAPI:1';

  var reader = require('readline').createInterface({
    input : process.stdin,
    output : process.stdout
  });

  // start SSDP Manager
  var self = this;
  reader.on('line', function(line) {
    switch(line) {
    case 'show':
      console.log(self.getDevices(ROOTDEVICE));
      break;
    case 'sony':
      console.log(self.getDevices(CAMERAREMOTEAPI_ST));
      break;
    case 'selected':
      console.log(CAMERAREMOTEAPI_ST, self.getSelected(CAMERAREMOTEAPI_ST));
      console.log(ROOTDEVICE, self.getSelected(ROOTDEVICE));
      break;
    case 'search':
      console.log(SSDPManager.search(SSDPManager.search(ROOTDEVICE)));
      break;
    case 'help':
    default:
      console.log("command - [show/sony/selected/search]");
    }
  });

  console.log("command - [show/sony/search]");
}



module.exports = WoTController;


if(process.argv[1].match("WoTcontroller.js")) {

  WoTController.init();
  var urn = "urn:schemas-sony-com:service:ScalarWebAPI:1";

  WoTController.setDevice(urn, "uuid:00000000-0005-0010-8000-fcc2de538943::urn:schemas-sony-com:service:ScalarWebAPI:1"); 

  var device = WoTController.get(urn);
  
  switch(urn) {
  case "urn:schemas-sony-com:service:ScalarWebAPI:1":
    var plug = new SONY_CameraAPI(device);
    console.log(plug);
    break;
  default:
    console.log("unknown urn");
  }

  console.log(plug.getDevice());
  setTimeout(function(e){
    console.log(plug.getEndpoints());

    console.log(plug.get("getShootMode"));
  }, 2000);

}
