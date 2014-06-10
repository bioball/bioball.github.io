describe("lineUpDancer", function(){

  var dancer1;
  var dancer2;

  beforeEach(function(){
    dancer1 = new RobotDancer(5, 5, 5000);
    dancer2 = new BlinkyDancer(42, 42, 4242);
  });

  it("should have a lineUp function", function(){
    expect(dancer.lineUp).to.be.an.instanceof(Function);
  });

  it("should change their css", function(){
    var previousCSS = dancer1.$node.css();
    dancer1.lineUp();
    expect(dancer1.$node.css() === previousCSS).to.be.false;
  });

  it("should iterate over all robots", function(){
    var dancer1CSS = dancer1.$(node).css();
    var dancer2CSS = dancer2.$(node).css();
    $('.lineUpButton').click();
    expect(dancer1.$node.css() === dancer1CSS).to.be.false;
    expect(dancer2.$node.css() === dancer2CSS).to.be.false;
  });
});