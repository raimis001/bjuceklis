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

bjuceklis.scVictory.prototype.setVictory = function(type) {
  //type of victory
  //0 - victory
  //1 - timeout
  //2 - wrong word
  
  this.word.setText(bjuceklis.WORD);
  this.error.setText("");
  
  switch (type) {
    case 0:
      this.icon.setFill(new lime.fill.Image('media/sm_good.png'));
      break;
    case 1:
      this.error.setText("Laiks izbeidz\u0101s");
      this.icon.setFill(new lime.fill.Image('media/sm_bad.png'));
      break;
    case 2:
      this.error.setText("V\u0101rds nav atmin\u0113ts");
      this.icon.setFill(new lime.fill.Image('media/sm_bad.png'));
      break;
  }
  
}

