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
		WORD = this.data.test;
		
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

  var word = data.test;

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
