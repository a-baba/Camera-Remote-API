"use strict";

(function(){

  navigator.presentation = navigator.presentation || {};

  navigator.presentation.requestSession = function(url) {
    document.body.style.backgroundColor=url;   // just dummy ;-)
  }

}());
