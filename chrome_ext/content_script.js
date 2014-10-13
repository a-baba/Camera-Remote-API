console.log('it works!!  ,,');

setTimeout(function(){
  navigator.presentation.requestSession('yellow');
}, 1000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got message'); console.dir(request);
  navigator.presentation.requestSession('red');
});
