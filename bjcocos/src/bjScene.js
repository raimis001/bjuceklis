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
var CONSOLE = true;
function bjScene () {
    // You must always call the super class constructor
    bjScene.superclass.constructor.call(this)
		
		WIDTH		= main.main.WIDTH;
		HEIGHT	= main.main.HEIGHT;

    //if (!Director.sharedDirector.isTouchScreen) CONSOLE = false;

		var layer = new layers.interfaceLayer();
		this.addChild({ child: layer, z: -99 })
		
    
    // Create info label
  	this.label = new Label({ string:   'INFO'
												, fontName: 'Arial'
												, fontSize: 24
												, fontColor: '#000'
												})

		this.label.anchorPoint = new geo.Point(0,0);
    this.label.position = new geo.Point(170, 10);
    this.addChild(this.label)
    
		this.data = {
      uid:3345
    };
		this.word = {
      hash: "25bba786fb5a9529022250569512661d",
      language: 0,
      lives: 99993042,
      test: "jut\u012bgs",
      time: 150,
      type: 2,
      word: "j\u012bgstu"
    };
    
    if (CONSOLE) {
      this.startGame(this.data)
    } else {
      var url = "http://game.atrodivardu.lv/index.php/game?session=34f404405adbde524d9ccb7bdc273421&mobile=1";

      var xhr = new loader.jsonLoader(url);
        xhr.loaded	= this.startGame.bind(this); 
        xhr.onerror = this.errorGame.bind(this);
        xhr.load();
    }
}

// Inherit from cocos.nodes.Layer
bjScene.inherit(Scene,{
	startGame: function(data) {
		//console.log(data);
    this.label.string = "Game data loded";
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
    this.label.string = "ERROR: Game data loded";
		console.log("Error");
	},
	onGetWord: function(data) {
    this.label.string = "Word loaded - " + data.test;
		this.word = data;
		this.game = new layers.playLayer(this.word);
		this.addChild(this.game);
	},
	getWord: function() {
    this.label.string = "Start Load word";
    if (CONSOLE) {
      this.onGetWord(this.word);
    } else {
    
      var url = "http://game.atrodivardu.lv/index.php/loader/get_word?session=34f404405adbde524d9ccb7bdc273421&json=1";

      var xhr = new loader.jsonLoader(url);
        xhr.loaded	= this.onGetWord.bind(this); 
        xhr.onerror = this.errorGame.bind(this); 
        xhr.load();
    }
	}
})

module.exports = bjScene
