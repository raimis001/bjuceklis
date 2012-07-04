goog.provide('bjuceklis.spBurts');

bjuceklis.spBurts = function(letter) {
    lime.Sprite.call(this);
    
    this.index = -1;
    this.letter = letter;
    this.isfly = false;
    
  this
    .setFill(new lime.fill.Image('media/b_fons.png'))
    .setAnchorPoint(0,0)
  ;
    
  
  this.label = new lime.Label()
    .setAnchorPoint(0,0)
    .setText(letter)
    .setSize(45,60)
    .setPosition(4,4)
    .setFontSize(48)
    .setFontWeight("bold")
    .setAlign("center")
    //.setHidden(true);
  
  this.appendChild(this.label);
  //console.log(letter);
   
}
goog.inherits(bjuceklis.spBurts, lime.Sprite);

bjuceklis.spBurts.prototype.flyTO = function(pos, d) {
  this.setPosition(bjuceklis.WIDTH + 40, pos.y);
  this.newpos = pos;
    
  if (d > 0)
    lime.scheduleManager.scheduleWithDelay(this.fly, this, d);  
    else this.fly();
}

bjuceklis.spBurts.prototype.fly = function() {
  var move  = new lime.animation.MoveTo(this.newpos)
                    .setDuration(0.55)
                    .setEasing(lime.animation.Easing.LINEAR);
                    
  this.runAction(move);
}

bjuceklis.spBurts.prototype.setLetter = function(pos) {
  this.isfly = true;
  var move  = new lime.animation.MoveTo(pos)
                    .setDuration(0.25)
                    .setEasing(lime.animation.Easing.LINEAR);
                    
  goog.events.listen(move, lime.animation.Event.STOP, this.endMove ,false, this);  
  this.runAction(move);
}

bjuceklis.spBurts.prototype.endMove = function(e) {
  this.isfly = false;
  this.setHidden(true);
  this.dispatchEvent({type: bjuceklis.Event.END_FLY});
}

bjuceklis.spBurts.prototype.showLetter = function(letter) {
  this.letter = letter;
  this.label.setText(letter);
}

bjuceklis.spBurts.prototype.returnLetter = function() {
  this.isfly = true;
  this.setHidden(false);
  
  var move  = new lime.animation.MoveTo(this.newpos)
                    .setDuration(0.25)
                    .setEasing(lime.animation.Easing.LINEAR);
                    
  this.runAction(move);
  goog.events.listen(move, lime.animation.Event.STOP, this.endReturn ,false, this);  
  
}
bjuceklis.spBurts.prototype.endReturn = function(e) {
  this.isfly = false;
}
