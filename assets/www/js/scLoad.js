goog.provide('bjuceklis.scLoad');

goog.require('goog.net.XhrIo');
goog.require('goog.crypt.Md5');
goog.require('goog.crypt');

bjuceklis.scLoad = function() {
  lime.Scene.call(this);
    
  this.appendChild(new bjuceklis.spLogo());
  
  this.dispatchEvent({type: bjuceklis.Event.LOADED});  
}
goog.inherits(bjuceklis.scLoad, lime.Scene);


