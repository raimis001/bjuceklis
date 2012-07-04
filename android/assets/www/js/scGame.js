goog.provide('bjuceklis.scGame');



bjuceklis.scGame = function() {
  lime.Scene.call(this);
    
  this.appendChild(new bjuceklis.spLogo()); 

  this.timer = new bjuceklis.spTimer()
  this.appendChild(this.timer);
  
  this.bt_game = new lime.Sprite()
    .setFill(new lime.fill.Image('media/btBegin.png'))
    .setAnchorPoint(0,0)
    .setPosition(180,300)
  ;
  goog.events.listen(this.bt_game, bjuceklis.Event.MOUSE_DOWN, function(e) {
      this.getWord();
      this.bt_game.setHidden(true);
  }, false, this);   
  
  this.appendChild(this.bt_game);
}

goog.inherits(bjuceklis.scGame, lime.Scene);


bjuceklis.scGame.sceneLoaded = function(e) {
  console.log("Load scene");
  goog.events.unlisten(bjuceklis.director,"scene_loaded",bjuceklis.scGame.sceneLoaded, false, bjuceklis.sceneGame);
}

bjuceklis.scGame.prototype.getWord = function() {
  this.clearWord();
  goog.events.listen(bjuceklis.director, bjuceklis.Event.XHR_LOADED, this.loadWord, false, this);   
  getLoader('get_word','language=6');
}
bjuceklis.scGame.prototype.loadWord = function(e) {
  goog.events.unlisten(bjuceklis.director, bjuceklis.Event.XHR_LOADED, this.loadWord, false, this);   
  console.log(e);
  var data = e.data;
  bjuceklis.WORD = data.word;
  bjuceklis.HASH = data.hash;
  bjuceklis.TIME = data.time;

  this.word = new bjuceklis.spWord();
  this.appendChild(this.word);
  this.timer.start(bjuceklis.TIME);
}


bjuceklis.scGame.prototype.clearWord = function() {
  if (this.word) {
    this.removeChild(this.word);
    this.word = null;
  }
  this.timer.stop();
  this.bt_game.setHidden(false);
  
  console.log("Clean up word");
}

