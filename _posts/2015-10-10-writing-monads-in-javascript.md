---
layout: post
title: Writing Monads in JavaScript
date: 2015-10-10
---

I've recently started exploring what monads could look like in JavaScript. If you don't know what a monad is, [here is](https://www.youtube.com/watch?v=ZhuHCtR3xq8) one of my favorite videos on the topic. (Beware, it's an hour long video. And you will have to spend a little bit of time digesting his information.)

<iframe width="640" height="480" src="https://www.youtube.com/embed/ZhuHCtR3xq8" frameborder="0" allowfullscreen></iframe>

In short, a monad is a wrapper around a value that may have some unintended consequences, in order to perform composable, safe operations. Monads are constructs from functional programming, and are used everywhere in functional langauges. It's about damn time that we start taking monads seriously in JavaScript as well.

I've taken a great deal of inspiration from Scala in my approach to Monads in JavaScript. This started out as purely an expirement, but the more I work with these ideas, the more excited I am. I beleive monads are perfectly feasible, and should be used in JavaScript. Some of the benefits of Monads is they eliminate the need for a `null` value, and the need to throw errors.

## Faux-pattern matching

In Scala, you can create partial functions that match based on type, like so:

```scala
foo match {
  case Some(bar) => ???
  case None => ???
}
```

This is pretty useful for when working with algebraic types. Although we don't have such syntax in JavaScript, it's possible to do something like this:

```js
foo().match({
  Some (bar) { ... },
  None () { ... }
})
```
The drawbacks are the lack of compile-time syntax and type checks. However, it does make using Options more practical. In the same vein, here's faux-pattern matching for an Either.

```js
foo().match({
  Left (bar) { ... },
  Right (baz) { ... }
})
```

## Parsers and Serializers

I think things like Option types are totally useless unless there's an easy way to interop with vanilla JS objects. There needs to be some repeatable way to serialize and deserialize to monadic values. For example:

```json
{
  "foo": "bar",
  "biz": null
}
```

Should serialize into:

```js
{
  "foo": Some("bar"),
  "biz": None()
}
```

To that endeavor, my ideas is to create parsers based off of `Reads` objects. The API looks like this:

```js
const definition = M.define({
  "foo": M.string,
  "bar": M.define({
    "baz": Option.as(M.string)
  })
});

definition.parse({
  foo: "bar",
  bar: {
    baz: null
  }  
}).map((parsed) => ...); // here, parsed is { foo: "bar", bar: { baz: None() }}
```

In this example, the object passed to `M.define` is an object of key-`Reads` pairs. The return value of `M.define` is a reads itself, so this can be freely nested. `M` is just a placeholder name until I figure out what to call this library of mine.

For some real world examples, here's a potential way to implement it in Angular

```js
module.factory("User", function($http){
  class User {
    constructor (props) {
      angular.extend(this, props);
    }
  };

  const definition = M.define({
    firstName: M.string,
    lastName: Option.as(M.string)
  });

  /**
   * This would return a Promise<Left<Error>>, or a Promise<Right<User>>
   */
  User.find = function(id){
    return $http.get(`/users/${ id }`).then(({ data }) => {
      return definition
      .parse(data)
      .map((parsed) => new User(parsed))
    });
  };

  return User;
});
```

[Here is](https://github.com/bioball/monadia) the repository I'm currently working off of to explore all these ideas. Feel free to check out the source code, and offer suggestions. I'm quite excited about it.