goog.provide('bjuceklis.scLoad');

goog.require('goog.net.XhrIo');
goog.require('goog.crypt.Md5');
goog.require('goog.crypt');

bjuceklis.scLoad = function() {
  lime.Scene.call(this);
    
  this.logo = new bjuceklis.spLogo();
  this.appendChild(this.logo);
  
  var mid = bjuceklis.WIDTH * 0.5;
  
  this.note = new lime.Label()
    //.setAnchorPoint(0,0)
    .setText("Lai turpin\u0101tu Tev nepiecie\u0161ams interneta piesl\u0113gums!")
    .setPosition(mid,220)
    .setSize(500,200)
    .setFontSize(30)
    //.setFontWeight("bold")
    .setAlign("center")
  this.appendChild(this.note);
  
  this.bt_game = new lime.Sprite()
    .setFill(new lime.fill.Image('media/btBegin.png'))
    //.setAnchorPoint(0,0)
    .setPosition(mid,250)
  ;
  this.appendChild(this.bt_game);
  
  this.status_url = 0;
  goog.events.listen(bjuceklis.director, bjuceklis.Event.XHR_LOADED, this.loadData, false, this);  
  goog.events.listen(this.bt_game, bjuceklis.Event.MOUSE_DOWN, function() {
    this.bt_game.setHidden(true);
    this.note.setText('L\u016bdzu uzgaidi...');
    getData('http://game.atrodivardu.lv/index.php/game?session=' + bjuceklis.SESSION +'&mobile=1');
    
  }, false, this);  
}
goog.inherits(bjuceklis.scLoad, lime.Scene);

bjuceklis.scLoad.prototype.loadData = function(e) {
  console.log(e);
  if (this.status_url == 0) {
    this.status_url = 1;
    getData('http://game.atrodivardu.lv/index.php/loader/get_main?session=' + bjuceklis.SESSION +'&json=1');        
  } else if (this.status_url == 1) {
    goog.events.unlisten(bjuceklis.director, bjuceklis.Event.XHR_LOADED, this.loadData, false, this);  
    bjuceklis.director.dispatchEvent({type: bjuceklis.Event.LOADED});
  }
}