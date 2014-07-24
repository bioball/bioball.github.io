---
layout: post
title: First day impressions at Famo.us
date: 2014-01-15 01:00:00
---

If you told me a year ago that I would be invited to part the private beta of one of the most highly ancticipated and promising web technologies to come out, I would never have believed you. Hell, I didn't even know what a variable was. Yet, here I am, in a position that many software engineers much more talented than me would die to be in.

[Famo.us](http://famo.us/) is a new JavaScript library that provides dynamic, physics-based DOM rendering. As far as I can tell, it uses uses `requestAnimationFrame` to render animations onto the DOM, and ports all of its physics calculations to the GPU in the back end. The GPU returns a matrix position for each DOM element, so by the time the element is rendered onto the page, all the browser needs to do is position the DOM element exactly where it is told.

The way elements are rendered in Famo.us is a complete paradigm shift from traditional HTML. There is no DOM tree heiarchy, and each element is essentially thrown into a heap, with 3d matrix transform properties that tell the browser where to put it. Things like rendering elements relative or static are thrown out the window, as all objects are absolute position and not within the document flow.

I spent most of the day reviewing past applications that have been written in Famo.us, and my first impression is that they are all extremely verbose. Famo.us has built an incredible amount of modules and uses require.js, and any application will need at least 7 or 8 modules, which means even the simplest app will end up with around 30 lines of code. It's not immediately clear whether this is just a coding style, or whether the nature of the framework requires that applications be written this way.

