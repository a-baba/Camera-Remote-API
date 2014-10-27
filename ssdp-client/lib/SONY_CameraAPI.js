var DescManager = require('./DescManager');
var http = require('http');

var SONY_CameraAPI = function(device, callback) {
  this.device = device;

  var self = this;

  this.destroy_flag = false;
  
};


SONY_CameraAPI.prototype.init = function(callback){

  var self = this;

  DescManager.get(this.device.LOCATION,
    [
      "av:X_ScalarWebAPI_ActionList_URL",
      "av:X_ScalarWebAPI_LiveView_URL"
    ],
    function(res) {
      console.log("in callback");
      self.endpoints = res;
      console.log(self.endpoints);

      if(typeof(callback) == "function") {
        callback();
      };

    });
}

SONY_CameraAPI.prototype.getDevice = function(){
  return this.device;
}

SONY_CameraAPI.prototype.getEndpoints = function(){
  return this.endpoints;
}

SONY_CameraAPI.prototype.get = function(method, callback){
  var endpoint = this.endpoints["av:X_ScalarWebAPI_ActionList_URL"];
  var method = methods[method];

  var opts = this.parseURL(endpoint);
  opts.path += "/camera";
  opts.method = "POST";

  console.log(opts);

  var req = http.request(opts, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      if(typeof(callback) === "function") {
        callback(chunk);
      } else {
        console.log(chunk);
      }
    });
  });

  req.write(JSON.stringify(method));
  req.end();
}

SONY_CameraAPI.prototype.getLiveView = function(callback){
  console.log("getLiveView");
  // fixme : implement accesss Live View URL and callaback data

  console.log("this---------------------");
  console.log(this);
  var endpoint = this.endpoints["av:X_ScalarWebAPI_LiveView_URL"];
  console.log("endpoint---------------------");
  console.log(endpoint);
  var opts = this.parseURL(endpoint);
  console.log("opts---------------------");
  console.log(opts);

  var self = this;

  var req = http.request(opts, function(res) {
    //res.setEncoding('utf8');
    res.responseType = "arraybuffer";
    res.on('data', function(chunk) {
      if(self.destroy_flag){
        req.abort();
        self.destroy_flag = false;
      }
      else{
        if(typeof(callback) === "function") {
          callback(chunk);
        } else {
          console.log(chunk);
        }
      }
    });
  });

  req.end();

}

SONY_CameraAPI.prototype.parseURL = function(url) {
  var a = url.split("/");

  return {
    hostname: a[2].split(":")[0],
    port: a[2].split(":")[1] ? a[2].split(":")[1] : 80,
    path: "/" + a[3],
  };
}


var methods = {
  "startLiveView": {
    "method": "startLiveView",
    "params": [],
    "id": 1,
    "version": "1.0"
  },
  "stopLiveView": {
    "method": "stopLiveView",
    "params": [],
    "id": 1,
    "version": "1.0"
  },

  "getShootMode": {
    "method": "getShootMode",
    "params": [],
    "id": 1,
    "version": "1.0"
  }
}

SONY_CameraAPI.prototype.destroy = function() {
  this.destroy_flag = true;
};

module.exports = SONY_CameraAPI;
