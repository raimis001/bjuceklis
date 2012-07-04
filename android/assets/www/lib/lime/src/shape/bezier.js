goog.provide('lime.Bezier');
goog.provide('lime.Renderer.CANVAS.BEZIER');


goog.require('goog.array');
goog.require('goog.math.Coordinate');
goog.require('lime.Renderer.CANVAS.SPRITE');
goog.require('lime.Sprite');

/**
 * Polygon shaped textured object
 * @param {Array.<goog.math.Coodinate>} points Polygon points.
 * @constructor
 * @extends lime.Sprite
 */
lime.Bezier = function(points) {
    lime.Sprite.call(this);

    this.setPoints.apply(this, arguments);
};
goog.inherits(lime.Bezier, lime.Sprite);

/**
 * Common name for polygon objects
 * @type {string}
 */
lime.Bezier.prototype.id = 'bezier';

/** @inheritDoc */
lime.Bezier.prototype.supportedRenderers = [
    lime.Renderer.CANVAS.SPRITE.makeSubRenderer(lime.Renderer.CANVAS.BEZIER)
];

/**
 * Returns array of points that define the polygon
 * @return {Array.<goog.math.Coordinate>} Array of polygon points.
 */
lime.Bezier.prototype.getPoints = function() {
    return this.points_;
};

/**
 * Sets points that define the polygon. Also accepts floats.
 * @param {Array.<goog.math.Coodinate>} points Polygon points.
 * @return {lime.Polygon} object itself.
 */
lime.Bezier.prototype.setPoints = function(points) {
    this.points_ = [];
    this.addPoints.apply(this, arguments);
    return this;
};

/**
 * Adds points to current polygon points. Also accepts floats.
 * @param {Array.<goog.math.Coodinate>} points Polygon points.
 * @return {lime.Polygon} object itself.
 */
lime.Bezier.prototype.addPoints = function(points) {
    var points = goog.array.toArray(arguments);
    if (!points.length) return;

    if (points[0] instanceof goog.math.Coordinate) {
        goog.array.forEach(points, function(p) {
           this.addPoint(p);
        },this);
    }
    else {
        for (var i = 1; i < points.length; i += 2) {
            this.addPoint(new goog.math.Coordinate(points[i - 1], points[i]));
        }
    }
    return this;
};

/**
 * Adds a point to current polygon points.
 * @param {goog.math.Coordinate} coord Point to add.
 * @return {lime.Polygon} object itself.
 */
lime.Bezier.prototype.addPoint = function(coord) {
    if (!this.points_.length) {
        this.minX = this.maxX = coord.x;
        this.minY = this.maxY = coord.y;
    }
    else {
        this.minX = Math.min(coord.x, this.minX);
        this.minY = Math.min(coord.y, this.minY);
        this.maxX = Math.max(coord.x, this.maxX);
        this.maxY = Math.max(coord.y, this.maxY);
    }

    this.points_.push(coord);
    return this;
};

/** @inheritDoc */
lime.Bezier.prototype.getSize = function() {
    return new goog.math.Size(this.maxX - this.minX, this.maxY - this.minY);
};

/** @inheritDoc */
lime.Bezier.prototype.getAnchorPoint = function() {
    var size = this.getSize();
    return new goog.math.Vec2(
        -this.minX / size.width, -this.minY / size.height);
};


/**
 * @inheritDoc
 * @this {lime.Polygon}
 */
lime.Renderer.CANVAS.POLYGON.draw = function(context) {


    var size = this.getSize(), fill = this.fill_;

    var pt = this.getPoints();
    

    if (pt.length > 2) {

       context.save();
       context.beginPath();
       context.moveTo(pt[0].x, pt[0].y);

       for (var i = 1; i < pt.length; i++) {
           context.lineTo(pt[i].x, pt[i].y);

       }

       context.closePath();
       if(fill)
       context.fillStyle = fill.str;


       context.clip();
       
    context.moveTo(188, 130);
    context.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    context.lineWidth = 10;
    context.strokeStyle = "black"; // line color
    context.stroke();       



    lime.Renderer.CANVAS.SPRITE.draw.call(this, context);
    
    if(this.stroke_){
        context.lineWidth*=2;
        context.stroke();
    }
    
    context.restore();
    }
};


