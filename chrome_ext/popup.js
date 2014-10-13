var ws = new WebSocket("ws://localhost:28888");


/////////////////////////////////////////
// WebSocketのイベントハンドラー
ws.onopen =  function(ev){
  console.log('open', ev);
  getDevices("upnp:rootdevice"); // just test, ホントは SONY...
}

ws.onclose =  function(ev){
  console.log("close", ev);
}
ws.onerror =  function(ev){
  console.log("error", ev);
}

ws.onmessage = function(ev) {
  // [fixme] 受信データに応じて処理を変える
  //
  // getDevices ... list変更処理
  // setDevice ... アクティブタブに、その旨 postMessage
  console.log(JSON.parse(ev.data));
  document.getElementById('test').innerHTML = JSON.stringify(JSON.parse(ev.data), null, "  ").replace("\n", "<br>");
};


////////////////////////////////////////////
// デバイスリスト選択時のハンドラー
// document.querySelector("li").addEventListener("click", function(ev){
  // var uuid = ...;
  // setDevice(uuid);
// }, false);


/////////////////////////////////////////////
// デバイスリストの取得
var getDevices = function(urn) {
  $.get("http://localhost:28888/getDevices/" + urn , function(res) {
    console.log(res);
  });
};


/////////////////////////////////////////////
// デバイスのセット
var setDevice = function(uuid) {
  // var req = {"method": "getDevices", "urn" : "urn:schemas-sony-com:service:ScalarWebAPI:1", "uuid": uuid};
  // ws.send(JSON.stringify(req));
};


/////////////////////////////////////////////
// アクティブタブに通知する
var notify = function(endpoints) {
  // RESTアクセス用のendpoint URIを渡す。多分
}
