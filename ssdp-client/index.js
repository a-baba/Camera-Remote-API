var SONY_CameraAPI = require('./lib/SONY_CameraAPI')
  , WoTController = require('./lib/WoTController')
  , WebSocketServer = require('ws').Server
  , restify = require('restify')
  , rest_server = restify.createServer()
  , wss = new WebSocketServer({server: rest_server})

WoTController.init();


///////////////////////////////////////////
// REST interfaces
// (device discovery features)

// getDevices
rest_server.get('/getDevices/:urn', function(req, res, next) {
  res.send(JSON.stringify(WoTController.getDevices(req.params.urn)));
  next();
});

// setDevice
rest_server.get('/setDevice/:urn/:uuid', function(req, res, next) {
  // WoTController.setDevice(m.urn, m.uuid);
  // var device = WoTController.get(m.urn);
  //
  // plug = new SONY_CameraAPI(device);
  res.send("under development");
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

    console.log("wss on message")
    console.log(m);

    // 注記）デバイス選択パートは、前半のREST Interface
    // にした（request と responseの状態を保持するのが
    // WebSocketだとめんどいので）ので、ここにあるのは
    // liveviewのみとした

    switch(m.method){
    case "liveview":
      var urn = "urn:schemas-sony-com:service:ScalarWebAPI:1";

      WoTController.setDevice(urn, "uuid:00000000-0005-0010-8000-fcc2de538943::urn:schemas-sony-com:service:ScalarWebAPI:1"); 

      var device = WoTController.get(urn);
      console.log(device);
      
      var plug = new SONY_CameraAPI(device);
      console.log(plug);
      console.log("liveview");
      plug.init(function(){
        plug.getLiveView(function(data) {

          var ab = new ArrayBuffer(data.length);

          var dv = new DataView(ab);
          for(var i=0; i<data.length; i++){
            dv.setUint8(i, data[i]);
          }
          console.log("begin dataview-----------");
          console.log(dv);
          console.log("end dataview-----------");
          
          //console.log(dv);
          var start_byte = dv.getUint8(0);
          console.log("start_byte: " + start_byte);
          var payload_type = dv.getUint8(1); 
          console.log("payload_type: " + payload_type);
          var sequence_number = dv.getUint16(2);
          console.log("sequence_number: " + sequence_number);
          var time_stamp = dv.getUint32(4);
          console.log("time_stamp: " + time_stamp);

          var start_code = dv.getUint32(8);
          console.log("start_code: " + start_code);
          var jpeg_data_size = dv.getUint8(12);
          console.log("jpeg_data_size: " + jpeg_data_size);
          var padding_size = dv.getUint8(15);
          console.log("padding_size: " + padding_size);
          var reserved1 = dv.getUint32(16);
          console.log("reserved1: " + reserved1);
          var flag = dv.getUint8(20);
          console.log("flag: " + flag);
          var reserved2 = dv.getUint32(21);
          console.log("reserved2: " + reserved2);

          //for (var i=0, off=5; i<vectors.length; i++, off+=4) {
            //vectors[i] = dv.getFloat32(off);
          //}

          ws.send(data);
        });
      });

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
  var http = require('http');

  setTimeout(function() {
    http.get('http://localhost:28888/getDevices/upnp:rootdevice', function(res) {

      res.setEncoding('utf8');
      
      var data = "";
      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function() {
        console.log(data);
      });
    });
  }, 5000);
  

  
  // live view test
  var WebSocket = require('ws');
  var ws = new WebSocket("ws://localhost:28888");

  ws.on("open", function(ev){
    var req = {"method": "liveview"};
    setTimeout(function(){
      ws.send(JSON.stringify(req));
      console.log("ws://localhost:28888 send " + JSON.stringify(req))
    }, 5000);
  });

  ws.on("message", function(mesg) {
    //console.log("on message ==============================")
    //console.log(mesg);
  });



}());
