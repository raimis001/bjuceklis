goog.provide('bjuceklis.spLogo');

bjuceklis.spLogo = function() {
    lime.Sprite.call(this);
    
  var logo = new lime.Sprite()
    .setFill(new lime.fill.Image('media/bjuceklis.png'))
    .setAnchorPoint(0,0)
  ;
    
  this.appendChild(logo);
  
}
goog.inherits(bjuceklis.spLogo, lime.Sprite);




