/**
 * presentation api sim
 *
 */

if(!navigator.presentation) {
  navigator.presentation = null;
}

(function(global){
  if(navigator.presentation) return;

  var presentation_ = navigator.presentation;

  presentation_ = function(){
  }

  // start new session
  // this interface must display picker for devices
  // this must support promise
  presentation_.prototype.startSession = function(){
  }

  // join existing session
  // this interface does not display picker for devices
  // this must support promise
  presentation_.prototype.joinSession = function(){
  }
}(window));
