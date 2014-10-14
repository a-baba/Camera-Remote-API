////////////////////////////////////////////////////////////////////////
// UI part
////////////////////////////////////////////////////////////////////////

// デバイスリストの表示（時間があったら、angularもチャレンジしたいところ）
var showDeviceList = function(list, urn) {
  var $self = $("#devices form");
  // reset redering
  $self.empty();

  // radio ボタンのhtml 生成
  var arr = [];
  for(var uuid in list) if(list.hasOwnProperty(uuid)) {
    arr.push("<label><input type='radio' name='device' value='"+uuid+"'>" + list[uuid]['SERVER'] + "</label>");
  }

  arr.push("<br>"); // add final <br>, so that button displays new line

  $self.html(arr.join("<br>"));

  // submit ボタンを表示
  $("<button>").prop("type", "submit").text("select").appendTo($self);

  // submitイベントに対し、ハンドラを規定
  $self.on("submit", function(ev) {
    // formのデフォルト動作を抑制（reload）
    ev.preventDefault();

    // 選択された uuid を取得
    var uuid = $(this).find("input:radio[name='device']:checked").val();

    // デバイスをセットする
    setDevice(urn, uuid);
  });
}


////////////////////////////////////////////////////////////////////////
// Method part
////////////////////////////////////////////////////////////////////////

// configuration
var NODE_URL = "http://localhost:28888/discovery";
var SONY_CAMERA_URN = "urn:schemas-sony-com:service:ScalarWebAPI:1";
// var SONY_CAMERA_URN = "upnp:rootdevice";

// アクティブタブに選択した urn と uuid を通知する
//
var notify2tab = function(urn, uuid) {
  console.log(urn, uuid);
  // RESTアクセス用のendpoint URIを渡す。多分
  chrome.tabs.query(
    { "active": true, "currentWindow": true },
    function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id, 
        {"urn": urn, "uuid": uuid}, 
        function(response) {
          console.log("receive mesg");
        }
      );
    }
  );
}




// デバイスリストの取得
//
var getDevices = function(urn) {
  $.post( NODE_URL + "/getDevices", {"urn": urn} , function(res) {
    console.log(JSON.parse(res));
    showDeviceList(JSON.parse(res), urn);
  });
};



// デバイスのセット
// セットが完了したら、アクティブWebページにurnとuuidを通達する
//
var setDevice = function(urn, uuid) {
  var url = [ NODE_URL, "setDevice" ].join("/");
  $.post( url, {"urn": urn, "uuid": uuid}, function(res) {
    console.log(res);
    notify2tab( urn, uuid );
  });
};


// __MAIN__
(function(){
  // SONY Camera API urn のデバイスリスト取得開始
  getDevices(SONY_CAMERA_URN);
}());
