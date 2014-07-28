// Generated by CoffeeScript 1.7.1
(function() {
  $(function() {
    var Slider, slider;
    Slider = (function() {
      function Slider(el, toggleButton) {
        this.el = el;
        this.toggleButton = toggleButton;
        this.currentPos = 0;
        this.mcSlider = new Hammer(this.el[0]);
        this.mcButton = new Hammer(this.toggleButton[0]);
      }

      Slider.prototype.open = function() {
        this.el.css({
          transform: 'translate3d(230px, 0, 0)'
        });
        this.currentPos = 230;
        return this.toggleButton.addClass('active');
      };

      Slider.prototype.close = function() {
        this.el.css({
          transform: 'translate3d(0, 0, 0)'
        });
        this.currentPos = 0;
        return this.toggleButton.removeClass('active');
      };

      Slider.prototype.init = function() {
        this.mcSlider.on('dragstart touchstart', (function(_this) {
          return function(event) {
            return _this.handleStart(event);
          };
        })(this));
        this.mcSlider.on('dragleft dragright', (function(_this) {
          return function(event) {
            return _this.handleMove(event);
          };
        })(this));
        this.mcSlider.on('release', (function(_this) {
          return function(event) {
            return _this.handleEnd(event);
          };
        })(this));
        return this.mcButton.on('tap', (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this));
      };

      Slider.prototype.handleStart = function(event) {
        if (window.innerWidth >= 900) {
          return;
        }
        return this.el.addClass('animate');
      };

      Slider.prototype.handleEnd = function(event) {
        if (window.innerWidth >= 900) {
          return;
        }
        this.el.removeClass('animate');
        if (Math.abs(event.gesture.deltaX)) {
          if (event.gesture.direction === 'left') {
            this.close();
          }
          if (event.gesture.direction === 'right') {
            return this.open();
          }
        }
      };

      Slider.prototype.handleMove = function(event) {
        if (window.innerWidth >= 900) {
          return;
        }
        return this.el.css({
          transform: "translate3d(" + (this.currentPos + event.gesture.deltaX) + "px, 0, 0)"
        });
      };

      Slider.prototype.isOpen = function() {
        return this.currentPos > 0;
      };

      Slider.prototype.toggle = function() {
        if (this.isOpen()) {
          return this.close();
        } else {
          return this.open();
        }
      };

      return Slider;

    })();
    slider = new Slider($('body'), $('.hamburger'));
    return slider.init();
  });

}).call(this);
