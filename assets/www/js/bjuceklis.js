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


bjuceklis.Event = {
  LOADED:"bj_loaded",
  END_FLY:"end_flay"
}

bjuceklis.WORD = "\u0101\u017ekabmaris";

bjuceklis.start = function(){
  bjuceklis.HASH = md5(bjuceklis.WORD);
  
  console.log(bjuceklis.HASH);

  //lime.Director(document.getElementById("stage"),800,600);
	bjuceklis.director = new lime.Director(document.body,bjuceklis.WIDTH,bjuceklis.HEIGHT).setDisplayFPS(true);
  bjuceklis.director.makeMobileWebAppCapable();
  
  bjuceklis.sceneLoad = new bjuceklis.scLoad();
  //goog.events.listen(bjuceklis.sceneLoad,bjuceklis.Event.LOADED,this.gameLoaded);
  
  goog.events.listen(bjuceklis.director,"scene_loaded",bjuceklis.gameLoaded);
	bjuceklis.director.replaceScene(bjuceklis.sceneLoad,lime.transitions.SlideInUp);
  
  bjuceklis.sceneGame = new bjuceklis.scGame();
  bjuceklis.sceneVictory = new bjuceklis.scVictory();
  //bjuceklis.beginGame();
  
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

bjuceklis.gameVictory = function() {
  bjuceklis.sceneVictory.setVictory(0);
	bjuceklis.director.replaceScene(bjuceklis.sceneVictory,lime.transitions.SlideInRight);
}

bjuceklis.gameTimeout = function() {
  bjuceklis.sceneVictory.setVictory(1);
	bjuceklis.director.replaceScene(bjuceklis.sceneVictory,lime.transitions.SlideInRight);
}

function md5(words) {
  var md5 = new goog.crypt.Md5();
  md5.reset();
  md5.update(words);
  return goog.crypt.byteArrayToHex(md5.digest());
  
}