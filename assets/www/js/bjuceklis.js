//set main namespace
goog.provide('bjuceklis');

//get requirements
goog.require('console');
goog.require('goog.json');

goog.require('goog.crypt.Md5');
goog.require('goog.crypt');


goog.require('lime');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');

goog.require('lime.audio.Audio');

goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.Polygon');
goog.require('lime.Button');

goog.require('lime.animation.Loop');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.KeyframeAnimation');

goog.require('lime.fill.Frame');
goog.require('lime.fill.LinearGradient');

goog.require('lime.transitions.MoveInRight');
goog.require('lime.transitions.MoveInLeft');

goog.require('bjuceklis.scLoad');
goog.require('bjuceklis.scGame');
goog.require('bjuceklis.scVictory');

goog.require('bjuceklis.spWord');

goog.require('bjuceklis.spLogo');
goog.require('bjuceklis.spBurts');
goog.require('bjuceklis.spTimer');


bjuceklis.WIDTH  = 1024;
bjuceklis.HEIGHT = 500;

bjuceklis.SESSION = '34f404405adbde524d9ccb7bdc273421';

bjuceklis.Event = {
  LOADED:"bj_loaded",
  END_FLY:"end_flay",
  XHR_LOADED:"xhr_loaded",
  MOUSE_DOWN:['mousedown','touchstart']
}

bjuceklis.WORD = "\u0101\u017ekabmaris";
bjuceklis.HASH = "";
bjuceklis.TIME = 0;

bjuceklis.start = function(){
  //bjuceklis.HASH = md5(bjuceklis.WORD);
  
  //console.log(bjuceklis.HASH);

  //lime.Director(document.getElementById("stage"),800,600);
	bjuceklis.director = new lime.Director(document.body,bjuceklis.WIDTH,bjuceklis.HEIGHT).setDisplayFPS(false);
  bjuceklis.director.makeMobileWebAppCapable();
  
  bjuceklis.sceneLoad = new bjuceklis.scLoad();
  goog.events.listen(bjuceklis.director,bjuceklis.Event.LOADED,this.gameLoaded);
  
  //goog.events.listen(bjuceklis.director,"scene_loaded",bjuceklis.gameLoaded);
	bjuceklis.director.replaceScene(bjuceklis.sceneLoad,lime.transitions.SlideInUp);
  
  bjuceklis.sceneGame = new bjuceklis.scGame();
  bjuceklis.sceneVictory = new bjuceklis.scVictory();
}

bjuceklis.gameLoaded = function(e) {
  console.log("Load scene loaded");
  goog.events.unlisten(bjuceklis.director,"scene_loaded",bjuceklis.gameLoaded);
  
  bjuceklis.gameBegin();
}


bjuceklis.gameBegin = function() {
  bjuceklis.sceneGame.clearWord();
  goog.events.listen(bjuceklis.director,"scene_loaded",bjuceklis.scGame.sceneLoaded, false, bjuceklis.sceneGame);
	bjuceklis.director.replaceScene(bjuceklis.sceneGame,lime.transitions.SlideInRight);
}

bjuceklis.gameVictory = function(word) {
  
  bjuceklis.sceneGame.clearWord();
  bjuceklis.sceneVictory.setVictory(0, word);
	bjuceklis.director.replaceScene(bjuceklis.sceneVictory,lime.transitions.SlideInRight);
  
  word = utf8_encode(word);
  goog.events.listen(bjuceklis.director, bjuceklis.Event.XHR_LOADED, bjuceklis.checkWord);   
  getLoader('check_word','word=' + word + '&brick=0&blob=""');
}

bjuceklis.checkWord = function(e) {
  goog.events.unlisten(bjuceklis.director, bjuceklis.Event.XHR_LOADED, bjuceklis.checkWord);   
  console.log(e);
  bjuceklis.sceneVictory.setNote(e.data.note);
}

bjuceklis.gameTimeout = function() {
  bjuceklis.sceneGame.clearWord();
  bjuceklis.sceneVictory.setVictory(1,"");
	bjuceklis.director.replaceScene(bjuceklis.sceneVictory,lime.transitions.SlideInRight);
  
  goog.events.listen(bjuceklis.director, bjuceklis.Event.XHR_LOADED, bjuceklis.timeOut);   
  getLoader('time_out','');
  
}
bjuceklis.timeOut = function(e) {
  goog.events.unlisten(bjuceklis.director, bjuceklis.Event.XHR_LOADED, bjuceklis.timeOut);   
  console.log(e.data);
  bjuceklis.sceneVictory.setWord(e.data.word);
  bjuceklis.sceneVictory.setNote(e.data.note);
}


function md5(words) {
  var md5 = new goog.crypt.Md5();
  md5.reset();
  md5.update(goog.crypt.stringToUtf8ByteArray(words));
  return goog.crypt.byteArrayToHex(md5.digest());
  
}

function getData(dataUrl) {
  //console.log('Sending simple request for ['+ dataUrl + ']');
 
  var xhr = new goog.net.XhrIo();
    
  goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e) {
      var xhr = e.target;
      var obj = xhr.getResponseJson();
      //console.log('Received Json data object with title property of "'); 
      //console.log(obj);
      bjuceklis.director.dispatchEvent({type: bjuceklis.Event.XHR_LOADED, data:obj}); 
  });  
  
  xhr.send(dataUrl);

}

function getLoader(action, params) {
  if (!params) params = ''; else params = '&' + params;
  getData('http://game.atrodivardu.lv/index.php/loader/' + action + '?session=' + bjuceklis.SESSION + params + '&json=1');        
}

function utf8_encode (argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}