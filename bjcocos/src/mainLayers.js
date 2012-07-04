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
		
//		var pos = new geo.Point(0,0);
//		for (var i = 0; i < WORD.length; i++) {
//			
//			var l = new letterLayer("",pos,i);
//			this.addChild(l);
//			
//			var t = new letterLayer(WORD.charAt(i),new geo.Point(pos.x, 70),i,this.pressChoice.bind(this));
//			this.addChild(t);
//			
//			pos.x += 50;
//		}		
		
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
			this.isTouchEnabled = true
	} else {
			this.isMouseEnabled = true
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
			sp.position = ccp(pos.x, pos.y); 
		this.addChild({child:sp, z: -10});
		sp = new nodes.Sprite({file:'/res/b_back.png'});
			sp.anchorPoint = ccp(0,0);
			sp.position = ccp(pos.x, pos.y + 80); 
		
		this.addChild({child:sp, z: -10});
		
		var t = new letterLayer(word.charAt(i),new geo.Point(pos.x, 80),i, this.pressChoice.bind(this));
		this.addChild({ child:t, z: 0});

		wordArray[i] = '';

		pos.x += 60;
	}		
	
}
wordLayer.inherit(Layer, {
	pressChoice: function(idx) {
		console.log("pressed:", idx);
		idx.setLetter('')
	}
});


module.exports = layers
