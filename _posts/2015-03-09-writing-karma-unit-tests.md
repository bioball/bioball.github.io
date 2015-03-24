---
layout: post
title: Writing Angular unit tests with Karma
date: 2015-03-09
---

> DISCLAIMER: All the examples in this blog post are written in CoffeeScript.

I've written some pretty terrible unit tests in my days, and through trial and error, I've slowly improved the way I write unit tests for what I do. I haven't really found a good, comprehensive blog post anywhere that guides you on how to write Karma unit tests for an Angular app, so I thought I'd try and fill the void.

The base libraries that I always use with my unit tests are Mocha, Sinon, Chai, Browserify, CoffeeScript and PhantomJS. I've found that these best suit my needs and are easiest to work with and debug.

### Mocha

Really, either Mocha or Jasmine should be just fine. However, with Mocha, we're not dependent on an organization like Pivotal to release updates to the software. Also, with Mocha's modular nature, you use Mocha mostly for test structure, and depend other libraries for things like writing expectations or spies. Mocha does a great job of being a test runner.

### Sinon

This is the most used and most supported spy/stub framework out there. It also hooks into Chai really well with [sinon-chai](https://github.com/domenic/sinon-chai).

### Chai

Offers three different flavors of expectations--`expect`, `should` and `assert`. Chai is very easily extensible, and is pretty amazing when combined with things like [sinon-chai](https://github.com/domenic/sinon-chai) and [chai-as-promised](https://github.com/domenic/chai-as-promised/).

### Browserify

Karma tests run in the browser, which means you can't `require` modules into your javascript. Except you can. With Browserify. And Karma has a [browserify extension](https://github.com/Nikku/karma-browserify). Instead of depending on variables being in global scope, you can write much more declaratively. It makes it transparent where you fixtures come from, your helper functions, etc.

### CoffeeScript

I write all my tests in CoffeeScript, even if my project is written in JavaScript. It makes sharing scope a breeze with `@` shorthand for `this` bindings, and reads more like English.

### PhantomJS

[PhantomJS](http://phantomjs.org/) is a headless browser that runs without opening any GUI. It runs on the V8 engine, so you can load all your application's JavaScript into it and test to ensure correctness. Outside of not having a GUI, it exposes all browser-level APIs to replicate a normal browser environment. I use this to speed up my testing process, as PhantomJS is faster to spin up and spin down than an actual browser.

# Directory Structure

The base directory structure looks like this

```text
|-- spec/ 
    |-- controllers/
        |-- fooControllerSpec.coffee
        |-- barControllerSpec.coffee
    |--- services/
        |-- cowServiceSpec.coffee
        |-- potatoServiceSpec.coffee
    |--- directives/
        |-- spackleDirectiveSpec.coffee
    |--- fixtures/
        |-- users.coffee
        |-- cookies.cofee
|-- karma.conf.js
```

And karma.conf.js looks like this

```js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'mocha', 'chai-things', 'sinon-chai', 'chai-as-promised'],
    files: [
      'public/build/js/application.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'spec/**/*Spec.coffee'
    ],
    reporters: ['mocha'],
    preprocessors: {
      'spec/**/*.coffee': ['browserify']
    },
    browserify: {
      transform: ['coffeeify'],
      extensions: ['.coffee']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browserNoActivityTimeout: 60000,
    browsers: ['PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          settings: {
            webSecurityEnabled: false
          }
        }
      }
    },
    singleRun: true
  });
};
```

Couple of things to point out here:

1.  I've added a bunch of plugins into Karma to help with testing. They'll need to be installed with NPM. The packages are: 
    * [karma-browserify](https://www.npmjs.com/package/karma-browserify)
    * [karma-mocha](https://www.npmjs.com/package/karma-mocha)
    * [karma-chai-things](https://www.npmjs.com/package/karma-chai-things)
    * [karma-sinon-chai](https://www.npmjs.com/package/karma-sinon-chai)
    * [karma-chai-as-promised](https://www.npmjs.com/package/karma-chai-as-promised)

2.  I've set `singleRun` to true, which means Karma will boot up, run all my unit tests, then close down again.
3.  I'm using `PhantomJS_custom` as my browser. I'm actually not sure if this is necessary. It's also an npm package: [karma-phantomjs-launcher](https://www.npmjs.com/package/karma-phantomjs-launcher)
4.  I'm using the Mocha reporter. It looks pretty.

We want Karma to bundle our test files every time our tests are run, and serve them to the browser. To run tests, run this command:

```bash
karma start
```


# Testing Controllers

So let's say we have an Angular controller that looks like this. Let's assume that the `user` injection is the result of an Angular route resolve, so it's not actually a service. 

```coffee
class PotatoController
  constructor: (@$scope, @user) ->

  feedPotatoes: ->
    unless user.full
      @user.feed('potatoes')

angular.module('barn')
.controller('PotatoController', PotatoController)
```

Here's how I'd set up the unit test:

```coffee
users = require '../fixtures/users'

describe 'Potato Controller', ->
  
  beforeEach angular.mock.module 'barn'

  # Using @ in the paramter position is shorthand for assigning it to self. It's equivalent to this:
  # (User) ->
  #   @User = User

  beforeEach inject (@$rootScope, @User, $controller) ->
    @$scope = @$rootScope.$new()
    @createController = (props = {}) =>
      props.$scope ||= @$scope
      props.user ||= new @User(users[0])
      $controller('PotatoController', props)
```

`angular.mock.module` and `inject` are global functions provided by [angular-mock](https://docs.angularjs.org/api/ngMock), which can be install via Bower, included via a CDN, or just loaded in via node.

`inject` is a special function that provides dependency injection, just like how dependency injection works in Angular controllers and services. It either returns your working function with your services bound to it, or invokes your working function with the services, depending on what environment it's declared in. 

> `module` and `angular.module.module` are aliases, and so are `inject` and `angular.mock.inject`. However, in my tests, the `module` variable is overwritten by Browserify.


```coffee

beforeEach ->
  inject ($rootScope) ->
    # this will be invoked immediately

beforeEach inject ($rootScope) ->
  # this will *return* the working function to Mocha's beforeEach.

```

We defined a `@createController` function in our `beforeEach` method, because sometimes we want to test the behavior of the controller depending on what was injected into the controller. Also, notice that the `@createController` method accepts optional arguments to be injected into the controller, so we can easily change what the controller the contents of the controller's dependencies.


```coffee
users = require '../fixtures/users'

describe 'Potato Controller', ->
  
  beforeEach angular.mock.module 'barn'

  beforeEach inject (@$rootScope, @User, $controller) ->
    @$scope = @$rootScope.$new()
    @createController = (props = {}) =>
      props.$scope ||= @$scope
      props.user ||= new @User(users[0])
      $controller('PotatoController', props)

  describe 'it has these methods', ->
    controller = @createController()
    expect(controller).to.respondTo('feedPotatoes')

  describe 'feeding', ->

    beforeEach ->
      sinon.spy(@User.prototype, 'feed')

    afterEach ->
      @User.prototype.feed.restore()

    it 'feeds the user if it is not full', ->
      # let's assume users[2] is an object that describes a user that isn't full
      user = new @User(users[2])
      ctrl = @createController({ user })
      ctrl.feedPotatoes()
      expect(@User.prototype.feed).to.have.been.called
      expect(@User.prototype.feed).to.have.been.calledWith('potatoes')

    it 'does not feed the user if it is full', ->
      user = new @User(users[2])
      ctrl = @createController({ user })
      ctrl.feedPotatoes()
      expect(User.prototype.feed).to.not.been.called

```

See how great our expectations read, with `sinon`, `chai` and `sinon-chai`? Even better, if this errors, we'll get descriptive error messages about our expectation.

Also, note that I wrote tests expecting certain methods to be on the controller. This is pretty important, as when you continually iterate on your application, if you ever remove any method signatures, your tests will force you to think about why you're removing them.

Another important note here: Mocha invokes all functions with the same `this` object. This means that we can share scope between our tests without doing something silly like this, where you depend on closures:


```coffee
$scope = undefined

beforeEach inject ($rootScope) ->
  $scope = $rootScope.$new()
```

I see this style of scoping in almost every example that I can find about Angular unit testing. I find it clunky and hard to write. Every time you want to introduce a new dependency across tests, you have to declare it in two places. It's much easier if you just bind everyting to `this`.


# Testing methods that return promises

So let's say you have some server-side logic, or are using some other library that returns promises. I typically treat async testing in my apps like this:

1. Move all asynchronous logic for handling/rejecting promises into a service
2. Stub out all async calls in my controller with already resolved or rejected promises
3. Write unit tests around the async logic for the service itself

I feel like this is the most sensible seperation of concerns. With asynchronous methods, you probably have an HTTP component in it, which means you'd want to write tests to make expectations about HTTP calls. Writing expectations for HTTP calls is a pain, so it's better to seperate logic around HTTP calls into its own service, and test the rest of the application flow around it.

Here's a sample file that interacts with some async thing.

```coffee
class MooController
  constructor: (@cowService) ->
    @amountOfGrass = 0

  eatGrass: ->
    @cowService.eat('grass')
    .then (amountEaten) =>
      @amountOfGrass += amountEaten
    .catch (err) =>
      @error = err.message
    .finally => @

angular.module('barn')
.controller('MooController', MooController)

```

Here's a test for it:

```coffee
describe "Moo Controller", ->
  
  beforeEach angular.mock.module 'barn'

  beforeEach inject (@$rootScope, $controller) ->
    @$scope = $rootScope.$new()
    @createController = (props = {}) =>
      props.$scope ||= @$scope
      $controller('MooController', props)

  describe "eating grass", ->

    beforeEach inject (@cowService, @$q) ->
      @eatGrass = sinon.stub(@cowService, 'eat')

    it "adds the amount of grass eaten to its total", (done) ->
      @eatGrass.returns(@$q.when(460))
      controller = @createController()
      expect(controller.eatGrass()).to.eventually.have.property('amountOfGrass', 460).and.notify(done)
      @$rootScope.$apply()

    it 'has an error if something went wrong', (done) ->
      @eatGrass.returns(@$q.reject(message: "Cow is too full dammit"))
      controller = @createController()
      expect(controller.eatGrass()).to.eventually.have.property("error", "Cow is too full dammit").and.notify(done)
      @$rootScope.$apply()

```

So when I return promises, I stub the function out, and return it with either `@$q.when` or `@$q.reject`. These two methods return Q promises that have already resolved, and have the full promise API.

I also return `@` in these promises, so it's a lot easier to write tests for. Using [chai-as-promised](https://github.com/domenic/chai-as-promised/), I can set expectations for the resolve value of a promise. How cool is that? Instead of doing this:

```coffee
eatGrass()
.then (ctrl) ->
  expect(ctrl).to.have.property('amountOfGrass', 460)
```

It turns into:

```coffee
expect(eatGrass()).to.eventually.have.property('amountOfGrass', 460)
```

At the end of each test, you'll need to call `@$rootScope.$apply()`, because Angular's `$q` is wrapped around its digest cycle. These promises don't resolve until the digest cycle runs at least once.

> NOTE: chai-as-promised expectations return promises, so if your testing framework supports promises natively, you don't need to call `.and.notify(done)`. Mocha does support promises natively. However, I think it's easier to still use `.and.notify` syntax because you need to call `$rootScope.$apply()` after invoking the promise.

# Testing HTTP Calls

I hate testing HTTP calls, and still don't fully understand it. With testing HTTP calls in Angular, you'll need to use the `$httpBackend` service, which stubs out the backend. Furthermore, it makes your tests *synchronous*, even if the code you're testing is asynchronous. Except every time I write these things, I spent three times the amount debugging my test. And the error messages suck when something is wrong. Why not just make everything asynchronous, Angular? Ugh.

Nevertheless, this is the kind of thing that I do.

```coffee
# cowService.coffee

angular.module('barn')
.factory('cowService', [
  '$http'
  ($http) ->
    eat: (type) ->
      $http.post('/api/cows/eat', { type })
      .success (data) =>
        @totalEaten += data.amount
        amount: data.amount
    totalEaten: 0
])

```

```coffee
# cowServiceSpec.coffee

describe 'cowService', ->

  beforeEach angular.mock.module "barn"
  
  beforeEach inject (@$httpBackend, @cowService) ->

  afterEach ->
    @$httpBackend.verifyNoOutstandingExpectation()
    @$httpBackend.verifyNoOutstandingRequest()

  describe 'eating', ->
    it 'makes GET requests to the backend', ->

      # this is an expectation. It will throw an error if it is not met.
      @$httpBackend.expectPOST("/api/cows/eat")
      .respond(200, amount: 300)
      @cowService.eat('grass')
      @$httpBackend.flush()

    it 'makes GET requests with a JSON body with key "type"', ->

      # the anonymous function passed in as the second parameter is another assertion I can make. Return true to pass, return false to fail.
      # It receives the body of my request, and if it is JSON, it's passed in object format.
      @$httpBackend.expectPOST("/api/cows/eat", (body) -> body.type is "grass")
      .respond(200, amount: 300)
      @cowService.eat('grass')
      @$httpBackend.flush()

```

**IMPORTANT**: you must specify a response when declaring an http expectation, otherwise you will get an error that there were no pending requests to flush. So you must chain `.respond` any time you declare `expect<VERB>`.

With the `$httpBackend`, you can write expectations on the requests that your app makes to the serve by using their `$httpBackend.expect<VERB>` API. You can also change your mock backend's responses like so:

```coffee
beforeEach inject (@$httpBackend, @cowService) ->
  @backend = $httpBackend.whenGET("/api/cows/eat")

afterEach ->
  @$httpBackend.verifyNoOutstandingExpectation()
  @$httpBackend.verifyNoOutstandingRequest()

it "sets total eaten to 350 when server returns 350", ->
  @backend.respond(200, amount: 350)
  @cowService.eat('grass')
  @$httpBackend.flush()
  expect(@cowService.totalEaten).to.equal(350)

it "sets total eaten to 500 when serve returns 500", ->
  @backend.respond(200, amount: 500)
  @cowService.eat('grass')
  @$httpBackend.flush()
  expect(@cowService.totalEaten).to.equal(500)

```

---

Just to add some final thoughts in here: I think good code is easily testable code. If you're finding that you're not writing as many tests because it's too hard to write tests to your code, it's probably time to refactor to make it more easily testable. I think having good test coverage comes down to these two factors:

1. Writing code in a way that's easily testable
2. Having a good understanding of how to write tests for your code


Cheers!
