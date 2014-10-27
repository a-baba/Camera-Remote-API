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
		console.log("onstatechange : " + this.state);
	};
	

	Session.prototype.onmessage = function(mesg){
		console.log("onmessage : " + mesg);
	}; 

	Session.prototype.postMessage = function(mesg){

		console.log("postMessage : ", mesg);

		var data = {};
		data.message = mesg;

    	ws.send(JSON.stringify(data));

	};


})();