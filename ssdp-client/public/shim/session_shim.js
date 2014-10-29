/**
 * session_shim.js
 *
 * @author : Saki Homma
 *
 */


var Session = {};

(function(){

	var ws;

	Session = function(){

		var port = 28888;
		ws = new WebSocket("ws://localhost:" + port);
		var self = this;
		this.state;

		ws.onopen = function(ev){
			console.log(self);
			console.log("connected!");
			self.state = "connected";
			self.onstatechange();
		};

		ws.onmessage = function(mesg) {

			console.log("shim received message ================================================");
			console.log(mesg);

			self.onmessage(mesg);
		};

		ws.onclose = function(mesg){
			console.log("socket close!!")
			ws.close();
		}
	};

	
	Session.prototype.onstatechange = function(){

		var self = this;
		console.log("onstatechange : " + self.state);

		  switch (self.state) {
          case 'connected':
            self.postMessage("getLiveView");
            break;
          case 'disconnected':
            console.log('Disconnected.');
            break;
        }
	};
	
	

	Session.prototype.onmessage = function(mesg){
		console.log("onmessage : " + mesg);

		
        var url = window.URL.createObjectURL(mesg.data);
        $("#liveview").attr("src", url);
	}; 

	Session.prototype.postMessage = function(mesg){

		console.log("postMessage : ", mesg);

		var data = {};
		data.message = mesg;

    	ws.send(JSON.stringify(data));

	};

	Session.prototype.close = function(){

		console.log("session.close()");

		var data = {};
		data.message = "CloseSession";

    	ws.send(JSON.stringify(data));

	};


})();