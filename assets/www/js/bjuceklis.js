//set main namespace
goog.provide('bjuceklis');

//get requirements
goog.require('console');
goog.require('goog.json');

goog.require('lime');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');

goog.require('lime.audio.Audio');

//goog.require('lime.CanvasContext');

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



bjuceklis.start = function(){
  
  var saveData = window.localStorage.getItem("doolitls");
  if (!saveData) {
    for (var i in doolitle.MAPS) doolitle.SAVE_DATA.levels[i] = 0;
    doolitle.saveGame();
  } else {
    doolitle.MAINDATA = true;
  }  

  //lime.Director(document.getElementById("stage"),800,600);
	doolitle.director = new lime.Director(document.body,doolitle.WIDTH,doolitle.HEIGHT).setDisplayFPS(false);
  doolitle.director.makeMobileWebAppCapable();
  
  doolitle.beginGame();
  
  
}


