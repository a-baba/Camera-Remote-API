
var SONY_CameraAPI = require('./SONY_CameraAPI');


var WoTController = { } // static obj.



WoTController.init = function(){
}

var selects = {};

// get device list for urn
WoTController.getDevices = function(urn){
  var _TMPRES = { 'uuid:00000000-0005-0010-8000-fcc2de538943::urn:schemas-sony-com:service:ScalarWebAPI:1': { HOST: '239.255.255.250:1900', 'CACHE-CONTROL': 'max-age=1800', LOCATION: 'http://192.168.40.10:64321/scalarwebapi_dd.xml', NT: 'urn:schemas-sony-com:service:ScalarWebAPI:1', NTS: 'ssdp:alive', SERVER: 'UPnP/1.0 SonyImagingDevice/1.0', USN: 'uuid:00000000-0005-0010-8000-fcc2de538943::urn:schemas-sony-com:service:ScalarWebAPI:1', 'X-AV-PHYSICAL-UNIT-INFO': 'pa=\"\"; pl=;', 'X-AV-SERVER-INFO': 'av=5.0; hn=\"\"; cn=\"Sony Corporation\"; mn=\"SonyImagingDevice\"; mv=\"1.0\";' }
  } 
 
  if(urn === "urn:schemas-sony-com:service:ScalarWebAPI:1") {
    var res = _TMPRES;
  } else {
    var res = null;
  }

  return res;
}


// set device for urn
WoTController.setDevice = function(urn, uuid){
  var devices = this.getDevices(urn);
  selects[urn] = devices[uuid];
}

WoTController.get = function(urn){
  return selects[urn];
}

module.exports = WoTController;


if(process.argv[1].match("WoTcontroller.js")) {
  var urn = "urn:schemas-sony-com:service:ScalarWebAPI:1";

  WoTController.setDevice(urn, "uuid:00000000-0005-0010-8000-fcc2de538943::urn:schemas-sony-com:service:ScalarWebAPI:1"); 

  var device = WoTController.get(urn);
  
  switch(urn) {
  case "urn:schemas-sony-com:service:ScalarWebAPI:1":
    var plug = new SONY_CameraAPI(device);
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
