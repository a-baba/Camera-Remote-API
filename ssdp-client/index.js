var SONY_CameraAPI = require('./lib/SONY_CameraAPI')
  , WoTController = require('./lib/WoTController')
  , WebSocketServer = require('ws').Server
  , restify = require('restify')
  , rest_server = restify.createServer()
  , wss = new WebSocketServer({server: rest_server})

WoTController.init();

var MAX_SIZE = 100000;
var COMMON_HEADER_SIZE = 8;
var PAYLOAD_HEADER_SIZE = 128;


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
      plug.init(function(){

        var img_ab;
        var img_dv;
        var img_off = 0;
        var img_data_size = 0;

        plug.getLiveView(function(data) {

          var common_header_flag = false;
          var payload_header_flag = false;
          var ab = new ArrayBuffer(data.length);
          var dv = new DataView(ab);
          for(var i=0; i<data.length; i++){
            dv.setUint8(i, data[i]);
          }

          console.log("begin chunk ======================================")

          console.log("chunk size : " + data.length);

          if(data.length >= 8){
          
            var start_byte = dv.getUint8(0);
            var payload_type = dv.getUint8(1); 
            var sequence_number = dv.getUint16(2);
            var time_stamp = dv.getUint32(4);

            if(start_byte.toString(16) == "ff" &&  payload_type.toString(16) == "1"){
              console.log("This is Common Header! ----------------------------");

              console.log("start_byte: " + start_byte.toString(16));
              console.log("payload_type: " + payload_type.toString(16));
              console.log("sequence_number: " + sequence_number);
              console.log("time_stamp: " + time_stamp);

              common_header_flag = true;

            }
          }

          if(data.length >= 136){

            var start_code1 = dv.getUint8(8);
            var start_code2 = dv.getUint8(9);
            var start_code3 = dv.getUint8(10);
            var start_code4 = dv.getUint8(11);

            var jpeg_data_size1 = dv.getUint8(12);
            var jpeg_data_size2 = dv.getUint8(13);
            var jpeg_data_size3 = dv.getUint8(14);

            var padding_size = dv.getUint8(15);
            var reserved1 = dv.getUint32(16);
            var flag = dv.getUint8(20);
            var reserved2 = dv.getUint32(16);

            reserved2 = [];
            for (var i=0, off=21; i<115; i++) {
              reserved2[i] = dv.getUint8(i + off);
            }

            if(start_code1.toString(16) == "24" &&  start_code2.toString(16) == "35" &&  start_code3.toString(16) == "68" &&  start_code4.toString(16) == "79"){
              console.log("This is Payload Header! ----------------------------");

              console.log("start_code: " + start_code1.toString(16) + " " + start_code2.toString(16) + " " + start_code3.toString(16) + " " + start_code4.toString(16));

              var jpeg_data_size = 0;
              if(jpeg_data_size1 > 0) jpeg_data_size += jpeg_data_size1 * 256 * 256;
              if(jpeg_data_size2 > 0) jpeg_data_size += jpeg_data_size2 * 256;
              if(jpeg_data_size3 > 0) jpeg_data_size += jpeg_data_size3;
              console.log("jpeg_data_size: " + jpeg_data_size);
              
              console.log("padding_size: " + padding_size);
              console.log("reserved1: " + reserved1.toString(16));
              console.log("flag: " + flag.toString(16));
              console.log("reserved2: " + reserved2.toString(16));

              img_data_size = jpeg_data_size;

              img_ab = new ArrayBuffer(jpeg_data_size);
              img_dv = new DataView(img_ab);

              payload_header_flag = true;

            }
          }

          //Payload Headerがあったら、オフセットを0にする
          if(payload_header_flag) img_off = 0;

          //パケットにヘッダが含まれていたら、JPEGデータの開始位置をヘッダの直後に合わせる
          var begin = 0;
          if(common_header_flag) begin += COMMON_HEADER_SIZE;
          if(payload_header_flag) begin += PAYLOAD_HEADER_SIZE;

          // JPEGデータをDataViewに入れる
          for (var i=begin; i<data.length; i++) {
            img_dv[i + img_off] = dv.getUint8(i);
          }

          //オフセットを調整
          img_off += data.length - begin;
          var datasize = data.length - begin;
          console.log("datasize: " + datasize);
          console.log("offset: " + img_off);

          //JPEGデータが集まったらWSで送る
          if(img_data_size <= img_off){
            console.log("send array buffer")
            ws.send(img_ab);
          }
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
  

  /*
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
    console.log("on message ==============================")
    console.log(mesg);

  });
*/
  

}());
