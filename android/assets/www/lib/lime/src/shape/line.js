goog.provide('lime.Line');
goog.provide('lime.Renderer.CANVAS.LINE');
goog.provide('lime.Renderer.DOM.LINE');


goog.require('lime.Renderer.CANVAS.SPRITE');
goog.require('lime.Renderer.DOM.SPRITE');
goog.require('lime.Sprite');
goog.require('lime.style');

/**
 * Circle or ellipse shaped tectured object
 * @constructor
 * @extends lime.Sprite
 */
lime.Line = function() {
    lime.Sprite.call(this);


};
goog.inherits(lime.Line, lime.Sprite);

/**
 * Common name for circle objects
 * @type {string}
 */
lime.Line.prototype.id = 'line';

/** @inheritDoc */
lime.Line.prototype.supportedRenderers = [
    lime.Renderer.DOM.SPRITE.makeSubRenderer(lime.Renderer.DOM.LINE),
    lime.Renderer.CANVAS.SPRITE.makeSubRenderer(lime.Renderer.CANVAS.LINE)
];

/**
 * @inheritDoc
 */
lime.Line.prototype.hitTest = function(e) {
    var coord = this.screenToLocal(e.screenPosition);
    var s = this.size_, ap = this.anchorPoint_,
        a = s.width * .5, b = s.height * .5,
        x = coord.x - s.width * (.5 - ap.x),
        y = coord.y - s.height * (.5 - ap.y);

    if ((x * x) / (a * a) + (y * y) / (b * b) < 1) {
        e.position = coord;
        return true;
    }
    return false;
};

/**
 * @inheritDoc
 * @this {lime.Circle}
 */
lime.Renderer.DOM.LINE.draw = function(el) {
    var size = this.getSize();

    lime.Renderer.DOM.SPRITE.draw.call(this, el);

    //lime.style.setBorderRadius(el, size.width * .5, size.height * .5);
  //  el.style['-webkit-border-radius'] = el.style['MozBorderRadius'] =
  //      size.width*.5+'px / '+size.height*.5+'px';

};

/**
 * @inheritDoc
 * @this {lime.Circle}
 */
lime.Renderer.CANVAS.LINE.draw = function(context) {
   // console.log('draw');
    var size = this.getSize(), fill = this.fill_,ap = this.getAnchorPoint();
    
    var frame = this.getFrame();
    var cx = (frame.right - frame.left) * .5;
    var cy = (frame.bottom - frame.top) * .5;
    
    context.save();
    context.save();
    
    context.moveTo(10,10);
    context.lineTo(150,50);
    context.lineTo(10,50);
    context.stroke();    
    
    context.scale(cx, cy);
    context.translate(1-2*ap.x,1-2*ap.y);
    context.beginPath();
    context.arc(0, 0, 1, 0, 2 * Math.PI, false);
    context.closePath();
    context.restore();
    context.clip();

    lime.Renderer.CANVAS.SPRITE.draw.call(this, context);
    
    if(this.stroke_){
        context.lineWidth*=2;
        context.stroke();
    }
    
    context.restore();
};
