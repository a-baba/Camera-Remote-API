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
    this.playing_ = {};

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
      this.showPicker__(resolve, urn, devices);
    } else {
      // reject({"type": "error", "mesg": "no devices"});
    }
  }
          

  // show picker
  presentation_.showPicker__ = function(resolve, urn, devices) {

    var self = this;

    var button = document.querySelector("button#extern");
    var old_picker = document.querySelector("#picker");
    if(old_picker) old_picker.remove();

    var pos = $("#extern").offset();
    var picker = document.createElement("form");
    picker.id = "picker";
    picker.style.top = pos.top + "px";

    var html = "";
    for(var uuid in devices) {
      var device = devices[uuid];
      html += "<label class='candidate' data-urn='" + encodeURIComponent(urn) + "' data-uuid='" + encodeURIComponent(uuid) + "'>" + device.SERVER + "</label><br>";
    }

    picker.innerHTML = html;

    document.body.appendChild(picker);

    $(document).click(function(event) {
      if (!$.contains($("#picker")[0], event.target)) {
          $("#picker").remove();
      }
    });

    $(".candidate").on("click", function(ev){
      ev.preventDefault();
      var selected = ev.target;
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

        /////////////////////////////////////////
        var session = new Session(); // todo: ここで、さっくる作成のsessionオブジェクトを渡す
        document.body.removeChild(picker);
        resolve(session);
      }
      xhr.send(params);

    });
  }
        
  presentation_.init_();

  navigator.presentation = presentation_;
}(window));

if(true) {
}
