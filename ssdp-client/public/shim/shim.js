
(function(){

	var port = 28888;
	var ws = new WebSocket("ws://localhost:" + port);
	var session = new Session(ws);
	console.log(ws);

	ws.onopen = function(ev){
		var req = {
			"message": "requestSession", 
			"urn": 'urn:schemas-sony-com:service:ScalarWebAPI:1',
			"uuid":  'uuid:00000000-0005-0010-8000-fcc2de538943::urn:schemas-sony-com:service:ScalarWebAPI:1' 
		};
		ws.send(JSON.stringify(req));
		console.log("ws://localhost:" + port + " send " + JSON.stringify(req))
	};


	ws.onmessage = function(mesg) {
		console.log("shim received message ================================================");
		console.log(mesg);
		console.log(mesg.message);

		if(mesg.message = "connected"){
			session.state = "connected";
			session.onstatechange();
		}
		else if(mesg.message = "disconnected"){
			session.state = "disconnected";
			session.onstatechange();
		}else{
			session.onmessage();
		}
	};


})();



