---
layout: post
title: How Angular handles named parameters, and how you can too
date: 2013-12-15 14:29:00
---

The latest sprint we did at Hack Reactor was on [AngularJS](http://angularjs.org/). For the uninitiated, this is a relatively new framework introduced by the folks at Google, which has been gaining immense amounts of traction. Angular approaches JavaScript and DOM manipulation at such a different angle that it seems to break your fundamental understanding of JavaScript the first time you learn it. People start to throw around the word "magic", and something called the "Angular World" because it seems so far removed from traditional, vanilla JavaScript.

The thing about Angular (as is with anything), is that there really isn't any voodoo behind it, and once you understand concepts of a certain mechanic, it's no longer magical. In this post, I'm going to take apart how Angular handles named parameters and dependency injection, and how you can do it too in your own program.

---

### What are named parameters?

One of Angular's core concepts is that when you want to use a certian component (called services), you need to pass a specific **variable name** in your anonymous function argument. For example, if I were to write a controller and wanted to make AJAX calls, I **need** to use `$http` as an argument.[*](#note)

{% highlight javascript %}
angular.module('foo')
.controller('fooCtrl', function($http){
  // do stuff with $http
});
{% endhighlight %}

Named parameters means the name of the argument variable matters, whereas the position of the variable does not matter.

---

{% highlight javascript %}
function($http, $scope){
  // this is fine
};

function($scope, $http){
  // this is fine too
};

function(bizzle, drizzle){
  // this breaks your code unless 'bizzle' and 'drizzle' 
  // are services available to you
};
{% endhighlight %}

What?? I thought JavaScript doesn't care what variable names you pass in as arguments! Isn't named parameters **not** supported in JavaScript?

---

### Here's what's going on

Let's use take the same design pattern from Angular, and write our own program that uses named parameters. First, let's make a function that users will pass their callback function into.

{% highlight javascript %}
var injectorFn = function(callback){
  // stuff
};
{% endhighlight %}

The trick here is to call `toString()` on the callback funciton, which returns a stringified version of what the function looks like. Let's amend our function to just return `callback.toString()` for now, and see what happens when invoked.

{% highlight javascript %}
var injectorFn = function(callback){
  return callback.toString();
};

injectorFn(function(bar, baz){ return biz; })
// returns "function(bar, baz){ return biz; }"
{% endhighlight %}

Did you just realize something? Through this, we can access the names of the arguments! Furthermore, by using a little bit of regex and array splittery, we get an array of strings matching the **variable names** in our callback function.

{% highlight javascript %}
var ARG_REGEX = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

var injectorFn = function(callback){
  return callback.toString().match(ARG_REGEX);
};

injectorFn(function(bar, baz){ return biz; })
// returns ["function (bar, baz)", "bar, baz"]
{% endhighlight %}

Awesome. Now let's get that second array element, and `split` it.

{% highlight javascript %}

var injectorFn = function(callback){
  var argNames = callback.toString().match(ARG_REGEX)[1]
    .split(/,\s*/);
  return argNames;
};
// returns ["bar", "baz"]
{% endhighlight %}

---

At this point, we can easily match the strings in this array to a potential list of services available. Let's introduce two services as such:

{% highlight javascript %}
var services = {
  $bobMaker: {
    makeBob: function(){
      return {
        name: "Bob"
      }
    }
  },
  $cookieStore: {
    purchase: function(){
      return {
        cookie: "chocolate chip cookie",
      }
    },
  }
};
{% endhighlight %}

Then wire up the injectorFn to retrieve these functions after extracting `argNames`

{% highlight javascript %}
var injectorFn = function(callback){
  var argNames = callback.toString().match(ARG_REGEX)[1]
    .split(/,\s*/);
  var args = argNames.map(function(arg){
    return services[arg];
  });
  return callback.apply(null, args);
};
{% endhighlight %}

There are two new elements here:

1. Lines 4 - 6 will look up and return an array of corresponding services.
2. The callback is invoked with `apply`, which accepts an array and passes each item as an argument to the callback.

Now, let's rewrite the callback to take advantage of these two services.

{% highlight javascript %}
injectorFn(function($cookieStore, $bobMaker){
  return $bobMaker.makeBob().name + " has purchased a " 
    + $cookieStore.purchase().cookie;
})
// returns "Bob has purchased a chocolate chip cookie"
{% endhighlight %}

That's it! There's no magic here, just plain ol' JavaScript.

> Further reading: [The "Magic" behind AngularJS Dependency Injection](http://www.alexrothenberg.com/2013/02/11/the-magic-behind-angularjs-dependency-injection.html)

<small><a name="note" class="not-link">*Angular also allows dependency injection without named parameters with the use of arrays.</a></small>