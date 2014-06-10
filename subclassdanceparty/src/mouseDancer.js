var alreadyCalled = false;
var MouseDancer = function(){
  if (!alreadyCalled){
    Dancer.apply(this,arguments);
    // we plan to overwrite the step function below, but we still want the superclass step behavior to work,
    // so we must keep a copy of the old version of this function
    this.$node = $('<span class = "MouseDancer"> <img src = "mouse.png"/></span>');
    alreadyCalled = true;
  }
};

MouseDancer.prototype = Object.create(Dancer.prototype);

MouseDancer.prototype.constructor = MouseDancer;

MouseDancer.prototype.step = function(){};
//MouseDancer.prototype.setPosition = function(){};
MouseDancer.prototype.lineUp = function(left){
  this.whistle();
  this.$node.animate({left: $(window).width()/2, top: $(window).height()/2});
};