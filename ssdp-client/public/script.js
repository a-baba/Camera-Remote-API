
(function(){

  console.log("script.js")

    var presentationUrl = 'urn:schemas-sony-com:service:ScalarWebAPI:1';
    var presentationId = localStorage['presentationId'] ||
        new String((Math.random() * 10000).toFixed(0));

    var presentation = navigator.presentation;

    /*
    presentation.startSession(presentationUrl, presentationId).then(
      function(newSession) {
        setSession(newSession);
      },
      function() {
        // User cancelled, etc.
      }
    );
  */

    var session = null;

    var newSession = presentation.startSession(presentationUrl, presentationId);
    setSession(newSession);

    function setSession(theSession) {
      // NOTE: We could instead close the current session.
      if (session) return;
      session = theSession;
      localStorage['presentationId'] = session.id;

      console.log(session);

    }


    session.onstatechange = function() {
      switch (session.state) {
        case 'connected':
          session.postMessage("getLiveView");
          break;
        case 'disconnected':
          console.log('Disconnected.');
          break;
      }
    };

    session.onmessage = function(mesg) {
      console.log("on message ================================================");
      console.log(mesg.data);
      var url = window.URL.createObjectURL(mesg.data);
      console.log(url);
      $("#liveview").attr("src", url);
      // todo canvasでdrawImageする
      // ref: http://html5.jp/canvas/how6.html
    };

})();