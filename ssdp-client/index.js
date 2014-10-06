var Client = require('node-ssdp').Client
  , client = new Client();

var CAMERAREMOTEAPI_ST = 'urn:schemas-sony-com:service:ScalarWebAPI:1';

client.on('response', function(headers, statusCode, rinfo) {
  console.log('====================================');
  console.log('Got a response to m-search');
  console.dir(headers);
  console.dir(statusCode);
  console.dir(rinfo);
  console.log('====================================');
});

client.search(CAMERAREMOTEAPI_ST);

client.search('ssdp:all');
