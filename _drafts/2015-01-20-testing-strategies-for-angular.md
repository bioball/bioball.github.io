---
layout: post
title: Testing Strategies for AngularJS
date: 2015-01-20
---

I have to be honest. I have been developing with AngularJS for over a year now, and have only just recently been writing good test coverage for my codebase. A large part of this because when I first started writing tests for it, I found it to be too much of a black box--I didn't know how to set up my testing environment properly, didn't really know how Karma or Protractor worked, and wasn't sure how to debug it when it wasn't working properly. I would take 30 minutes trying to figure out how to write a test and make it pass. 

I'm hoping to solve that for anybody else that was in my boat one year ago. After I figured out some good strategies and patterns, I've found that testing has actually become quite easy and natural.


First off, I should mention that I think all tests in CoffeeScript, whether you normally write JavaScript or not. There is so much syntactic sugar in the language that directly benefits test writing, which I think will become more clear as this blog post goes on. In addition to synactic sugar, I think almost everybody would agree that tests should be highly fluent, and read almost like English. CoffeeScript helps that. As such all of these test cases and examples will be written in CoffeeScript.

Secondly, I like to use Mocha for all my tests. There are several reasons for this:

* Mocha was written first with Node.js in mind. It has a few more facilities that make it nice to test on Node, and has more active support on Github.
* We're not at the mercy of Pivotal to make updates/bug fixes.
* It is just a test runner, and you plug in all the other pieces yourself. Use your favorite expectations library, spies library, etc. It just tries to be the best of one world, not all of them.
* It's supported on all test frameworks, including anything you can do with Angular.
* It has pretty awesome asynchronous testing support.

In AngularJS-land, you're afforded two testing frameworks specifcally tailored for Angular applications, written by the Angular guys. One is Karma, designed for running against your JavaScript in your browser's environment. You load up your application, and load the modules into memory, and test the correctness of your functions, etc. The second is Protractor, an end-to-end testing framework that you use to verify the correctness of the browser's behavior (e.g. when this button is clicked, this thing should appear).

# Testing with Karma

In all reality, Karma is just a test runner that injects your scripts into a browser environment. A properly set up Karma environment will run your tests a multitude of browsers. It doesn't necessarily need to test Angular, you can use it to run against any other web application that you'd like.

## Setting it up

Karma comes with a command line tool that can be installed via `npm install -g karma-cli`. To start testing your web app with Karma, initialize the karma setup process by running `karma init` in the root directory of your project. Once you're through with a series of prompts, it will generate a file called `karma.conf.js`, that might look like this

```js
// Karma configuration
// Generated on Mon Nov 17 2014 14:53:51 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'public/build/js/libraries.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/build/js/application.js',
      'spec/client/unit/helpers/*.coffee',
      'spec/client/unit/**/*Spec.coffee'
    ],
    preprocessors: {
      'spec/client/unit/**/*Spec.coffee': ['coffee']
    },
    coffeePreprocessor: {
      options: {
        bare: true,
        sourceMap: false
      },
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browserNoActivityTimeout: 60000,
    browsers: ['PhantomJS', 'PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'windowww',
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

Most of this should be pretty self explanatory. Karma will load my files, as specified from the array that `files` points to, in consecutive order. Something to note here about my setup is that I preprocess all my coffeescript files into JavaScript before the tests run, using the coffee proeprocessor. To set this up, include the `karma-coffee-preprocessor` node package in the application.

I also run my tests in [PhantomJS](http://phantomjs.org/), a browser environment that doesn't actually run within a browser (you can also run your tests in Chrome, or any other browser you choose).

In this specific config, it will include any file that ends in `Spec` in the folder that I've specified.


## Testing controllers

Let's write a basic Angular application, with a controller.

```coffee
angular.module('app', [])
.controller 'cowController', [
  '$scope'
  'user'
  ($scope) ->
    $scope.user = user

    $scope.changeName = (name) ->
      user.name = $scope.name

    $scope.save = -> user.save()

]
```


I like to start all my tests with the most basic thing, and the most basic thing you can do here is to make sure it exists.


```coffee
# cowControllerSpec.coffee

describe 'Cow Controller', ->

  beforeEach module 'app'

  beforeEach inject (@user, $controller, $rootScope) ->
    @$scope = $rootScope.$new()
    @createController = (props = {}) =>
      props.$scope ||= @$scope
      props.user ||= @user
      $controller('cowController', props)

  it 'is a thing', ->
    cowController = @createController()
    expect(cowController).to.exist


```


There are a couple things to note here about the initial setup. First off, I included the angular-mocks library in my scripts, which provided some helper functions for me, including `module` and `inject`. `module` stubs out the actual angular application with several key peices replaced, a key one being the `$http` service. `inject` is a dependency injector that functions just like how dependency injector normally works in Angular apps (you provide the name of the dependency that you want as an argument name, and the name of the argument matters).

With that, I created a `@createController` helper function that creates a new instance of the controller whenever it is run. This is so I can stub out injected properties whenver I want to test something that affects the dependency.

The greatest thing about this, I think, is this line right here:

`beforeEach inject (@user) ->`

In CoffeeScript, any function argument that's prefixed with `@` gets translated from:

```coffee
(@user) ->
```

into: 

```js
function(user){
  this.user = user;
}
```

So what `inject (@user) ->` turns into, is this kind of thing.

```js
beforeEach(inject(function(user){
  this.user = user;
}));
```

Basically, any argument that's prefaced with `@` in the injector function becomes Angular dependency injection. Also, since Mocha invokes this function with `@` as the *same* context in memory object throughout the test suite, this injected dependency becomes available in our entire test.

