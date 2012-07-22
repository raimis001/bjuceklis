(function(){
__jah__.resources["/bjScene.js"] = {data: function (exports, require, module, __filename, __dirname) {
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

}, mimetype: "application/javascript", remote: false}; // END: /bjScene.js


__jah__.resources["/config.js"] = {data: function (exports, require, module, __filename, __dirname) {
//exports.ENABLE_DEPRECATED_METHODS = true
exports.FLIP_Y_AXIS = false;
}, mimetype: "application/javascript", remote: false}; // END: /config.js


__jah__.resources["/loader.js"] = {data: function (exports, require, module, __filename, __dirname) {
var events = require('events')
var loader = {}

function jsonLoader(url) {
    this.url	= url;
		this.data = null;
}
loader.jsonLoader = jsonLoader

loader.jsonLoader.prototype.load = function () {
	
    var xhr = new XMLHttpRequest()
		var self = this;
		xhr.onload = function (e) {
			var s = e.target.response;
			
			try {
				self.data = JSON.parse(s);
			} catch (ex) {}
			console.log("data loaded:",self.data);
			if (self.data) 
				self.loaded(self.data);
				else self.onerror();
		}
		
    xhr.open('GET', this.url, true)  
    xhr.send(null)
}
loader.jsonLoader.prototype.loaded = function () {}
loader.jsonLoader.prototype.onerror = function () {}


module.exports = loader

}, mimetype: "application/javascript", remote: false}; // END: /loader.js


__jah__.resources["/main.js"] = {data: function (exports, require, module, __filename, __dirname) {
"use strict"  // Use strict JavaScript mode

// Pull in the modules we're going to use
var cocos  = require('cocos2d')   // Import the cocos2d module
  , nodes  = cocos.nodes          // Convenient access to 'nodes'
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
	, bjScene = require('/bjScene')
	
// Convenient access to some constructors
var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Director = cocos.Director
	

/**
 * Entry point for the application
 */
main.WIDTH	= 960;
main.HEIGHT = 640;
function main () {
    // Initialise application

    // Get director singleton
    var director = Director.sharedDirector
			director.backgroundColor = '#B4D565';
      director.displayFPS = true;
      
    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
      
        //if (Director.sharedDirector.isTouchScreen)  document.write('<link rel="stylesheet" type="text/css" href="mobile.css">');      
        
        // Create a scene and layer
        var scene = new bjScene()
				
        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}

exports.main = main


}, mimetype: "application/javascript", remote: false}; // END: /main.js


__jah__.resources["/mainLayers.js"] = {data: function (exports, require, module, __filename, __dirname) {
"use strict"  // Use strict JavaScript mode

// Pull in the modules we're going to use
var cocos  = require('cocos2d')   // Import the cocos2d module
  , nodes  = cocos.nodes          // Convenient access to 'nodes'
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
  , main   = require('/main')  // Import the geometry module
  , actions   = cocos.actions
  , MD5    = require('/md5')

// Convenient access to some constructors
var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Sprite   = nodes.Sprite
  , Director = cocos.Director.sharedDirector
  , Scheduler = cocos.Scheduler


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
			logo.anchorPoint = ccp(0,0);
      this.addChild({child:logo, z: -99});

}
layers.interfaceLayer = interfaceLayer

// Inherit from cocos.nodes.Layer
interfaceLayer.inherit(Layer);

function pretendLayer() {
  pretendLayer.superclass.constructor.call(this);
  
  this.position = ccp(-200,0);

    this.pretend = new nodes.Sprite({file:'/res/pretender.png'});
      this.pretend.anchorPoint = ccp(0.5,1);
      this.pretend.position = ccp(40,HEIGHT - 130);
      this.addChild(this.pretend);

    this.enemy = new nodes.Sprite({file:'/res/pretender.png'});
      this.enemy.anchorPoint = ccp(0.5,1);
      this.enemy.position = ccp(115,HEIGHT - 130);
      this.addChild(this.enemy);
      
    this.changeScore(0);
}
pretendLayer.inherit(Layer,{
  pretenderScore: 0,
  enemyScore: 100
  
  , changeScore: function(score) {
    
    this.pretenderScore += score;
    
    var all   = (this.pretenderScore + this.enemyScore);
    var pall  = 480 * (this.pretenderScore / all);
    var eall  = 480 * (this.enemyScore / all);
      
    this.enemy.rect = new geo.Rect(0, 480 - pall, 70, pall);
    this.enemy.contentSize = new geo.Size(70,pall);
    
    this.pretend.rect = new geo.Rect(0, 480 - eall, 70, eall);
    this.pretend.contentSize = new geo.Size(70,eall);
  }
});
function clockLayer() {
  clockLayer.superclass.constructor.call(this);
  
  this.position = ccp(0, -120)
  
  var back = new nodes.Sprite({file:'/res/clock.png'}); 
    back.position = ccp(50,60);
    this.addChild(back);
    
  this.rate = new nodes.Sprite({file:'/res/bulta.png'}); 
    this.rate.position = ccp(50,60);
    this.addChild(this.rate);
}
clockLayer.inherit(Layer,{
  setClock: function(time) {
    this.rate.rotation = 360 * time;
  }
});

function playLayer () {
    // You must always call the super class constructor
    playLayer.superclass.constructor.call(this)
		this.position = new geo.Point(200,120)
		this.anchorPoint = new geo.Point(0,0)	
		
    this.pretender = new pretendLayer();
      this.addChild(this.pretender);
      
    this.clock = new clockLayer();
      this.addChild(this.clock);
}
playLayer.inherit(Layer, {
  playTime: 0,
  
  startGame: function() {
    this.clock.setClock(0);
    
    this.layer = new gameLayer();
    this.addChild(this.layer);
  }
  , beginGame: function() {
    this.removeChild(this.layer);
    this.layer = null;
    
    this.wait = new nodes.Sprite({file:'/res/wait1.png'});
      this.wait.position = ccp(50,100);
      this.wait.runAction(new actions.RepeatForever(new actions.RotateBy({duration: 1.5, angle: 360})));
      this.addChild(this.wait);
    
    this.parent.beginGame();
  }
  , onTimer: function() {
    this.playTime ++;
    this.clock.setClock(this.playTime / this.data.time);
    
    if (this.playTime > this.data.time) {
      this.createTimeout();
    }
  }
  , onTimeout: function() {
    this.createTimeout();
  }
  , startWord: function(data) {
    if (this.wait) this.removeChild(this.wait);
    
		this.data = data;
    console.log(this.data);
		WORD = this.data.word;
		
    this.layer = new wordLayer(this.data);
		this.addChild(this.layer);
		
    this.playTime = 0;
    this.clock.setClock(0);
    Scheduler.sharedScheduler.schedule({target:this, method:this.onTimer, interval:1, paused:false});
    
    this.timer = setTimeout(this.onTimeout.bind(this), (this.data.time + 5) * 1000 );
  }
  , endWord: function() {
    this.removeChild(this.popup);this.popup = null;
    this.removeChild(this.layer);this.layer = null;
    
    this.startGame();
    
  }
  , createTimeout: function() {
    this.layer._disabled = true;
    Scheduler.sharedScheduler.unscheduleAllSelectorsForTarget(this);
    clearTimeout(this.timer);
    
    
    this.popup = new popupLayer({victory:false, word:""});
    this.addChild(this.popup);
    
    this.parent.timeOut();
  }
	, createVictory: function(word) {
    Scheduler.sharedScheduler.unscheduleAllSelectorsForTarget(this);
    clearTimeout(this.timer);
    
    this.popup = new popupLayer({victory:true, word:word});
    this.addChild(this.popup);
    
    this.pretender.changeScore(5);
    
    this.parent.checkWord(word);
	}
  , setNote: function(data) {
    if (this.popup) this.popup.setNote(data);
  }
});
layers.playLayer = playLayer

function gameLayer () {
    gameLayer.superclass.constructor.call(this)
		
		console.log('Start game layers');
		this.position = new geo.Point(WIDTH,0);
		this.anchorPoint = new geo.Point(0,0);
		
		var item = new nodes.MenuItemImage({
				normalImage: '/res/bt_begin.png'
			, selectedImage: '/res/bt_begin.png'
      , callback: this.beginGame.bind(this)			
		})
		
		var menu = new nodes.Menu({items: [item]})

		menu.anchorPoint	= new geo.Point(0,0)
    menu.position			= new geo.Point(0,0)
		item.anchorPoint	= new geo.Point(0,0)
    item.position			= new geo.Point(0,75)

    this.addChild({child: menu , z: 10})

    //events.addListener(this, 'begin_game',    this.beginGame.bind(this))
		
}

gameLayer.inherit(Layer, {
  onEnter: function() {
    gameLayer.superclass.onEnter.call(this)
 
		var move = new actions.MoveTo({duration: 0.95, position: new geo.Point(0, 0)})
			move = new actions.EaseBounceOut({action: move.copy()})
			
		this.runAction(move);
  }
  , beginGame: function() {
    this.parent.beginGame();
  }
});

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
    var action = new actions.Sequence({actions: [ 
          new actions.MoveTo({duration: 0.2, position: ccp(location.x + this.delta.x, location.y + this.delta.y)})
        , new actions.CallFunc({target: this, method: 'endFly'})    
    ]});
  
    this.runAction(action);
  }

})
function wordLayer(data) {
	// You must always call the super class constructor
	wordLayer.superclass.constructor.call(this)
	this.anchorPoint = ccp(0,0);

  this.data = data;

  var word = data.word;

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
    
//Seccond line    
		sp = new nodes.Sprite({file:'/res/b_back.png'});
			sp.anchorPoint = ccp(0,0);
			sp.position = ccp(pos.x, pos.y + 80 + 50); 
		this.addChild({child:sp, z: -10});
    this.pos2[i] = this.getRect(sp);
    this.pos2[i].letter = sp;

//Letter
		var t = new letterLayer(word.charAt(i),ccp(pos.x, 80 + 50),i);
		this.letters[i] = t;
		this.addChild({child:t, z: 0});

//Next position
		pos.x += 58;
	}		
  // Create label
  this.info = new Label({string:   "INFO", fontName: 'Arial', fontSize: 30, fontColor: '#000'});
    this.info.anchorPoint = new geo.Point(0,0);
    this.info.position = new geo.Point(0,0);
    //this.addChild(this.info)


  if (Director.isTouchScreen) {
      
      var canvas = Director.canvas;
      
        canvas.addEventListener('touchstart',  this.touchesBegan.bind(this), true)
        canvas.addEventListener('touchmove',   this.touchesMoved.bind(this), true)
        canvas.addEventListener('touchend',    this.touchesEnded.bind(this), true)
        canvas.addEventListener('touchcancel', this.touchesCancelled.bind(this), true)
        Director.document.addEventListener("backbutton", this.touchesBack.bind(this), false);
        
      
  } else {
      this.isMouseEnabled = true
  }
	
  this.position    = ccp(WIDTH,0);
  var move = new actions.MoveTo({duration: 0.95, position: ccp(0, 0)})
    move = new actions.EaseBounceOut({action: move})

  this.runAction(move);
  
}
wordLayer.inherit(Layer, {
  _isdragging: false,
  _disabled: false
  
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
      var test = MD5(word);
      
      if (this.data.hash == test) {
        this._disabled = true;
        this.parent.createVictory(word);
      }
  }
 //Global events 
  , eventDown: function(location) {
      if (this._disabled) return;
      this._selected = this.getSelected(location);
      if (!this._selected) return;
      //console.log("Select item:",this._selected);
      if (this._selected.down) this.tm = setTimeout(this.startDrag.bind(this), 300)
  }
  , eventUp: function() {
      if (this._disabled) return;
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
      
      this.endFly();
  }
  , eventDrag: function(location) {
    if (this._disabled) return;
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
function popupLayer(data) {
	// You must always call the super class constructor
	popupLayer.superclass.constructor.call(this);
  
  var back = new nodes.Sprite({file:'/res/popup.png'});
    back.anchorPoint = ccp(0,0);
    this.addChild(back);

  var file;
  if (data.victory) file = '/res/sm_good.png'; else file = '/res/sm_bad.png';
  this.star = new nodes.Sprite({file:file});
    this.star.position = ccp(100,100)
    this.addChild(this.star);

  this.anchorPoint = ccp(0,0);
  this.position = ccp(WIDTH,120);


	this.word = new Label({string:   data.word
												, fontName: 'Arial'
												, fontSize: 45
												, fontColor: '#000'
												})

		this.word.anchorPoint = ccp(0,0);
    this.word.position = ccp(180,10);
    this.addChild(this.word)
    
    this.wait = new nodes.Sprite({file:'/res/wait1.png'});
      this.wait.position = ccp(700,100);
      this.wait.runAction(new actions.RepeatForever(new actions.RotateBy({duration: 1.5, angle: 360})));
      this.addChild(this.wait);
    
    this.notes = new Array();

		var item = new nodes.MenuItemImage({
				normalImage: '/res/bt_next.png'
			, selectedImage: '/res/bt_next.png'
      , callback: this.nextGame.bind(this)			
		})
		
		this.menu = new nodes.Menu({items: [item,]})

		this.menu.anchorPoint	= ccp(0,0)
    this.menu.position		= ccp(610,145)
		item.anchorPoint      = ccp(0,0)
    item.position         = ccp(0,0)

    this.addChild({child: this.menu , z: 100})
    
    this.menu.visible = false;
  
}
popupLayer.inherit(Layer, {
  onEnter: function () {
    popupLayer.superclass.onEnter.call(this)
    
    var move = new actions.MoveTo({duration: 1, position: ccp(-100, 120)})
      move = new actions.EaseBounceOut({action: move.copy()})

    var rot = new actions.RotateBy({duration:1, angle:360});
    this.star.runAction(rot);
    this.runAction(move);


  }
  , setNote: function(data) {
    for (var i = 0; i < this.notes.length; i++) this.removeChild(this.notes[i]);
  	var testlabel = new Label({string:   "", fontName: 'Arial', fontSize: 30, fontColor: '#000'});
    function getWidth(txt) {
        var ctx = Director.context;
        var prevFont = ctx.font;
        var tw = 0;
        ctx.font = testlabel.font;
        if (ctx.measureText) {
            var txtSize = ctx.measureText(txt)
            tw = txtSize.width
        } else if (ctx.mozMeasureText) {
            tw = ctx.mozMeasureText(txt)
        }

        ctx.font = prevFont
      
      return tw;
    }
    
    
    if (data.word) this.word.string = data.word;
    var note = data.note;
    if (!note) {
      this.menu.visible = true;
      this.wait.visible = false;
      return;
    }
    
    var words = note.split(" ");
    var line = "";
    
    var label;
    var y = 60;
    var maxWidth = 450;
    var lineHeight = 30;
    var x = 380;

    for(var n = 0; n < words.length; n++) {
    
      var testLine = line + words[n] + " ";
      var testWidth = getWidth(testLine);
      if(testWidth > maxWidth) { //Create new label
        label = new Label({string:   line, fontName: 'Arial', fontSize: 30, fontColor: '#000'});
          label.anchorPoint = ccp(0.5,0);
          label.position = ccp(x,y)
        this.addChild(label);
        this.notes.push(label);
        
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    label = new Label({string:   line, fontName: 'Arial', fontSize: 30, fontColor: '#000'});
      label.anchorPoint = ccp(0.5,0);
      label.position = ccp(x,y)
    this.addChild(label);
    this.notes.push(label);
    
    this.menu.visible = true;
    this.wait.visible = false;
  }
  , nextGame: function() {
    console.log("next game")
    var move = new actions.MoveTo({duration: 1, position: ccp(WIDTH, 120)})
      move = new actions.EaseBackIn({action: move})
      
      move = new actions.Sequence({actions:[
              move, 
              new actions.CallFunc({target: this, method: 'callback'})
      ]})
      
    this.runAction(move);
  }
  , callback: function() {
    this.parent.endWord();
  }
  
});

module.exports = layers

}, mimetype: "application/javascript", remote: false}; // END: /mainLayers.js


__jah__.resources["/md5.js"] = {data: function (exports, require, module, __filename, __dirname) {
/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/

var MD5 = function (string) {

	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}

	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}

 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }

	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};

	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;

	string = Utf8Encode(string);

	x = ConvertToWordArray(string);

	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}

	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

	return temp.toLowerCase();
}

module.exports = MD5;
}, mimetype: "application/javascript", remote: false}; // END: /md5.js


__jah__.resources["/res/bjuceklis.png"] = {data: __jah__.assetURL + "/res/bjuceklis.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/bt_begin.png"] = {data: __jah__.assetURL + "/res/bt_begin.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/bt_next.png"] = {data: __jah__.assetURL + "/res/bt_next.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/bulta.png"] = {data: __jah__.assetURL + "/res/bulta.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/b_back.png"] = {data: __jah__.assetURL + "/res/b_back.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/b_fons.png"] = {data: __jah__.assetURL + "/res/b_fons.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/clock.png"] = {data: __jah__.assetURL + "/res/clock.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/popup.png"] = {data: __jah__.assetURL + "/res/popup.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/pretender.png"] = {data: __jah__.assetURL + "/res/pretender.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/sm_bad.png"] = {data: __jah__.assetURL + "/res/sm_bad.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/sm_good.png"] = {data: __jah__.assetURL + "/res/sm_good.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/timer.png"] = {data: __jah__.assetURL + "/res/timer.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/wait.png"] = {data: __jah__.assetURL + "/res/wait.png", mimetype: "image/png", remote: true};
__jah__.resources["/res/wait1.png"] = {data: __jah__.assetURL + "/res/wait1.png", mimetype: "image/png", remote: true};
})();