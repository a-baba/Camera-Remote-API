var SONY_CameraAPI = require('./lib/SONY_CameraAPI')
  , WoTController = require('./lib/WoTController')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 28888});

WoTController.init();

var plug;

wss.on('connection', function(ws) {
  ws.on('message', function(mesg){
    var m = JSON.parse(mesg);

    console.log(m);

    switch(m.method){
    case "getDevices":
      ws.send(JSON.stringify(WoTController.getDevices(m.urn)));
      break;
    case "setDevice":
      // WoTController.setDevice(m.urn, m.uuid);
      break;
    case "setPlug":
      // var device = WoTController.get(m.urn);
      // plug = new SONY_CameraAPI(device);
      break;
    case "liveview":
      // fixme: SONY_CameraAPIの liveview メソッドを呼んで、ふがほげする
      // plug.getLiveView(function(data) { ... };
      break;
    }

  });
});


//////////////////////////////////////
// belows are just for self test
(function(global){
  var WebSocket = require('ws');
  var ws = new WebSocket("ws://localhost:28888");

  ws.on("open", function(ev){
    var req = {"method": "getDevices", "urn": "upnp:rootdevice"};
    setTimeout(function(){
      ws.send(JSON.stringify(req));
    }, 5000);
  });

  ws.on("message", function(mesg) {
    console.log(JSON.parse(mesg));
  });
}());
