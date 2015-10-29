(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var m = require('mandolin');
var Option = m.Option;
var _Some = m.Some;
var None = m.None;

$(function () {

  var currentTheme = Option.reads.getValue(window.localStorage.getItem('theme')).get();

  var reloadDisqus = function reloadDisqus() {
    window.DISQUS && window.DISQUS.reset({ reload: true });
  };

  var themesSyntaxes = {
    'default': $('<link rel="stylesheet" href="/css/syntax.css">'),
    light: $('<link rel="stylesheet" href="/css/solarized-light.css">'),
    dark: $('<link rel="stylesheet" href="/css/solarized-dark.css">')
  };

  var applyTheme = function applyTheme(theme) {
    $('head').append(themesSyntaxes[theme]);
    $('.theme-picker button[data-theme="' + theme + '"]').addClass('active');
    $('body').addClass(theme);
    reloadDisqus();
  };

  var removeTheme = function removeTheme(theme) {
    themesSyntaxes[theme].remove();
    $('.theme-picker button[data-theme="' + theme + '"]').removeClass('active');
    $('body').removeClass(theme);
  };

  currentTheme.map(applyTheme);

  $('.theme-picker button').click(function (e) {
    e.preventDefault();
    // theme is either dark, light or default.
    var theme = $(this).attr('data-theme');
    currentTheme.match({
      Some: function Some(t) {
        return t === theme ? new None() : new _Some(theme);
      },
      None: function None() {
        return new _Some(theme);
      }
    }).map(function (newTheme) {
      currentTheme.map(removeTheme);
      applyTheme(newTheme);
      currentTheme = new _Some(newTheme);
      localStorage.setItem('theme', theme);
    });
  });
});

},{"mandolin":8}],2:[function(require,module,exports){
"use strict";

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./internal/utils');

/**
 * @class Either
 * @abstract
 * 
 * A disjoint union of Left and Right, and is right-biased. `map` and `flatMap` are only called if it is a Right. 
 * This is similar to an Option, in that `Left : None :: Right : Some`. The difference is that a Left can also hold values.
 *
 * An Either does not hold two values. Rather, it holds one value, which is either a Left or a Right.
 */

var Either = (function () {
  function Either() {
    var val = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Either);

    utils.abstractClassCheck(this, Either, "Either");
    this.val = val;
  }

  _createClass(Either, [{
    key: "isLeft",
    value: function isLeft() {
      return this instanceof Left;
    }
  }, {
    key: "isRight",
    value: function isRight() {
      return this instanceof Right;
    }

    /**
     * @private
     */
  }, {
    key: "get",
    value: function get() {
      if (this.isRight()) {
        return this.val;
      }
      throw new Error("Performed a get on a Left");
    }

    /**
     * @private
     */
  }, {
    key: "getLeft",
    value: function getLeft() {
      if (this.isLeft()) {
        return this.val;
      }
      throw new Error("Performed a getLeft on a Right");
    }

    /**
     * Return a new Either based on running f.
     *
     * @example
     * Right("Barry")
     * .map((n) => n + " Bonds")
     * // => Right("Barry Bonds")
     * 
     * @param  {(A) => A} f 
     * @return {Either}
     */
  }, {
    key: "map",
    value: function map(f) {
      if (this.isRight()) {
        return new Right(f(this.val));
      }
      return this;
    }

    /**
     * Return a new Either based on running f.
     *
     * @example
     * Right("Chuck")
     * .flatMap((n) => new Right(n + " Norris"))
     * // => Right("Chuck Norris")
     * 
     * @param  {(A) => Either} f
     * @return {Either}
     */
  }, {
    key: "flatMap",
    value: function flatMap(f) {
      if (this.isRight()) {
        return this.map(f).flatten();
      }
      return this;
    }

    /**
     * Compose on the left
     *
     * @example
     * Left("Chuck")
     * .map((n) => n + " Norris")
     * // => Left("Chuck Norris")
     *
     * @param  {(A) => A} f 
     * @return {Either}
     */
  }, {
    key: "mapLeft",
    value: function mapLeft(f) {
      if (this.isLeft()) {
        return new Left(f(this.val));
      }
      return this;
    }

    /**
     * Compose on the left
     * @param  {(A) => Either} f
     * @return {Either}
     */
  }, {
    key: "flatMapLeft",
    value: function flatMapLeft(f) {
      if (this.isLeft()) {
        return this.mapLeft(f).flatten();
      }
      return this;
    }

    /**
     * Turns an Either<Either> to an Either.
     */
  }, {
    key: "flatten",
    value: function flatten() {
      if (this.isRight() && this.get() instanceof Either) {
        return this.get();
      }
      if (this.isLeft() && this.getLeft() instanceof Either) {
        return this.getLeft();
      }
      return this;
    }

    /**
     * If Left, switch to Right. If Right, switch to left.
     * @return {Either}
     */
  }, {
    key: "flip",
    value: function flip() {
      return this.isLeft() ? this.toRight() : this.toLeft();
    }
  }, {
    key: "getOrElse",
    value: function getOrElse(f) {
      if (this.isRight()) {
        return this.get();
      }
      return f(this.getLeft());
    }

    /**
     * Helper for operations on options. Calling `match` is the same thing as chaining `map` and `getOrElse`.
     * 
     * @example
     * new Right(3).match({
     *   Right (a) { return a + 5; },
     *   Left () { return 0; }
     * });
     * // => 8
     */
  }, {
    key: "match",
    value: function match(_ref) {
      var Left = _ref.Left;
      var Right = _ref.Right;

      return this.map(Right).getOrElse(Left);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.val;
    }

    /**
     * Cast this to a Right.
     * @return {Right}
     */
  }, {
    key: "toRight",
    value: function toRight() {
      return new Right(this.val);
    }

    /**
     * Cast this to a Left.
     * @return {Left}
     */
  }, {
    key: "toLeft",
    value: function toLeft() {
      return new Left(this.val);
    }

    /**
     * Cast this to an Option type. A Left becomes a None, a Right becomes a Some.
     * If this is a Left, the value will be lost.
     * 
     * @return {Option}
     */
  }, {
    key: "toOption",
    value: function toOption() {
      var _require = require('./Option');

      var Option = _require.Option;
      var Some = _require.Some;
      var None = _require.None;

      return this.match({
        Left: function Left() {
          return new None();
        },
        Right: function Right(val) {
          return new Some(val);
        }
      });
    }

    /**
     * Cast this to a Promise. A Left becomes a Promise rejection, a Right becomes a Promise resolve.
     * @return {Promise}
     */
  }, {
    key: "toPromise",
    value: function toPromise() {
      return this.match({
        Left: function Left(val) {
          return Promise.reject(val);
        },
        Right: function Right(val) {
          return Promise.resolve(val);
        }
      });
    }
  }]);

  return Either;
})();

Either.unit = function (v) {
  return new Right(v);
};

/**
 * Read in an either, given a Reads for the left, and a Reads for the right. 
 * If the reads for the right returns a Left, it will return the Reads for the left.
 *
 * @example
 * const readAsError = Reads.unit((v) => Right.unit(new Error(v)))
 * const definition = M.define({
 *   foo: Either.as(readAsError, M.number)
 * })
 *
 * definition.parse({ foo: 5 })
 * // => Right(Right(5))
 * definition.parse({ foo: "blah" })
 * // => Right(Left(Error("blah")))
 * 
 * 
 * @param  {Reads} readLeft  The Reads for the left
 * @param  {Reads} readRight The Reads for the right
 * @return {Reads}
 */
Either.as = function (readLeft, readRight) {
  var Reads = require('./Reads');
  return new Reads(function (v) {
    return readRight.map(Right.unit).flatMapLeft(function () {
      return readLeft.getValue(v).map(Left.unit);
    });
  });
};

/**
 * @class Left
 * @augments {Either}
 */

var Left = (function (_Either) {
  _inherits(Left, _Either);

  function Left(val) {
    _classCallCheck(this, Left);

    _get(Object.getPrototypeOf(Left.prototype), "constructor", this).call(this, val);
  }

  _createClass(Left, [{
    key: "toString",
    value: function toString() {
      return "Left(" + this.val + ")";
    }
  }]);

  return Left;
})(Either);

Left.unit = function (v) {
  return new Left(v);
};

/**
 * @class Right
 * @augments {Either}
 */

var Right = (function (_Either2) {
  _inherits(Right, _Either2);

  function Right(val) {
    _classCallCheck(this, Right);

    _get(Object.getPrototypeOf(Right.prototype), "constructor", this).call(this, val);
  }

  _createClass(Right, [{
    key: "toString",
    value: function toString() {
      return "Right(" + this.val + ")";
    }
  }]);

  return Right;
})(Either);

Right.unit = function (v) {
  return new Right(v);
};

module.exports = { Either: Either, Left: Left, Right: Right };
},{"./Option":3,"./Reads":5,"./internal/utils":6}],3:[function(require,module,exports){
'use strict';

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var utils = require('./internal/utils');
var Reads = require('./Reads');

var _require = require('./Either');

var Left = _require.Left;
var Right = _require.Right;
var Either = _require.Either;

/**
 * @class Option
 * @abstract
 * A monadic type for values that might not exist. Using Options eliminates the need to use a null value.
 * 
 * This library is heavily inpsired by Scala's native Option type.
 */

var Option = (function () {
  function Option() {
    var val = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Option);

    utils.abstractClassCheck(this, Option, "Option");
    this.val = val;
  }

  /**
   * Generic Reads for the option type.
   * @return {Right<Option>}
   */

  _createClass(Option, [{
    key: 'isSome',
    value: function isSome() {
      return this instanceof Some;
    }
  }, {
    key: 'isNone',
    value: function isNone() {
      return this instanceof None;
    }

    /**
     * @private
     */
  }, {
    key: 'get',
    value: function get() {
      if (this.isSome()) {
        return this.val;
      }
      throw new Error("Performed a get on a None type");
    }

    /**
     * Return a new option type based on running f.
     *
     * @example
     * Some("Barry")
     * .map((n) => n + " Bonds")
     * // => Some("Barry Bonds")
     * 
     * @param  {(A) => A} f 
     * @return {Option[A]}
     */
  }, {
    key: 'map',
    value: function map(f) {
      if (this.isSome()) {
        return new Some(f(this.val));
      }
      return this;
    }

    /**
     * Return a new option type given a function that returns an Option type.
     *
     * @example
     * Some(5).flatMap((val) => new Option(val + 4))
     * // => Some(9)
     * 
     * @param  {(A) => new Option(A)} f
     * @return {A}
     */
  }, {
    key: 'flatMap',
    value: function flatMap(f) {
      if (this.isSome()) {
        return this.map(f).flatten();
      }
      return this;
    }

    /**
     * Turns Option(Option<A>) into Option<A>. Will not flatten deeply.
     * @return {Option}
     */
  }, {
    key: 'flatten',
    value: function flatten() {
      if (this.isSome() && this.get() instanceof Option) {
        return this.get();
      }
      return this;
    }

    /**
     * If this is a some, returns the value. Otherwise, returns the return value of `f`.
     *
     * @example
     * None().map((val) => val + "foo")
     * .getOrElse("Bayview Hunter's Point")
     * // => "Bayview Hunter's Point"
     * 
     * @param  {[type]} f [description]
     * @return {[type]}   [description]
     */
  }, {
    key: 'getOrElse',
    value: function getOrElse(f) {
      if (this.isSome()) {
        return this.get();
      }
      return f();
    }

    /**
     * Helper for operations on options. Calling `match` is the same thing as chaining `map` and `getOrElse`.
     * 
     * @example
     * new Some(3).match({
     *   Some (a) {
     *     return a + 5;
     *   },
     *   None () {
     *     return 0;
     *   }
     * });
     * // => 8
     * 
     * @param  {(A) => A} options.some    
     * @param  {() => A} options.none
     * @return {A} The value itself.
     */
  }, {
    key: 'match',
    value: function match(_ref) {
      var Some = _ref.Some;
      var None = _ref.None;

      return this.map(Some).getOrElse(None);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.val;
    }

    /**
     * Coerce this to an Either. A Some becomes a Right, a None becomes a Left with no value.
     * @return {Either<null, A>}
     */
  }, {
    key: 'toEither',
    value: function toEither() {
      return this.match({
        Some: function Some(val) {
          return new Right(val);
        },
        None: function None() {
          return new Left();
        }
      });
    }

    /**
     * Cast this to a Promise. A None becomes a Promise rejection, a Some becomes a Promise resolve.
     * @return {Promise}
     */
  }, {
    key: 'toPromise',
    value: function toPromise() {
      return this.match({
        None: function None() {
          return Promise.reject();
        },
        Some: function Some(val) {
          return Promise.resolve(val);
        }
      });
    }
  }]);

  return Option;
})();

Option.reads = new Reads(function (val) {
  var opt = val === null || val === undefined ? new None() : new Some(val);
  return new Right(opt);
});

/**
 * Composes a Read for an arbitrary type with a Read for an Option type.
 *
 * @example
 * // Generic Read for Option of a String
 * Option.as(M.string)("foo") // => Some("foo")
 * Option.as(M.string)() // => None()
 *
 * // Read to perform an intanceof check
 * Option.as(M.instance(User))(new User()) // => Some(User())
 *
 * // Reads for only odd integers
 * Option.as(new Reads((val) => val % 2 ? new Right(val) : new Left(val)))
 * 
 * @param  {Read} read A Reads for this type of value.
 * @return {Read}
 */
Option.as = function (read) {
  return read.map(Some.unit).mapLeft(None.unit);
};

/**
 * Wrap a value in a Some
 */
Option.unit = function (val) {
  return new Some(val);
};

/**
 * @class Some. 
 * Holds a value, but has no opinion on what that value is. The value can even be undefined.
 * 
 * @augments {Option}
 */

var Some = (function (_Option) {
  _inherits(Some, _Option);

  function Some(val) {
    _classCallCheck(this, Some);

    _get(Object.getPrototypeOf(Some.prototype), 'constructor', this).call(this, val);
  }

  _createClass(Some, [{
    key: 'toString',
    value: function toString() {
      return 'Some(' + this.val + ')';
    }
  }]);

  return Some;
})(Option);

Some.unit = function (val) {
  return new Some(val);
};

/**
 * @class None
 * Holds no value.
 *
 * @augments {Option}
 */

var None = (function (_Option2) {
  _inherits(None, _Option2);

  function None() {
    _classCallCheck(this, None);

    _get(Object.getPrototypeOf(None.prototype), 'constructor', this).call(this);
  }

  _createClass(None, [{
    key: 'toString',
    value: function toString() {
      return "None()";
    }
  }]);

  return None;
})(Option);

None.unit = function () {
  return new None();
};

module.exports = { Option: Option, Some: Some, None: None };
},{"./Either":2,"./Reads":5,"./internal/utils":6}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./Either');

var Either = _require.Either;
var Left = _require.Left;
var Right = _require.Right;

var utils = require('./internal/utils');
var Reads = require('./Reads');

/**
 * Responsible for taking an object of key -> Read pairs, and parsing an object out.
 *
 * A Parser is just a Reads, that has special rules around how it handles `getValue`. Parsers can be nested.
 * A Parser keeps track of its path, so the route to an unsuccessful parse is displayed to the user.
 * 
 * Parsers shouldn't need to be expoesd to the user. Instead, users should use `M.define` to instantiate a Parser.
 * 
 * @example
 * const definition = M.define({
 *   "firstName": M.string,
 *   "lastName": M.string,
 *   "email": Option.as(M.string),
 *   "address": M.define({
 *     "street1": M.string
 *   })
 * });
 *
 * definition.parse({
 *  "firstName": "Bob",
 *  "lastName": "Cassidy",
 *  "email": null,
 *  "address": {
 *    "street1": "123 Fake St"
 *  }
 * }).map((obj) => console.log(obj))
 * // => { "firstName": "Bob", "lastName": "Cassidy", "email": None() }
 */

var Parser = (function (_Reads) {
  _inherits(Parser, _Reads);

  function Parser() {
    var definition = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var path = arguments.length <= 1 || arguments[1] === undefined ? ["obj"] : arguments[1];

    _classCallCheck(this, Parser);

    _get(Object.getPrototypeOf(Parser.prototype), 'constructor', this).call(this);
    this.definition = definition;
    this.path = path;
  }

  /**
   * @override
   */

  _createClass(Parser, [{
    key: 'getValue',
    value: function getValue(target) {
      return this.parse(target);
    }

    /**
     * This is for error debugging when a parse fails.
     */
  }, {
    key: 'setPath',
    value: function setPath(name) {
      return new Parser(this.definition, this.path.concat([name]));
    }

    /**
     * @private
     */
  }, {
    key: 'getRead',
    value: function getRead(read, key) {
      return read instanceof Parser ? read.setPath(key) : read;
    }

    /**
     * @private
     */
  }, {
    key: 'applyErrorPath',
    value: function applyErrorPath(key) {
      var _this = this;

      return function (err) {
        var route = _this.path.concat([key]).join(".");
        return new Error(route + ': ' + err.message);
      };
    }

    /**
     * @param  {Object} target  The object that needs to be parsed
     * @return {Either<Error, A>}
     */
  }, {
    key: 'parse',
    value: function parse() {
      var _this2 = this;

      var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return utils.reduce(Object.keys(this.definition), function (result, key) {
        if (result.isLeft()) {
          return result;
        }
        var read = _this2.definition[key];
        var value = target[key];
        return result.flatMap(function (obj) {
          return _this2.getRead(read, key).getValue(value).map(function (v) {
            return utils.extend(obj, _defineProperty({}, key, v));
          });
          // .mapLeft(this.applyErrorPath(key));
        });
      }, new Right({}));
    }
  }]);

  return Parser;
})(Reads);

;

module.exports = Parser;
},{"./Either":2,"./Reads":5,"./internal/utils":6}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('./Either');

var Left = _require.Left;
var Right = _require.Right;

var utils = require('./internal/utils');

var Reads = (function () {
  /**
   * @param  {(Any) => Either} reader 
   */

  function Reads(reader) {
    _classCallCheck(this, Reads);

    this.reader = reader;
    this.getValue = this.getValue.bind(this);
    this.map = this.map.bind(this);
  }

  /**
   * Compose on a successful read.
   * @param  {(A) => A} r The next reader to perform
   * @return {Reads}
   */

  _createClass(Reads, [{
    key: 'map',
    value: function map(f) {
      var _this = this;

      return new Reads(function (v) {
        return _this.getValue(v).map(f);
      });
    }

    /**
     * Compose on a successful read.
     * @param  {(A) => Either} r The next reader to perform
     * @return {Reads}
     */
  }, {
    key: 'flatMap',
    value: function flatMap(f) {
      var _this2 = this;

      return new Reads(function (v) {
        return _this2.getValue(v).flatMap(f);
      });
    }

    /**
     * Compose on an unsuccessful read.
     * @param  {(A) => A} r The next reader to perform
     * @return {Reads}
     */
  }, {
    key: 'mapLeft',
    value: function mapLeft(f) {
      var _this3 = this;

      return new Reads(function (v) {
        return _this3.getValue(v).mapLeft(f);
      });
    }

    /**
     * Compose on an unsuccessful read.
     * @param  {(A) => Either<A>} r The next reader to perform
     * @return {Reads}
     */
  }, {
    key: 'flatMapLeft',
    value: function flatMapLeft(f) {
      var _this4 = this;

      return new Reads(function (v) {
        return _this4.getValue(v).flatMapLeft(f);
      });
    }

    /**
     * Compose one read with another.
     * @param {Reads} r 
     * @return {Reads}
     */
  }, {
    key: 'chain',
    value: function chain(r) {
      return this.flatMap(r.getValue);
    }

    /**
     * Compose one read with another on the left.
     * @param {Reads} r 
     * @return {Reads}
     */
  }, {
    key: 'chainLeft',
    value: function chainLeft(r) {
      return this.flatMapLeft(r.getValue);
    }

    /**
     * Return the result of running the reader.
     * @return {Either}
     */
  }, {
    key: 'getValue',
    value: function getValue(v) {
      return this.reader(v);
    }
  }]);

  return Reads;
})();

Reads.unit = function (reader) {
  return new Reader(reader);
};

module.exports = Reads;
},{"./Either":2,"./internal/utils":6}],6:[function(require,module,exports){
"use strict";

var each = function each(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i], i);
  }
};

var map = function map(arr, fn) {
  var result = [];
  each(arr, function (element, i) {
    return result[i] = fn(element, i);
  });
  return result;
};

var reduce = function reduce(arr, fn, seed) {
  var result = seed;
  each(arr, function (element, i) {
    return result = fn(result, element, i);
  });
  return result;
};

var abstractClassCheck = function abstractClassCheck(currentThis, target, name) {
  if (currentThis.constructor === target) {
    throw new Error("Cannot instantiate abstract class " + name);
  }
};

var extend = function extend(obj1) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  var extendOnce = function extendOnce(a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a;
  };
  return reduce(rest, extendOnce, obj1);
};

var capitalize = function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
};

module.exports = { each: each, reduce: reduce, abstractClassCheck: abstractClassCheck, extend: extend, capitalize: capitalize };
},{}],7:[function(require,module,exports){
/**
 * @fileOverview 
 * Utility toolbelt. This is where M.define, M.string, M.instance, etc, are defined.
 */
'use strict';

var Reads = require('./Reads');
var Parser = require('./Parser');
var utils = require('./internal/utils');

var _require = require('./Either');

var Either = _require.Either;
var Left = _require.Left;
var Right = _require.Right;

/**
 * Return a new parser with a definition.
 *
 * @example
 * M.define({
 *   foo: M.define({
 *     bar: M.string
 *   })
 * })
 * 
 * @param  {Object} definition An object of key-value pairs. Each value needs to be a Reads.
 * @return {Parser}
 */
module.exports.define = function (definition) {
  return new Parser(definition);
};

/**
 * Return a reads that performs an instanceof check.
 * @param  {Constructor} T
 * @return {Reads}
 */
module.exports.instance = function (T) {
  return new Reads(function (v) {
    if (v instanceof T) {
      return new Right(v);
    }
    return new Left(new Error('Expected an instance of ' + T + ', but instead got ' + v));
  });
};

/**
 * Define baked-in Reads for JavaScript primitives.
 *
 * M.string
 * M.boolean
 * M.number
 * M.object
 * M.undefined
 * M.null
 * M.array
 */
utils.each(["string", "boolean", "number", "object", "null", "undefined"], function (t) {
  module.exports[t] = new Reads(function (v) {
    if (typeof v === t) {
      return new Right(v);
    }
    return new Left(new Error('Attempted to read value as ' + utils.capitalize(t) + ', but instead got ' + v));
  });
});

module.exports.array = new Reads(function (v) {
  if (Array.isArray(v)) {
    return new Right(v);
  }
  return new Left(new Error('Attempted to read value as Array, but instead got ' + v));
});
},{"./Either":2,"./Parser":4,"./Reads":5,"./internal/utils":6}],8:[function(require,module,exports){
/**
 * Mandolin
 * @author Daniel Chao
 *
 * Mandolin is a library that provides Monadic data types, as well as an easy way to interop with them.
 */

'use strict';

var _require = require('./dist/Option');

var Option = _require.Option;
var Some = _require.Some;
var None = _require.None;

var _require2 = require('./dist/Either');

var Either = _require2.Either;
var Left = _require2.Left;
var Right = _require2.Right;

var Parser = require('./dist/Parser');
var Reads = require('./dist/Reads');
var utils = require('./dist/internal/utils');
var utility = require('./dist/utility');

module.exports = utils.extend(utility, { Option: Option, Some: Some, None: None, Either: Either, Left: Left, Right: Right, Parser: Parser, Reads: Reads });
},{"./dist/Either":2,"./dist/Option":3,"./dist/Parser":4,"./dist/Reads":5,"./dist/internal/utils":6,"./dist/utility":7}]},{},[1]);
