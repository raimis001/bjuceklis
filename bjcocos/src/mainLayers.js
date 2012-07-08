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
  , Director = cocos.Director.sharedDirector


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

		var logo = new nodes.Sprite({file:'/res/bjuceklis.png'});
			logo.anchorPoint = new geo.Point(0,0);
		this.addChild({child:logo, z: -99});

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
      , callback: function () {events.trigger(this, 'begin_game')}.bind(this)			
		})
		
		var menu = new nodes.Menu({items: [item,]})

		menu.anchorPoint	= new geo.Point(0,0)
    menu.position			= new geo.Point(0,0)
		item.anchorPoint	= new geo.Point(0,0)
    item.position			= new geo.Point(0,75)

    this.addChild({child: menu , z: 1})

    this.menu = menu;
		
		var move = new actions.MoveTo({duration: 0.95, position: new geo.Point(160, 120)})
			move = new actions.EaseBounceOut({action: move.copy()})
			
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
		
		var move = new actions.MoveTo({duration: 0.95, position: new geo.Point(160, 120)})
			move = new actions.EaseBounceOut({action: move.copy()})
			
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
  this.idx1 = -1;
	this.callback = callback;
	this.letter = letter;
  this.down = true;

  this.delta = ccp(7,6);

	var back = new nodes.Sprite({file:'/res/b_fons.png'});
		back.anchorPoint = new geo.Point(0,0);
		this.addChild(back);
	
	// Create label
	this.label = new Label({string:   letter
												, fontName: 'Arial'
												, fontSize: 70
												, fontColor: '#000'
												})

		this.label.anchorPoint = new geo.Point(0.5,1);
    this.label.position = new geo.Point(back.contentSize.width * 0.5, back.contentSize.height - 5);
    this.addChild(this.label)
		
	this.position = new geo.Point(pos.x + this.delta.x, pos.y + this.delta.y);

	this.rect = geo.rectMake(
		back.position.x - back.contentSize.width  * back.anchorPoint.x,
		back.position.y - back.contentSize.height * back.anchorPoint.y,
		back.contentSize.width,
		back.contentSize.height
	);
	this.rect.origin = ccp(0,0);
	
}
letterLayer.inherit(Layer, {
  isfly: false
	, setLetter: function(letter) {
      this.letter = letter;
      this.label.string = letter
	}
  , endFly: function() {
    this.isfly = false;
    events.trigger(this.parent, 'end_fly');
  }
  , flyTo: function(location) {
    this.isfly = true;
    var action = new actions.Sequence({ actions: [ 
          new actions.MoveTo({ duration: 0.2, position: ccp(location.x + this.delta.x, location.y + this.delta.y) })
        , new actions.CallFunc({ target: this, method: 'endFly' })    
    ]});
  
    this.runAction(action);
  }

})
function wordLayer(word) {
	// You must always call the super class constructor
	wordLayer.superclass.constructor.call(this)
	this.anchorPoint = new geo.Point(0,0)	

	var pos = ccp(0,0);
  var sp;
	this.letters = new Array();
  this.pos1    = new Array();
  this.pos2    = new Array();
  
	for (var i = 0; i < word.length; i++) {
//First line    
		sp = new nodes.Sprite({file:'/res/b_back.png'});
			sp.anchorPoint = ccp(0,0);
			sp.position = ccp(pos.x, pos.y + 50); 
		this.addChild({child:sp, z: -10});
    this.pos1[i] = this.getRect(sp);
    this.pos1[i].letter = null;
    //console.log(this.pos1[i])
    
//Seccond line    
		sp = new nodes.Sprite({file:'/res/b_back.png'});
			sp.anchorPoint = ccp(0,0);
			sp.position = ccp(pos.x, pos.y + 80 + 50); 
		this.addChild({child:sp, z: -10});
    this.pos2[i] = this.getRect(sp);
    this.pos2[i].letter = sp;

//Letter
		var t = new letterLayer(word.charAt(i),new geo.Point(pos.x, 80 + 50),i);
		this.letters[i] = t;
		this.addChild({child:t, z: 0});

//Next position
		pos.x += 58;
	}		
  // Create label
  this.info = new Label({string:   "INFO"
                        , fontName: 'Arial'
                        , fontSize: 30
                        , fontColor: '#000'
                        })

    this.info.anchorPoint = new geo.Point(0,0);
    this.info.position = new geo.Point(0,0);
    this.addChild(this.info)


  if (Director.isTouchScreen) {
      //this.isTouchEnabled = true
      
      var canvas = Director.canvas;
      
        canvas.addEventListener('touchstart',  this.touchesBegan.bind(this), true)
        canvas.addEventListener('touchmove',   this.touchesMoved.bind(this), true)
        canvas.addEventListener('touchend',    this.touchesEnded.bind(this), true)
        canvas.addEventListener('touchcancel', this.touchesCancelled.bind(this), true)
        Director.document.addEventListener("backbutton", this.touchesBack.bind(this), false);
        
      
  } else {
      this.isMouseEnabled = true
  }
	
}
wordLayer.inherit(Layer, {
  _isdragging: false
  
  , registerWithTouchDispatcher11: function () {
    var TouchDispatcher = require('cocos2d/TouchDispatcher').TouchDispatcher;
    if (TouchDispatcher) this.info.string = "Touch dispatcher;"
    TouchDispatcher.sharedDispatcher.addTargetedDelegate(this, 128, false)
    this.info.string = "Touch dispatcher SET"
  }
  , getRect: function(sprite) {
    var rect = geo.rectMake(
      sprite.position.x - sprite.contentSize.width  * sprite.anchorPoint.x,
      sprite.position.y - sprite.contentSize.height * sprite.anchorPoint.y,
      sprite.contentSize.width - 5,
      sprite.contentSize.height - 5
    );
    rect.origin = ccp(this.position.x + sprite.position.x,this.position.y + sprite.position.y);
    return rect;
  }
  , getSelected: function(location) {
      for (var i = 0; i < this.letters.length; i++) {
        if (this.letters[i].isfly) continue;
        
        var local	= this.letters[i].convertToNodeSpace(location)
        var rect = this.letters[i].rect;
				if (geo.rectContainsPoint(rect, local)) return this.letters[i]
      }
      return null;
  }
  , startDrag: function() {
      this._isdragging = true;
      this.tm = null;
      this.info.string = "Starting dragg..."
      //console.log("Starting dragg...")
      if (Director.isTouchScreen) {
        Director.window.navigator.notification.vibrate(70);
      }
  }
  , endFly: function() {
      var word = "";
      for (var j = 0; j < this.pos1.length; j++) {
        if (!this.pos1[j].letter) return;
        word = word + this.pos1[j].letter.letter;
      }
      this.info.string = word;
      events.trigger(this.parent, 'check_word', WORD);
  }
 //Global events 
  , eventDown: function(location) {
      this._selected = this.getSelected(location);
      if (!this._selected) return;
      //console.log("Select item:",this._selected);
      if (this._selected.down) this.tm = setTimeout(this.startDrag.bind(this), 300)
  }
  , eventUp: function() {
      if (this.tm) clearTimeout(this.tm);
      this.tm = null;
      if (!this._selected) return;
      var i = this._selected.idx;
      var j;
      if (!this._isdragging) {
        this.info.string = "Mouse UP:" + this._selected.idx;
        
        if (this._selected.down ) {          
          
          for (j = 0; j < this.pos1.length; j++) {
            if (!this.pos1[j].letter) break;
          }
          
          this._selected.idx1 = j;
          this._selected.down = false;
          
          this.pos1[j].letter = this._selected;
          this.pos2[i].letter = null;
          
          this._selected.flyTo(this.pos1[j].origin);
          
        } else {
          this.pos1[this._selected.idx1].letter = null;
          this._selected.down = true;
          
          this._selected.flyTo(this.pos2[i].origin);
          
        }
      } else {
        //for (var i = 0; i < this.pos)
        var ower = -1;
        var local	= this._selected.position;
        for (j = 0; j < this.pos1.length; j++) {
          if (this.pos1[j].letter) continue;
          
          if (geo.rectContainsPoint(this.pos1[j], local)) {
            ower = j;
            break;
          }
        }
        if (ower > -1) {
          this._selected.idx1 = ower;
          this._selected.down = false;
          
          this.pos1[ower].letter = this._selected;
          this.pos2[i].letter = null;
          
          this._selected.flyTo(this.pos1[ower].origin);
        } else {
          this._selected.flyTo(this.pos2[i].origin);
        }
      }
      
      this._isdragging = false;
      this._selected = null;
      
      setTimeout(this.endFly.bind(this), 200)
  }
  , eventDrag: function(location) {
    if (!this._isdragging || !this._selected) return;
    var local	= this.convertToNodeSpace(location)
    local.x -= 20;
    local.y -= 50;
    if (Director.isTouchScreen) {
      local.x -= 20;
      local.y -= 50;
    }    
    this._selected.position = ccp(local.x, local.y);
  }

//Mouse events
  , mouseDown: function(event) {
    this.info.string = "Mouse DOWN";
    this.eventDown(event.locationInCanvas);
    return true;
  }
  , mouseUp: function (event) {
    this.info.string = "Mouse UP"
    this.eventUp();
    return true;
  }
  , mouseMoved: function (event) {
    if (!this._isdragging || !this._selected) return false;
    this.info.string = "Mouse move"
    this.eventDrag(event.locationInCanvas);
    return true;
  }
//Touch event
  , touchesBegan: function (event) {
    var location = event.touches[0].locationInCanvas;
    this.info.string = "Touch BEGAN " + new Date().getSeconds() + " x:" + location.x + " y:" + location.y;

    this.eventDown(location);
  }  
  , touchesEnded: function (event) {
    this.eventUp();
    this.info.string = "Touch END"
  }
  , touchesCancelled: function (event) {
    this.eventUp();
    this.info.string = "Touch CANCEL"
  }
  , touchesMoved: function (event) {
    var location = event.touches[0].locationInCanvas;
    this.info.string = "Moved x:" + location.x + " y:" + location.y
    this.eventDrag(location);
    
    event.preventDefault();
  }
  , touchesBack: function (event) {
    this.info.string = "Back is pressed";
    event.stopPropagation();
    Director.window.navigator.app.exitApp();
  }
  
});


module.exports = layers
