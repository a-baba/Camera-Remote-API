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
  $.getJSON("http://localhost:28888/getDevices/" + urn , function(res) {
    console.log(JSON.parse(res));
    showDeviceList(JSON.parse(res), urn);
  });
};

// デバイスリストの表示（時間があったら、angularもチャレンジしたいところ）
var showDeviceList = function(list, urn) {
  $self = $("#devices form");
  // reset redering
  $self.empty();

  // listが"upnp:rootdevice"の時だけ特殊なので、それを対応
  var list_ = urn === "upnp:rootdevice"
    ? list["upnp:rootdevice"]
    : list;
  
  // radio ボタンのhtml 生成
  var arr = [];
  for(var uuid in list_) if(list_.hasOwnProperty(uuid)) {
    arr.push("<input type='radio' name='device' value='"+uuid+"'>" + list_[uuid]['SERVER'] + "<br>");
  }
  $self.html(arr.join("<br>"));

  // submit ボタンを表示
  $("<button>").prop("type", "submit").text("select").appendTo($self);

  // submitイベントに対し、ハンドラを規定
  $self.on("submit", function(ev) {
    // 選択された uuid を取得
    var uuid = $(this).find("input:radio[name='device']:checked").val();
    console.log(uuid);

    // fixme: content scriptに対し、選択されたurn, uuidを伝える
    // chrome.tabs.ほげほげ 的な何か

    // formのデフォルト動作を抑制（reload）
    return false;
  });
}




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
