




var BabyDancer = function(top, left, timeBetweenSteps){
  Dancer.apply(this,arguments);
  // we plan to overwrite the step function below, but we still want the superclass step behavior to work,
  // so we must keep a copy of the old version of this function
  this.$node = $('<span class = "BabyDancer"> <img src = "baby1.png"/></span>');
  this.setPosition(top, left);
};

BabyDancer.prototype = Object.create(Dancer.prototype);

BabyDancer.prototype.constructor = BabyDancer;

BabyDancer.prototype.step = function(timeBetweenSteps){
//  Dancer.prototype.step.call(this,timeBetweenSteps);
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
  var danceMode = Math.ceil(Math.random()*3);
  var danceMode2 = Math.ceil(Math.random()*2);
  this.top += Math.ceil(plusOrMinus*(2*danceMode + 2));
  this.left += Math.ceil(plusOrMinus*(2*danceMode2 + 6));
  this.$node.transition({top : this.top, left: this.left},50,"snap");
  this.$node.transition({rotate: danceMode2*2 + "deg"},50,"snap");
//    this.$node.animate({top : danceMode*100, left: danceMode2*100, rotation: danceMode2 + "deg"});
  this.$node.html('<span class = "BabyDancer"> <img src = "baby' + danceMode + '.png"/></span>');
};


BabyDancer.prototype.lineUp = function(left){
  this.whistle();
  this.$node.animate({left: left, top: 10});
};