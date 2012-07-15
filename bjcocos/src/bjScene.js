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
var DEBUG = false;
var URL = "http://game.atrodivardu.lv/index.php/";
var U_SESSION = "session=34f404405adbde524d9ccb7bdc273421";
function bjScene () {
    // You must always call the super class constructor
    bjScene.superclass.constructor.call(this)
		
		WIDTH		= main.main.WIDTH;
		HEIGHT	= main.main.HEIGHT;


		var layer = new layers.interfaceLayer();
		this.addChild({child: layer, z: -99})
		
    
    // Create info label
  	this.label = new Label({string:   'INFO'
												, fontName: 'Arial'
												, fontSize: 24
												, fontColor: '#000'
												})

		this.label.anchorPoint = new geo.Point(0,0);
    this.label.position = new geo.Point(170, 10);
    //this.addChild(this.label)
    
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
    this.check = {
      level: "8",
      lives: "99993013",
      note: "\u0136\u012bmisk\u0101 elementa un sk\u0101bek\u013ca savienojums",
      points: 5422,
      test: this.word.test,
      tword: this.word.test,
      v_value: "1000",
      victory: 0,
      word: this.word.test      
    };
    
		this.game = new layers.playLayer();
		this.addChild(this.game);
    
    if (!DEBUG) {
      var url = URL + "game?mobile=1&" + U_SESSION;

      var xhr = new loader.jsonLoader(url);
        xhr.loaded	= this.startGame.bind(this); 
        xhr.onerror = this.errorGame.bind(this);
        xhr.load();
    } else {
      this.startGame(this.data);
    }
}

bjScene.inherit(Scene,{
	errorGame: function() {
    this.label.string = "ERROR: Game data loded1";
		console.log("Error");
	}
	, startGame: function(data) {
    this.label.string = "Game data loded";
		this.data = data;
		
    this.game.startGame();
	}
	, beginGame: function() {
		this.getWord();
	}
	, onGetWord: function(data) {
    this.label.string = "Word loaded - " + data.test;
    
		this.word = data;
		this.game.startWord(this.word);
	}
	, getWord: function() {
    this.label.string = "Start Load word";
    
      if (!DEBUG) {
        var url = URL + "loader/get_word?json=1&" + U_SESSION;

        var xhr = new loader.jsonLoader(url);
          xhr.loaded	= this.onGetWord.bind(this); 
          xhr.onerror = this.errorGame.bind(this); 
          xhr.load();
      } else {
        this.onGetWord(this.word); 
      }
	}
  , onCheckWord: function(data) {
    this.game.setNote(data);
  }
  , checkWord: function(event) {
    
    if (!DEBUG) {
      var url = URL + "loader/check_word?json=1&" + U_SESSION + "&word=" + event;
        var xhr = new loader.jsonLoader(url);
          xhr.loaded	= this.onCheckWord.bind(this); 
          xhr.onerror = this.errorGame.bind(this); 
          xhr.load();
    } else {
      this.onCheckWord(this.check);
    }
    
  }
  , onTimeOut: function(data) {
    this.game.setNote(data);
  }
  , timeOut: function() {
    if (!DEBUG) {
      var url = URL + "loader/time_out?json=1&" + U_SESSION;
        var xhr = new loader.jsonLoader(url);
          xhr.loaded	= this.onTimeOut.bind(this); 
          xhr.onerror = this.errorGame.bind(this); 
          xhr.load();
    } else {
      this.onTimeOut(this.check);
    }
  }
})

module.exports = bjScene
