var SONY_CameraAPI = require('./lib/SONY_CameraAPI')
  , WoTController = require('./lib/WoTController')
  , WebSocketServer = require('ws').Server
  , restify = require('restify')
  , rest_server = restify.createServer()
  , wss = new WebSocketServer({server: rest_server})

rest_server.use(restify.bodyParser());

WoTController.init();


///////////////////////////////////////////
// REST interfaces
// (device discovery features)

// getDevices
rest_server.post('/discovery/getDevices', function(req, res, next) {
  var urn = req.params.urn;

  var result = JSON.stringify(WoTController.getDevices(urn));

  res.send(result);
  next();
});

// setDevice
rest_server.post('/discovery/setDevice', function(req, res, next) {
  var urn = req.params.urn
    , uuid = req.params.uuid

  WoTController.setDevice(urn, uuid);
  var device = WoTController.getSelected(urn);

  //plug = new SONY_CameraAPI(device);
  res.send(JSON.stringify(device));
  next();
});

///////////////////////////////////////////
// serve static page with restify
//
// [note] this code must be last for restify routings.
rest_server.get(/.*/, restify.serveStatic({
  directory: __dirname + '/public',
  default: 'index.html'
}));




// WebSocket Interfaces
// (Controel AS 100V especially, liveview)

var plug;

wss.on('connection', function(ws) {
  ws.on('message', function(mesg){
    var m = JSON.parse(mesg);

    console.log(m);

    // 注記）デバイス選択パートは、前半のREST Interface
    // にした（request と responseの状態を保持するのが
    // WebSocketだとめんどいので）ので、ここにあるのは
    // liveviewのみとした
    switch(m.method){
    case "liveview":
      // fixme: SONY_CameraAPIの liveview メソッドを呼んで、ふがほげする
      // plug.getLiveView(function(data) { ... };
      break;
    default:
      break;
    }

  });
});

rest_server.listen(28888, function() {
  console.log('%s listening at %s', rest_server.name, rest_server.url);
});


//////////////////////////////////////
// belows are just for self test
(function(global){
  // REST test
  // live view test
  var WebSocket = require('ws');
  var ws = new WebSocket("ws://localhost:28888");

  ws.on("open", function(ev){
    // var req = {"method": "liveview"};
    // setTimeout(function(){
    //   ws.send(JSON.stringify(req));
    // }, 5000);
  });

  ws.on("message", function(mesg) {
    console.log(JSON.parse(mesg));
  });
}());
