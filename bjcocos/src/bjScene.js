"use strict"  // Use strict JavaScript mode

// Pull in the modules we're going to use
var cocos  = require('cocos2d')   // Import the cocos2d module
  , nodes  = cocos.nodes          // Convenient access to 'nodes'
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
  , main   = require('/main')  // Import the geometry module
	, layers = require('/mainLayers')
	, loader  = require('/loader')

// Convenient access to some constructors
var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Director = cocos.Director
/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
var WIDTH = 0, HEIGHT = 0;
function bjScene () {
    // You must always call the super class constructor
    bjScene.superclass.constructor.call(this)
		
		WIDTH		= main.main.WIDTH;
		HEIGHT	= main.main.HEIGHT;

		var layer = new layers.interfaceLayer();
		this.addChild({ child: layer, z: -99 })
		
		var url = "http://game.atrodivardu.lv/index.php/game?session=34f404405adbde524d9ccb7bdc273421&mobile=1";

		var xhr = new loader.jsonLoader(url);
			xhr.loaded	= this.startGame.bind(this); 
			xhr.onerror = this.errorGame;
			xhr.load();
			
		this.data = {};
		this.word = {};
}

// Inherit from cocos.nodes.Layer
bjScene.inherit(Scene,{
	startGame: function(data) {
		//console.log(data);
		this.data = data;
		this.game = new layers.gameLayer()
		this.addChild(this.game);
		
    events.addListener(this.game, 'begin_game',    this.beginGame.bind(this))
	},
	beginGame: function() {
		this.removeChild(this.game);
		this.getWord();
	},
	errorGame: function() {
		console.log("Error");
	},
	onGetWord: function(data) {
		this.word = data;
		this.game = new layers.playLayer(this.word);
		this.addChild(this.game);
	},
	getWord: function() {
		var url = "http://game.atrodivardu.lv/index.php/loader/get_word?session=34f404405adbde524d9ccb7bdc273421&json=1";

		var xhr = new loader.jsonLoader(url);
			xhr.loaded	= this.onGetWord.bind(this); 
			//xhr.onerror = this.errorGame;
			xhr.load();
	}
})

module.exports = bjScene
