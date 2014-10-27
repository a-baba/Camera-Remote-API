/**
 * session_shim.js
 *
 * @author : Saki Homma
 *
 */


var Session = {};

(function(){

	var ws;

	Session = function(wsocket){

		var self = this;
		this.state;

		ws = wsocket;
		console.log(ws);

		ws.onopen = function(ev){
		};

		ws.onmessage = function(mesg) {
		};
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