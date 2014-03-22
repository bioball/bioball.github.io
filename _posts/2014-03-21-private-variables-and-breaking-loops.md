---
layout: post
title: Private variables in JavaScript pseudoclasses, and breaking out of `each` loops
date: 2014-03-21 14:29:00
---

Here are two things that I don't very commonly see used in JavaScript applications, but may come in extremely useful.

## "Private variables" variables for pseudoclasses

In a pseudoclassical instantiation pattern, it's quite common to see something like this:

{% highlight javascript %}
var Foo = function(){
  this._bar = 'bizzle';
  this._baz = 'drizzle';
};

Foo.prototype.doThing = function(){
  doStuffWith(this.bar);
};
{% endhighlight %}

Where, in this example, `this._bar` and `this._baz` have underscores to indicate that they are supposed to be "private" variables and shouldn't be touched. This is janky, since these variables aren't actually private. I would suggest that there is another way to do it, via getter and setter functions, and storing variables in closure.

{% highlight javascript %}
var Foo = function(){
  var stuff = {
    bar: 'bizzle',
    baz: 'drizzle'
  };
  this.set = function(attr, value){
    stuff[attr] = value;
    return value;
  };
  this.get = function(attr){
    return stuff[attr];
  };
};

Foo.prototype.doThing = function(){
  doStuffWith(this.get('bar'));
};
{% endhighlight %}

Note, the getter and setter methods cannot be on the `.prototype` of `Foo`, because in order for these variables to remain private (in closure), the methods need a direct reference to `stuff`. 
#### Pros

<ol>
  <li>
You don't expose these variables as properties of the object. This means if your code is dependent on the value of this variable, it leads to code that is harder to break. If you really don't want somebody to touch these variables, then you can even not write a setter method.

{% highlight javascript %}
var thing = new Foo();
thing.set('bar', 'bizmack');
// => "bizmack"

// the "bar" variable is not accessibile outside of the getter and setter.
thing.bar;
// => undefined

// Setting thing.bar to something else does not affect what's returned by the getter
thing.bar = 'boulder';
// => "boulder"
thing.get('bar');
// => "bizmack"
{% endhighlight %}
  </li>
  <li>
It leads to a cleaner object, and you don't have to use underscores to mark a false limiter on what properties should not be touched.
  </li>
  <li>
You can easily handle logic on change, by adding that code into the getter and setter functions.

{% highlight javascript %}
this.set = function(attr, value){
  // stuff
  event.emit('change', attr, value);
}
{% endhighlight %}
  </li>
</ol>


#### Cons

1. Every new instance of `Foo` comes with its own `get` and `set` functions. If I create 1000 objects with `new Foo()`, I also get 2000 extra functions. On a large scale, this can be expensive.
2. These variables aren't truly private, since the variables are still indirectly exposed via `get` and `set`.

So is doing this any better than just defining variables as properties of each instance of the class? That's up to you to decide.


## Breaking out of `each` loops

If you're using Array#forEach, or another utility function that repeatedly calls a callback, you can break out of it by throwing an error. This seems extremely hacky, but I think it's the only way to do it. In this example below, I simply create an object called `breaker`, and throw it to "break" out of my loop. Since my `forEach` is within a `try..catch` block, I can catch all errors and check to see if the error is my breaker.

{% highlight javascript %}
var breaker = {};
try {
  [1,2,3,4,5].forEach(function(num){
    if(num === 3){    // I picked an arbitrary point to break
      throw breaker;
    }
  })
} catch(e) {
  if(e !== breaker){
    throw e;
  }
}
{% endhighlight %}

In the catch block, it's important to throw your error again if the error is not your breaker, or handle them however you wish.

In most cases, it's completely unnecessary to write code this way. If something is going to be iterated over, it's better to just use a `for` loop and use `break`. However, sometimes it may be impossible to avoid using a `each`-style loop, and in those cases, definitely look into doing this.