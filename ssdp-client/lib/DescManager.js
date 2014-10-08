var http = require('http');

var DescManager = {};



DescManager.get = function(url, nodes, callback){
  if(!nodes) throw "nodes should be specified"
  http.get(url, function(res, e) {
    if(!e) {
      var body = "";
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function(){
        var res = {};
        nodes.forEach(function(node) {
          var re = new RegExp("<" + node + ">(.+?)</" + node + ">");
          var f = body.match(re);
          res[node] = f ? f[1]: null;
        });


        if(typeof(callback) !== "function") {
          console.log(res);
          console.log(body);
        } else {
          callback(res);
        }
      });
    } else {
      throw e.message;
    }
  });
}


module.exports = DescManager;

// test code
//
if(!__filename.match('index.js')) {
  DescManager.get(
    'http://192.168.40.10:64321/scalarwebapi_dd.xml', 
    [
      "av:X_ScalarWebAPI_ActionList_URL",
      "av:X_ScalarWebAPI_LiveView_URL"
    ]
  );
}
