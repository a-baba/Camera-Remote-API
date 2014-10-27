"use strict";

(function(){

  navigator.presentation = navigator.presentation || {};

  navigator.presentation.startSession = function(url, id) {
  	var session = new Session();
  	return session;
  }

}());
