goog.provide('bjuceklis.spTimer');

  goog.require('goog.Timer');

bjuceklis.spTimer = function() {
    lime.Sprite.call(this);
    
  this.maxtime = 0;
  this.timer   = 0;
    
  this
    .setFill(new lime.fill.Image('media/timer.png'))
    .setAnchorPoint(0,0)
  ;
    
  
  this.label = new lime.Label()
    .setAnchorPoint(0,0)
    .setText(formatTime(0))
    .setSize(80,60)
    .setPosition(1,25)
    .setFontSize(30)
    .setFontWeight("bold")
    .setAlign("center")
    //.setHidden(true);
  
  this.appendChild(this.label);
  //console.log(letter);
   
   this.setPosition(170,10);
}
goog.inherits(bjuceklis.spTimer, lime.Sprite);

function formatTime(time) {
  var min = Math.floor(time / 60);
  var sec = time - (min * 60);
  
  if (sec < 10) sec = "0" + sec;
  if (min < 10) min = "0" + min;
  
  return min + ":" + sec;
}

bjuceklis.spTimer.prototype.tick = function() {
  this.timer -= 1;
  this.label.setText(formatTime(this.timer));
}

bjuceklis.spTimer.prototype.start = function(maxTime) {
  
  this.maxtime = maxTime;
  this.timer   = maxTime;
  
  this.clock = new goog.Timer(1000);

  goog.events.listen(this.clock, 'tick', function(e) {
    this.tick();
    
    if (this.timer <= 0) {
      this.stop();
      bjuceklis.gameTimeout();
    }
    
  }, false, this);
  
  this.clock.start();
}

bjuceklis.spTimer.prototype.stop = function() {
  
  if (this.clock) {
    this.clock.stop();
    goog.events.removeAll(this.clock);
    this.clock = null;
  }
  
}