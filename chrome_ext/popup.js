
    var ws = new WebSocket("ws://localhost:28888");

    ws.onopen =  function(ev){
      console.log('open');
    }

    ws.onclose =  function(ev){
      console.log("close", ev);
    }
    ws.onerror =  function(ev){
      console.log("error", ev);
    }

    document.querySelector("button").addEventListener("click", function(ev){
      var req = {"method": "getDevices", "urn": "upnp:rootdevice"};
      ws.send(JSON.stringify(req));
    }, false);

    ws.addEventListener("message", function(ev) {
      console.log(JSON.parse(mesg));
    }, false);



