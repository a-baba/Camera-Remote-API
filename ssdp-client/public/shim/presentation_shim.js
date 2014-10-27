/**
 * presentation_shim.js
 *
 * @author : Kensaku Komatsu
 *
 */

(function(global){
  // if navigator.presentation exists, return immidiately.
  if(navigator.presentation) return;

  var NODEURL = "ws://localhost:28887";

  var presentation_ = {};

  presentation_.init_ = function(){
    this.ws_ = null;   // websocket instance for node shim
    this.devices_ = {}; // store device list

    this.start_();
  }

  presentation_.start_ = function(){
    this.startDiscovery_();
  }

  // start discovery
  presentation_.startDiscovery_ = function(){
    this.ws_ = new WebSocket(NODEURL);

    var self = this;
    this.ws_.onopen = function(ev) {
      // send "reqAvailableChange" for node shim
      var reqAC_ = JSON.stringify({"type": "reqAvailableChange"});
      self.ws_.send(reqAC_);

      self.setListener_();
    };
  }


  // set listener from node shim
  presentation_.setListener_ = function(){
    var self = this;
    this.ws_.onmessage = function(ev) {
      var mesg = JSON.parse(ev.data);
      console.log(mesg);

      switch(mesg.type) {
      case "resAvailableChange":
        // todo: this.devices_ にmesg.dataをうまいことセットする
        if(self.onavailablechange && typeof(self.onavailablechange === "function")) {
          self.onavailablechange();
        }
        break;
      default:
        break;
      }
    };
  }

  // startSession
  presentation_.startSession = function(urn, id) {
    var p = new Promise(function(resolve, reject){
      presentation_.showPicker_(resolve, reject, urn, id);
    });

    return p;
  }

  // joinSession
  presentation_.joinSession = function(urn, id) {
    var p = new Promise(function(resolve, reject){
      // todo: implement this feature
      // resolve();
    });

    return p;
  }


  // show picker
  presentation_.showPicker_ = function(resolve, reject, urn, id) {
    var devices = this.devices_[urn] ? this.devices_[urn] : null;
    if(devices) {
      // fixme: negating id
      this.showPicker__(resolve, reject, devices);
    } else {
      reject({"type": "error", "mesg": "no devices"});
    }
  }
          

  // show picker
  presentation_.showPicker__ = function(resolve, reject, devices) {
    var picker = document.createElement("div");
    picker.style.width = "320px";
    picker.style.height = "480px";
    picker.style.backgroune  = "white";
    picker.style.border  = "1px sold black";
    picker.style.position  = "absolute";
    picker.style.left = "100px";
    picker.style.top = "0px";

    document.body.aapendChild(picker);

  }
        
        








  presentation_.init_();

  navigator.presentation = presentation_;
}(window));

if(true) {
  navigator.presentation.startSession("urn", "id");
}
