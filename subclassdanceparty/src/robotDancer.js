




var RobotDancer = function(top, left, timeBetweenSteps){
  Dancer.apply(this,arguments);
  // we plan to overwrite the step function below, but we still want the superclass step behavior to work,
  // so we must keep a copy of the old version of this function
  this.$node = $('<span class = "robotDancer"> <img src = "robot1.png"/></span>');
  this.setPosition(top, left);
};

RobotDancer.prototype = Object.create(Dancer.prototype);

RobotDancer.prototype.constructor = RobotDancer;

RobotDancer.prototype.step = function(timeBetweenSteps){
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
  var danceMode = Math.ceil(Math.random()*3);
  var danceMode2 = Math.ceil(Math.random()*4);
  this.top += Math.ceil(plusOrMinus*(2.4*danceMode + 6));
  this.left += Math.ceil(plusOrMinus*(2.4*danceMode2 + 6));
  this.$node.transition({top : this.top, left: this.left},50,"snap");
  this.$node.transition({rotate: danceMode2*5 + "deg"},50,"snap");
  this.$node.html('<span class = "robotDancer"> <img src = "robot' + danceMode + '.png"/></span>');
};

RobotDancer.prototype.lineUp = function(top){
  this.whistle(); 
  this.$node.animate({left: 50, top: top});
};