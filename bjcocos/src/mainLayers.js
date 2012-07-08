"use strict"  // Use strict JavaScript mode

// Pull in the modules we're going to use
var cocos  = require('cocos2d')   // Import the cocos2d module
  , nodes  = cocos.nodes          // Convenient access to 'nodes'
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
  , main   = require('/main')  // Import the geometry module
  , actions   = cocos.actions

// Convenient access to some constructors
var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Sprite   = nodes.Sprite
  , Director = cocos.Director

var TouchDispatcher = require('cocos2d/TouchDispatcher').TouchDispatcher

var WIDTH = 0, HEIGHT = 0;
var WORD = "";
var layers = {}

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function interfaceLayer () {
    // You must always call the super class constructor
    interfaceLayer.superclass.constructor.call(this)
		
		WIDTH = main.main.WIDTH;
		HEIGHT = main.main.HEIGHT;

		var logo = new nodes.Sprite({ file:'/res/bjuceklis.png'});
			logo.anchorPoint = new geo.Point(0,0);
		this.addChild({ child:logo, z: -99});

}
layers.interfaceLayer = interfaceLayer

// Inherit from cocos.nodes.Layer
interfaceLayer.inherit(Layer)

function gameLayer () {
    // You must always call the super class constructor
    gameLayer.superclass.constructor.call(this)
		
		console.log('Start game layers');
		this.position = new geo.Point(WIDTH,120)
		this.anchorPoint = new geo.Point(0,0)	
		
		//var bt_begin = new nodes.Sprite({ file:'/res/bt_begin.png'});
		//this.addChild(bt_begin)
		
		var item = new nodes.MenuItemImage({
				normalImage: '/res/bt_begin.png'
			, selectedImage: '/res/bt_begin.png'
      , callback: function () { events.trigger(this, 'begin_game') }.bind(this)			
		})
		
		var menu = new nodes.Menu({items: [item,]})

		menu.anchorPoint	= new geo.Point(0,0)
    menu.position			= new geo.Point(0,0)
		item.anchorPoint	= new geo.Point(0,0)
    item.position			= new geo.Point(0,75)

    this.addChild({ child: menu , z: 1 })

    this.menu = menu;
		
		var move = new actions.MoveTo({ duration: 0.95, position: new geo.Point(160, 120) })
			move = new actions.EaseBounceOut({ action: move.copy() })
			
		this.runAction(move);
    //events.addListener(this, 'begin_game',    this.beginGame.bind(this))
		
}
layers.gameLayer = gameLayer

gameLayer.inherit(Layer, {
	beginGame: function() {
		console.log('begin game');
		
		this.removeChild(this.menu)
	}
})

function playLayer (data) {
    // You must always call the super class constructor
    playLayer.superclass.constructor.call(this)
		this.position = new geo.Point(WIDTH,120)
		this.anchorPoint = new geo.Point(0,0)	
		
		this.data = data;
		WORD = this.data.test;
		this.words = new wordLayer(WORD);
		this.addChild(this.words);
		
		var move = new actions.MoveTo({ duration: 0.95, position: new geo.Point(160, 120) })
			move = new actions.EaseBounceOut({ action: move.copy() })
			
		this.runAction(move);
}
playLayer.inherit(Layer, {
	pressChoice: function(idx) {
		console.log("pressed:", idx);
		idx.setLetter('')
	}
})
layers.playLayer = playLayer


function letterLayer(letter, pos, i, callback) {
	// You must always call the super class constructor
	letterLayer.superclass.constructor.call(this)
	this.anchorPoint = new geo.Point(0,0)	
	
	this.idx = i;
	this.callback = callback;
	this.letter = letter;

	var back = new nodes.Sprite({file:'/res/b_fons.png'});
		back.anchorPoint = new geo.Point(0,0);
		this.addChild(back);
	
	// Create label
	this.label = new Label({ string:   letter
												, fontName: 'Arial'
												, fontSize: 70
												, fontColor: '#000'
												})

		this.label.anchorPoint = new geo.Point(0.5,1);
    this.label.position = new geo.Point(back.contentSize.width * 0.5, back.contentSize.height - 5);
    this.addChild(this.label)
		
	this.position = new geo.Point(pos.x + 7, pos.y + 5);
	if (Director.sharedDirector.isTouchScreen) {
			//this.isTouchEnabled = true
	} else {
      //this.isMouseEnabled = true
	}

	this.rect = geo.rectMake(
		back.position.x - back.contentSize.width  * back.anchorPoint.x,
		back.position.y - back.contentSize.height * back.anchorPoint.y,
		back.contentSize.width,
		back.contentSize.height
	);
	this.rect.origin = ccp(0,0);
	
}
letterLayer.inherit(Layer, {
    registerWithTouchDispatcher: function () {
      var TouchDispatcher = cocos.TouchDispatcher.TouchDispatcher;
        TouchDispatcher.sharedDispatcher.addTargetedDelegate(this, -128, true)
    },
    // Mouse Events
    itemForMouseEvent: function (event) {
				if (!this.letter) return null;
				
				var location;
		    if (Director.sharedDirector.isTouchScreen) 
					location = Director.sharedDirector.convertTouchToCanvas(event.touch);
					else location	= event.locationInCanvas;
				
				var local	= this.convertToNodeSpace(location)
				
				if (geo.rectContainsPoint(this.rect, local)) return this

        return null
    },
   mouseUp: function (event) {
     var selectedItem = this.itemForMouseEvent(event)
		 if (!selectedItem) return false;
		 if (selectedItem.callback) selectedItem.callback(selectedItem)

     return true
    }

  , touchesEnded: function (event) {
     var selectedItem = this.itemForMouseEvent(event)
		 if (!selectedItem) return false;
		 if (selectedItem.callback) selectedItem.callback(selectedItem)
		 
     return true
    }
	, setLetter: function(letter) {
		this.letter = letter;
		this.label.string = letter
	}

})
function wordLayer(word) {
	// You must always call the super class constructor
	wordLayer.superclass.constructor.call(this)
	this.anchorPoint = new geo.Point(0,0)	

	var pos = ccp(0,0)
	var wordArray = new Array();
	for (var i = 0; i < word.length; i++) {
		var sp = new nodes.Sprite({file:'/res/b_back.png'});
			sp.anchorPoint = ccp(0,0);
			sp.position = ccp(pos.x, pos.y + 50); 
		this.addChild({child:sp, z: -10});
		sp = new nodes.Sprite({file:'/res/b_back.png'});
			sp.anchorPoint = ccp(0,0);
			sp.position = ccp(pos.x, pos.y + 80 + 50); 
		
		this.addChild({child:sp, z: -10});
		
		var t = new letterLayer(word.charAt(i),new geo.Point(pos.x, 80 + 50),i, this.pressChoice.bind(this));
		this.addChild({ child:t, z: 0});

		wordArray[i] = '';

		pos.x += 60;
    
    
	}		
  // Create label
  this.info = new Label({ string:   "INFO"
                        , fontName: 'Arial'
                        , fontSize: 30
                        , fontColor: '#000'
                        })

    this.info.anchorPoint = new geo.Point(0,0);
    this.info.position = new geo.Point(0,0);
    this.addChild(this.info)


  if (Director.sharedDirector.isTouchScreen) {
      //this.isTouchEnabled = true
      
      var canvas = Director.sharedDirector.canvas;
      
        canvas.addEventListener('touchstart',  this.touchesBegan.bind(this), true)
        canvas.addEventListener('touchmove',   this.touchesMoved.bind(this), true)
        canvas.addEventListener('touchend',    this.touchesEnded.bind(this), true)
        canvas.addEventListener('touchcancel', this.touchesCancelled.bind(this), true)
      
  } else {
      this.isMouseEnabled = true
  }
	
}
wordLayer.inherit(Layer, {
  registerWithTouchDispatcher11: function () {
    if (TouchDispatcher) this.info.string = "Touch dispatcher;"
   //TouchDispatcher.sharedDispatcher.addTargetedDelegate(this, 128, false)
   this.info.string = "Touch dispatcher SET"
  }
	, pressChoice: function(idx) {
		console.log("pressed:", idx);
		idx.setLetter('')
	}
  , mouseUp: function (event) {
    this.info.string = "Mouse press"
    return true;
  }
  , mouseMove: function (event) {
    this.info.string = "Mouse move"
    return true;
  }
  , touchesBegan: function (event) {
    var currentTime = new Date();
    this.info.string = "Touch BEGAN " + new Date().getSeconds()
        event.preventDefault();
    return true;
  }
  
  , touchesEnded: function (event) {
    this.info.string = "Touch end"
    event.preventDefault();
    return true;
  }
  , touchesCancelled: function (event) {
    this.info.string = "Touch cancel"
    event.preventDefault();
    return true;
  }
  , touchesMoved: function (event) {
    var location = event.touches[0].locationInCanvas
    this.info.string = "Touch moved x:" + location.x + " y:" + location.y
    event.preventDefault();
    return false;
  }
  
});


module.exports = layers
