---
layout: post
title: Thoughts for a new coding style for declaring arguments 
date: 2015-03-04
---

I've been slightly unhappy with the way I handle argument paramters in JavaScript for a while now. The problem is, it can be hard to read what the code is actually doing when reading function declaractors or invocations. For example, let's say we have the following function

```js
var stomp = function(cow, speed, delay){
  return cow.stomp(speed, delay);
};
```

In a real application, the definition of this function is likely going to be in a completely separate file. And when you call your method, it would look something like this.

```js
getCow()
.then(function(betsy){
  stomp(betsy, 300, 0.5);
});
```

When reading this, you'd have no idea what `300` or `0.5` are supposed to represent. And it won't be until you check the source code for `stomp` that you figure it out.

I'm thinking that functions should be written this way:

```js
var stomp = function(args){
  var 
    cow = args.cow,
    speed = args.speed,
    delay = args.delay;
  stomp(cow, speed, delay);
}
```

Then when you call it, it would look like so:

```js
getCow()
.then(function(betsy){
  stomp({ cow: betsy, speed: 300, delay: 0.5 });
});
```

This coding style annotates itself. Much easier to read than previously. There still is a problem, though. Defining these functions still suck. What used to be one line of code is now 5. If you're writing ES5 JavaScript, unfortunately there's no fix for this. However, with ES6 and CoffeeScript, you can do this kind of thing:


CoffeeScript

```coffee
stomp = ({ cow, speed, delay }) ->
  cow.stomp(speed, delay)
```

ES6

```js
var stomp = ({ cow, speed, delay }) => {
  return cow.stomp(speed, delay)
}
```

Two negative side-effects of this approach:

1. Any time you call a function, you're creating a new object in memory. It's slightly more expensive.

2. Error messages will be things like "Cannot read property cow of undefined" if an argument isn't passed in.
