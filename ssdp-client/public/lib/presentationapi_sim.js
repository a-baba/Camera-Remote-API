/**
 * presentation api sim
 *
 */

if(!navigator.presentation) {
  navigator.presentation = null;
}

(function(global){
  if(navigator.presentation) return;

  ///////////////////////////////////////////
  // definitions of Presentaion Session
  var PresentationSession = function(id, state){
    if(!id) id = null /* ランダム的な何か */ ;
    this.id = id;
    this.state = state;  /* 'connected' or 'disconnected' */

    this.setHandler_();
  }

  // post message to selected device
  PresentationSession.prototype.postMessage = function(message) {
  }

  // close session with selected device
  PresentationSession.prototype.close = function(message) {
  }

  /* private */

  // setHandler_
  PresentationSession.prototype.setHandler_ = function(){
    if( /* onmessage */) {
      this.onmessage(message);
    };

    if( /* onstatechange */) {
      this.onstatechange();
    }
  }



  ///////////////////////////////////////////
  // definitions of NavigatorPresentation
  var presentation_ = navigator.presentation;

  presentation_ = {
  }

  presentation_.session = null;

  presentation_.onavailablechange = function(){
    // just an interface
  }

  // start new session
  // this interface must display picker for devices
  // this must support promise
  presentation_.startSession = function(){
    // return PresentationSession object as presentation.session
    // for promise interface
    this.session = new PresentationSession(id, 'connected');

    // ......................
  }

  // join existing session
  // this interface does not display picker for devices
  // this must support promise
  presentation_.joinSession = function(){
    // return PresentationSession object as presentation.session
    // for promise interface
    this.session = new PresentationSession(id, 'connected');
    
    
    // ......................
  }
}(window));
