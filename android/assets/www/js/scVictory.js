goog.provide('bjuceklis.scVictory');

bjuceklis.scVictory = function() {
  lime.Scene.call(this);

  var pos = new goog.math.Coordinate((bjuceklis.WIDTH - 780) * 0.5, (bjuceklis.HEIGHT - 200) * 0.5);

  var pop = new lime.Sprite()
    .setFill(new lime.fill.Image('media/popup.png'))
    .setAnchorPoint(0,0)
    .setPosition(bjuceklis.WIDTH + 20, pos.y);
    
  
  var button = new lime.Sprite()
    .setFill(new lime.fill.Image('media/bt_next.png'))
    .setAnchorPoint(0,0)
    .setPosition(610,145);
  pop.appendChild(button)
  
  this.icon = new lime.Sprite()
    .setFill(new lime.fill.Image('media/sm_good.png'))
    .setPosition(100,100);
  pop.appendChild(this.icon);
  
  this.error = new lime.Label()
    .setAnchorPoint(0,0)
    .setText("")
    .setPosition(180,20)
    .setSize(500,30)
    .setFontSize(28)
    .setFontWeight("bold")
    .setFontColor("#FF0000")
    .setAlign("left")
  pop.appendChild(this.error);

  this.word = new lime.Label()
    .setAnchorPoint(0,0)
    .setText("")
    .setPosition(180,50)
    .setSize(500,40)
    .setFontSize(42)
    .setFontWeight("bold")
    .setAlign("left")
  pop.appendChild(this.word);

  this.note = new lime.Label()
    .setAnchorPoint(0,0)
    .setText("")
    .setPosition(180,95)
    .setSize(400,200)
    .setFontSize(30)
    //.setFontWeight("bold")
    .setAlign("left")
  pop.appendChild(this.note);

  var move  = new lime.animation.MoveTo(pos)
                    .setDuration(0.25)
                    .setEasing(lime.animation.Easing.LINEAR);

  this.appendChild(pop);
  pop.runAction(move);

  goog.events.listen(pop, ['mousedown','touchstart'] , function(e){
    bjuceklis.gameBegin();
  } , false, this);
  

}
goog.inherits(bjuceklis.scVictory, lime.Scene);

bjuceklis.scVictory.prototype.setVictory = function(type, word) {
  //type of victory
  //0 - victory
  //1 - timeout
  //2 - wrong word
  if (!word) word = '';
  
  this.word.setText(word);
  this.error.setText("");
  this.note.setText("");
  
  switch (type) {
    case 0:
      this.error.setFontColor("#78C03E");
      this.error.setText("Tu atmin\u0113ji v\u0101rdu!");
      this.icon.setFill(new lime.fill.Image('media/sm_good.png'));
      break;
    case 1:
      this.error.setFontColor("#FF0000");
      this.error.setText("Laiks izbeidz\u0101s");
      this.icon.setFill(new lime.fill.Image('media/sm_bad.png'));
      break;
    case 2:
      this.error.setFontColor("#FF0000");
      this.error.setText("V\u0101rds nav atmin\u0113ts");
      this.icon.setFill(new lime.fill.Image('media/sm_bad.png'));
      break;
  }
  
}

bjuceklis.scVictory.prototype.setNote = function(note) {
  this.note.setText(note);
}
bjuceklis.scVictory.prototype.setWord = function(word) {
  this.word.setText(word);
}
