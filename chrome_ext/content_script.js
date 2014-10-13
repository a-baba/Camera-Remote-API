chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got message'); console.dir(request);
  // div#simifの data-urn と data-uuid属性を変更することで、
  // フロントHTMLにデータを伝える
  var ifnode = document.getElementById('simif');
  ifnode.setAttribute("data-urn", request.urn);
  ifnode.setAttribute("data-uuid", request.uuid);

  // for debugging
  ifnode.innerHTML = request.urn + ", " + request.uuid;
});
