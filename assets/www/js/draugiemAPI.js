goog.provide('bjuceklis.draugiemAPI');

bjuceklis.draugiemAPI = function() {
  
  goog.events.listen(logo, ['mousedown','touchstart'], function(e) {
    e.stopPropagation();
    console.log('logo click');
    
    var data = {};
      data.key        = '0b2a643b10f3b5dcaca41dc56993a56a';
      data.redirect   = window.location;
      data.domain     = 'http://www.draugiem.lv/applications/authorize/?';
      data.app        = 2284;
      
      var md5 = new goog.crypt.Md5();
      md5.reset();
      md5.update(data.key + data.redirect);
      data.hash = goog.crypt.byteArrayToHex(md5.digest());
      
    var link = data.domain +  "app=" + data.app + "&hash=" + data.hash + "&redirect=" + data.redirect + "&popup=1";
    
    window.open(link,'Dr_2284' ,'width=400, height=400, left='+(screen.width?(screen.width-400)/2:0)+', top='+(screen.height?(screen.height-400)/2:0)+',scrollbars=no');    
  });


  //getData('http://game.atrodivardu.lv/index.php/loader/get_main?session=3c093043e8afe8bad207d675c6729656&json=1');
  //getData('http://localhost/vardi/index.php/loader/get_main?session=04f5ebcf9d8194427052361090fbe16c&json=1');
  //getData('http://localhost/vardi/index.php/game?session=04f5ebcf9d8194427052361090fbe16c&mobile=1');

}

function getData(dataUrl) {
  console.log('Sending simple request for ['+ dataUrl + ']');
 
  var xhr = new goog.net.XhrIo();
  
  goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e) {
      var xhr = e.target;
      var obj = xhr.getResponseJson();
      console.log('Received Json data object with title property of "'); 
      console.log(obj);
  });  

}