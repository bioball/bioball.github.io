/*describe("dancer", function() {

  var dancer;
  var timeBetweenSteps = 100;
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
    dancer = new Dancer(10, 20, timeBetweenSteps);
  });

  it("should have a jQuery $node object", function(){
    expect(dancer.$node).to.be.an.instanceof(jQuery);
  });
  it("should produce objects with step and setposition methods", function(){
    expect(dancer.step).to.be.an.instanceof(Function);
    expect(dancer.setPosition).to.be.an.instanceof(Function);
    });
/*
  it("should have a step function that makes its node blink", function() {
    sinon.spy(dancer.$node, 'toggle');
    dancer.step();
    expect(dancer.$node.toggle.called).to.be.true;
  });

  describe("dance", function(){
    it("should call step at least once per second", function(){
      sinon.spy(dancer, "step");
      expect(dancer.step.callCount).to.be.equal(0)
      clock.tick(timeBetweenSteps); // ? it seems an extra tick is necessary...
      clock.tick(timeBetweenSteps);

      expect(dancer.step.callCount).to.be.equal(1);

      clock.tick(timeBetweenSteps);
      expect(dancer.step.callCount).to.be.equal(2);
    });
  });
*/
//});
