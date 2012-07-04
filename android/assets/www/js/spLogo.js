goog.provide('bjuceklis.spLogo');

bjuceklis.spLogo = function() {
    lime.Sprite.call(this);
    
  this.setFill(new lime.fill.Image('media/bjuceklis.png'));
  this.setAnchorPoint(0,0);
    
//  var tween = Tween.get(bjuceklis.logo, {loop:false})
//              .to({x:500, y:00, rotation:-360}, 2500, Ease.bounceOut)
//              .wait(1000).call(handleComplete)
//              .to({x:canvas.width-55, rotation:360}, 2500, Ease.bounceOut)
//              .wait(1000).call(handleComplete)
//              .to({scaleX:2, scaleY:2, x:canvas.width - 110, y:canvas.height-110}, 2500, Ease.bounceOut)
//              .wait(1000)
//              .to({scaleX:.5, scaleY:.5, x:30, rotation:-360, y:canvas.height-30}, 2500, Ease.bounceOut)
//  ;

   //Ticker.addListener(window);
  
}
goog.inherits(bjuceklis.spLogo, lime.Sprite);

//function tick() {
//  //stage.update();
//  //console.log(bjuceklis.logo.position_.x)
//  bjuceklis.logo.setDirty(lime.Dirty.POSITION);
//}
//function handleComplete() {
//  Ticker.removeListener(window);
//  console.log('end tween');
//  bjuceklis.director.dispatchEvent({type: bjuceklis.Event.LOADED});  
//}

bjuceklis.spLogo.prototype.__defineGetter__ ('x',
  function() {
    var p = this.getPosition();
    return p.x;
    
  }
);
bjuceklis.spLogo.prototype.__defineSetter__ ('x',
  function(val) {
    var p = this.getPosition();
    p.x = val;
    this.setPosition(p);
  }
);
bjuceklis.spLogo.prototype.__defineGetter__ ('y',
  function() {
    var p = this.getPosition();
    return p.y;
    
  }
);
bjuceklis.spLogo.prototype.__defineSetter__ ('y',
  function(val) {
    var p = this.getPosition();
    p.y = val;
    this.setPosition(p);
  }
);
bjuceklis.spLogo.prototype.__defineGetter__ ('rotation',
  function() {
    var p = this.getRotation();
    return p;
    
  }
);
bjuceklis.spLogo.prototype.__defineSetter__ ('rotation',
  function(val) {
    this.setRotation(val);
  }
);
 
 
