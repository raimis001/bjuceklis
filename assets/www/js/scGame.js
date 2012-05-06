goog.provide('bjuceklis.scGame');



bjuceklis.scGame = function() {
  lime.Scene.call(this);
    
  this.appendChild(new bjuceklis.spLogo()); 

  this.timer = new bjuceklis.spTimer()
    
  this.appendChild(this.timer);
}

goog.inherits(bjuceklis.scGame, lime.Scene);


bjuceklis.scGame.sceneLoaded = function(e) {
  console.log("Load scene");
  goog.events.unlisten(bjuceklis.director,"scene_loaded",bjuceklis.scGame.sceneLoaded, false, bjuceklis.sceneGame);

  this.word = new bjuceklis.spWord();
  this.appendChild(this.word);
  
  this.timer.start(10);
  
}

bjuceklis.scGame.prototype.clearWord = function() {
  if (this.word) {
    this.removeChild(this.word);
    this.word = null;
  }
  this.timer.stop();
  console.log("Clean up word");
}

