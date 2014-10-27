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
      console.log(urn);
      presentation_.getDevices_(resolve, urn);
    });

    return p;
  }

  // getDevices
  presentation_.getDevices_ = function(resolve, urn) {
    var xhr = new XMLHttpRequest();
    var params = "urn="+encodeURIComponent(urn);

    xhr.open('POST', '/discovery/getDevices');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhr.setRequestHeader("Content-length", params.length);
    // xhr.setRequestHeader("Connection", "close");

    xhr.onload = function(ev) {
      console.log(xhr.responseText);
      var devices = JSON.parse(xhr.responseText);
      presentation_.showPicker_(resolve, urn, JSON.parse(devices));
    }
    xhr.send(params);
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
  presentation_.showPicker_ = function(resolve, urn, devices) {
    if(devices) {
      // fixme: negating id
      console.log(devices);
      this.showPicker__(resolve, urn, devices);
    } else {
      // reject({"type": "error", "mesg": "no devices"});
    }
  }
          

  // show picker
  presentation_.showPicker__ = function(resolve, urn, devices) {
    var picker = document.createElement("form");
    picker.style.width = "320px";
    picker.style.padding = "10px";
    picker.style.background = "white";
    picker.style.border  = "1px solid black";
    picker.style.position  = "absolute";
    picker.style.left = "100px";
    picker.style.top = "0px";

    var html = "";
    for(var uuid in devices) {
      var device = devices[uuid];
      html += "<label><input type='radio' data-urn='" + encodeURIComponent(urn) + "' data-uuid='" + encodeURIComponent(uuid) + "'>" + device.SERVER + "</label><br>";
    }
    html += "<input type='submit' value='select'>";

    picker.innerHTML = html;

    document.body.appendChild(picker);

    picker.onsubmit = function(ev) {
      ev.preventDefault();
      var selected = document.querySelector("form input:checked");
      console.dir(selected);
      var urn = selected.dataset.urn;
      var uuid = selected.dataset.uuid;

      var xhr = new XMLHttpRequest();
      var params = "urn="+urn+"&uuid="+uuid;

      xhr.open('POST', '/discovery/setDevice');
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // xhr.setRequestHeader("Content-length", params.length);
      // xhr.setRequestHeader("Connection", "close");

      xhr.onload = function(ev) {
        // just a debugging
        var selected = JSON.parse(xhr.responseText);
        console.log(selected);

        /////////////////////////////////////////
        var session = {}; // todo: ここで、さっくる作成のsessionオブジェクトを渡す
        document.body.removeChild(picker);
        resolve(session);
      }
      xhr.send(params);

    }
  }
        
        








  presentation_.init_();

  navigator.presentation = presentation_;
}(window));

if(true) {
}
