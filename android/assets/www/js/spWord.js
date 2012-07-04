goog.provide('bjuceklis.spWord');

bjuceklis.word_width  = 60;
bjuceklis.word_offset = 9;

bjuceklis.spWord = function() {
  lime.Layer.call(this);

  this.word = new Array();

  this.assets = new Array();
  this.letters =  new Array();
  
  for (var i = 0; i < bjuceklis.WORD.length; i++) {
    this.letters[i] = new bjuceklis.spBurts("")
      .setPosition(bjuceklis.word_offset + i * bjuceklis.word_width, 0);
    this.letters[i].index = i;
    
    this.appendChild(this.letters[i]);
    goog.events.listen(this.letters[i], ['mousedown','touchstart'], this.onLettersClick , false, this);
    
    this.word[i] = "";
    
    var back = new lime.Sprite()
      .setPosition(((bjuceklis.WORD.length - 1) * bjuceklis.word_width) - i * bjuceklis.word_width, 70)
      .setFill(new lime.fill.Image('media/b_back.png'))
      .setAnchorPoint(0,0);
    this.appendChild(back);
  }
  
  var move  = new lime.animation.MoveTo(200,110)
                    .setDuration(0.55)
                    .setEasing(lime.animation.Easing.LINEAR);
  
  this.setPosition(bjuceklis.WIDTH - 20,110);
  
  goog.events.listen(move, lime.animation.Event.STOP, this.endMove ,false, this);  
  this.runAction(move);
  
  
}
goog.inherits(bjuceklis.spWord, lime.Layer);


bjuceklis.spWord.prototype.endMove = function() {
  console.log("end move");
  var d = 1000;
  for (var i = 0; i < bjuceklis.WORD.length; i++) {
    
    this.assets[i] = new bjuceklis.spBurts(bjuceklis.WORD.charAt(i));
    this.assets[i].flyTO(new goog.math.Coordinate(bjuceklis.word_offset + i * bjuceklis.word_width, 74), 0);
    this.assets[i].index = i;
    
    this.appendChild(this.assets[i]);
    goog.events.listen(this.assets[i], ['mousedown','touchstart'], this.onAssetsClick , false, this);
    
    d += 100;
  }
  
}

bjuceklis.spWord.prototype.onAssetsClick = function(e) {
  if (e.target.isfly) return;
  var index = e.target.index;
  var idx = 0;
  for (var i = 0; i < bjuceklis.WORD.length; i++) {
    if (this.word[i] == "") {
      idx = i;
      this.word[i] = e.target.letter;
      break;
    }
  }  
  this.letters[idx].target_id = index;
  
  goog.events.listen(e.target, bjuceklis.Event.END_FLY , function(e){
    this.letters[idx].showLetter(this.word[idx]);
    this.checkWord();
  } , false, this);
  
  e.target.setLetter(this.letters[idx].getPosition());
}

bjuceklis.spWord.prototype.onLettersClick = function(e) {
  if (e.target.isfly) return;
  if (e.target.letter == "") return;
  
  var idx = e.target.index;
  if (this.assets[this.letters[idx].target_id].isfly) return;
    
  this.word[idx] = "";
  this.letters[idx].showLetter("");
  
  this.assets[this.letters[idx].target_id].returnLetter();
  
}

bjuceklis.spWord.prototype.checkWord = function() {
  var word = this.word.join("");
  
  var hash = md5(word);
  
  //console.log(word + " "  + bjuceklis.HASH + "   " + hash)
  if (bjuceklis.HASH == hash) {
    console.log("Wiktorija");
    
    bjuceklis.gameVictory(word);
  }
}
