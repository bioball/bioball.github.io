---
layout: post
title: Initial impressions at famo.us
date: 2014-01-16 08:00:00
---

Recently, I've had the amazing opportunity to work at the [Famo.us](http://famo.us/) headquarters to take part of their private beta program. It's been a thrill so far, and every day has been both an absolute struggle and joy.

Famo.us is a new JavaScript framework that may just fundamentally change how we write JavaScript for mobile and web. It is roughly 3.47 paradigm shifts away from traditional JavaScript frameworks, and doesn't follow *any* conventions that were previously laid down.

In a nutshell, famo.us gives you the ability to create objects with various physics/properties. Famo.us injects a heap of divs onto the page, and tells the browser exactly where to position each of these divs using a matrix3d CSS property that it has already calculated. All of the hard word of animation is offloaded to the CPU/GPU, leading to extremely smooth animations.

---

Here are a couple of takeaways that I've gathered so far. Take these with a certain grain of salt, since it's only my third day working with the framework.

### 1. Famo.us is a framework, but not an MVC framework

I've been spending a good portion of the last three days trying to figure out how to best modularize my application, but it's still not immediately clear to me. I've gone through a lot of demos in Famo.us's private repositories, but none of them use any clear modular app structure. You are able to render different "pages" in famous, but they don't use any routes, and logic/data are so closely intertwined that it's hard to split them apart.

### 2. Famo.us is extremely verbose. Too much to my liking

Yesterday night I wrote a short application that rendered two circles and a box, connected by springs. It was 123 lines long. There are so many modules that go into their environment that even things that seems simple conceptually take a lot of lines to write. Some modules are closely intertwined with each other, so in my opinion, it would make sense for Famo.us to just combine them.

Tying this into my first point, I find myself wanting to split one single page up into multiple files, simply because they tend to be *so* verbose.

### 3. You can create a Famo.us context for just one section of your website

It's actually possible to target a div when you create a Famous context (as of right now). When Famo.us eventually gets released, I think the biggest use case for it will be to render a Famo.us context just within a div, and have the rest of the web application be controlled by Backbone, Angular, Rails, or whatever other framework you may be using. Using Famo.us to render your entire application is simply too great a shift for most people to be comfortable with.

### 4. Don't expect to understand Famo.us by drawing comparisons to an existing web library/framework.

The engineers at Famo.us have modeled their framework after videogame frameworks. They adopt almost no conventions that were introduced by Backbone, Angular, d3, jQuery, Rails, etc, and you will just confuse yourself if you approach Famo.us by trying to compare to any of the above that I mentioned.

---

I'll share a bit about the application I'm building once I've made some more progress with it, and have the chance to polish it up.

Cheers,

Dan