---
layout: post
title: Two inane, but totally legitimate ways to write JavaScript
date: 2014-02-07
---

Don't use any of these unless you want to be punched by your co-workers/code contributors.

####1. Use a `for` loop without a body

`for` loops take three expressions--the initial condition, ending condition, and an expression to evaluate at the end of each iteration. You can actually not put anything in the curly braces entirely just by passing in a self invoking function as the third expression in a for loop. Since you have a code block at your disposal, you can do anything here that you would normally do inside the `for` loop body.

{% highlight javascript %}
var arr = [1,2,3,4];
for(var i = 0; i < arr.length; (function(){
  console.log(arr[i]);
  i++;
}()){}
// => 1
// => 2
// => 3
// => 4
{% endhighlight %}

Logically, this is identical to writing this:

{% highlight javascript %}
var arr = [1,2,3,4];
for(var i = 0; i < arr.length; i++){
  console.log(arr[i]);
}
{% endhighlight %}

####2. Use coercing operators to invoke methods on your objects.

When you compare two objects with the `==` operator, the JavaScript interpreter will try to coerce them into a certain data type. It does this in three ways:

1. It tries to determine whether they are the same object in memory (only with the equality operator)
2. It tries to call `valueOf()` on both objects
3. It tries to call `toString()` on both objects

Because JavaScript does this, and since we can define these properties ourselves, we can totally confuse the language by overwriting the latter two functions. Let's say I have a object called `bob`, which looks like this:

{% highlight javascript %}
var bob = {
  sayHi: function(){
    console.log('hi');
  },
  valueOf: function(){
    this.sayHi();
  }
};

bob.sayHi();
// => hi

bob == '1';
// => hi
// => false
{% endhighlight %}

In this scenario, writing `bob.sayHi()` and `bob == '1'` both log "hi" to the console. In fact, you don't even need the `sayHi` method, you can just define `valueOf` as a function that does whatever it is you need.

This method will work on any operator that does type coersion. This includes `<`, `>`, `<=`, `>=`, `&`, `|`, `<<` and `>>`. This will *not* work on `===`, `&&` and `||`.

*CAVEAT: There's no way to invoke* `valueOf` *with an argument.*

---

Do you know any more? I'd love to read them. [Email me](mailto:daniel.h.chao@gmail.com) with your ridiculous coding patterns.