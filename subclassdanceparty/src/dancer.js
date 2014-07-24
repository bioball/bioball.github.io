// Creates and returns a new dancer object that can step
var Dancer = function(top, left, timeBetweenSteps){
  // use jQuery to create an HTML <span> tag
  this.$node = $('<span class="dancer"></span>');
  this.timeBetweenSteps = timeBetweenSteps;
  // now that we have defined the dancer object, we can start setting up important parts of it by calling the methods we wrote
  // this one sets the position to some random default point within the body
  //this.step(timeBetweenSteps);
  this.setPosition(top, left);
  this.isLinedUp = false;
  this.top = top;
  this.left = left;
  this.lastCalled = new Date().getTime();
};


Dancer.prototype.step = function(timeBetweenSteps){
  // the basic dancer doesn't do anything interesting at all on each step,
  // it just schedules the next step
  var currentTime = new Date().getTime();
  var difference = currentTime - this.lastCalled;
  if (difference > 150){
    this.step();
    this.lastCalled = currentTime;
  }
};
Dancer.prototype.setPosition = function(top, left){
  /* Use css top and left properties to position our <span> tag
   * where it belongs on the page. See http://api.jquery.com/css/
   */
  var styleSettings = {
    top: top,
    left: left
  };
  this.$node.css(styleSettings);
};
Dancer.prototype.whistle = function(){
  if (this.isLinedUp){
    this.step = this.oldStep;
    $('.lineUpButton').html('Line up all the Things');
    this.isLinedUp = false;
    this.step(this.timeBetweenSteps);
  } else {
    this.oldStep = this.step;
    $('.lineUpButton').html('dance monkey dance');
    this.step = function(){};
    this.isLinedUp = true;
  }
};