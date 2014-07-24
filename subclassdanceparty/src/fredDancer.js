var FredDancer = function(top, left, timeBetweenSteps){
  Dancer.apply(this,arguments);
  // we plan to overwrite the step function below, but we still want the superclass step behavior to work,
  // so we must keep a copy of the old version of this function
  this.$node = $('<span class = "FredDancer"> <img src = "fred1.png" height = "200"/></span>');
  this.setPosition(top, left);
};

FredDancer.prototype = Object.create(Dancer.prototype);

FredDancer.prototype.constructor = FredDancer;

FredDancer.prototype.step = function(timeBetweenSteps){
 // Dancer.prototype.step.call(this,timeBetweenSteps);
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
  var danceMode = Math.ceil(Math.random()*3);
  var danceMode2 = Math.ceil(Math.random()*3);
  this.top += Math.ceil(plusOrMinus*(3*danceMode + 5));
  this.left += Math.ceil(plusOrMinus*(3*danceMode2 + 5));
  this.$node.html('<span class = "FredDancer"> <img src = "fred' + danceMode + '.png" height = "200"/></span>');
  this.$node.transition({top : this.top, left: this.left},50,"ease");
  this.$node.transition({rotate: danceMode2*5 + "deg"},50,"ease");
};

FredDancer.prototype.lineUp = function(left){
  this.whistle();
  this.$node.animate({left: left, top: $(window).height() - 300});
};