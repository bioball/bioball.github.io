---
layout: post
title: A perspective on famo.us from a guy that kinda still doesn't understand famo.us
date: 2014-02-06
---

First things first, Steve Newcomb, if you're reading this, hello. Please enjoy my thoughts on your crazy new framework.

For all other readers, I'm under the impression that Steve (Famo.us' enigmatic CEO) reads absolutely everything on the internet about his company. Everything.

I've just wrapped up my participation in Famo.us' private beta. Since I started, I've learned a truck load about physics, matrix transformations, video game render trees, life, love, joy, pain, and triumph. I'll confess. I mostly learned about pain.

My team and I recently wrapped up our prototype application, called **Poing**. It is a points-of-interest application that uses geolocation, Google Maps and Foursquare to deliver information on different types of venues around you. It is designed to be a walking companion, meant for the meandering denziens of any city to quickly find an interesting place to walk to.

[Scroll down for a video walkthrough of our app.](#walkthrough)

Even before I took on this project, expectations were already set for me that this framework would be exceptionally difficult to work with. I knew people that had already gone through the private beta experience, and they described to me the disillusionment that happens to them as they realize they have no idea what was going on. I heeded this warning, but who in their right mind would turn down the chance to work on this framework, which has a chance of revolutionizing HTML5 apps? I wanted an early piece of the pie to taste for myself.

The promise of famo.us is this. It empowers the DOM with fluid, physics-enabled effects that run as smoothly as a native mobile app. It provides JavaScript developers the ability to write apps that has no compromise in terms of animations, and Steve Newcomb believes this can even *trump* an app written in native code (java or objective-c). This may be possible, but I believe famo.us has a long away to go before it can claim to compete head to head with native, or even with a more traditional HTML5 web app.

What is famo.us? There seems to be quite a bit of confusion on the web about this, and I will do my best to explain what famo.us is in my limited understanding of the framework, and clear up some of this confusion.

---

### A perspective on famo.us from a guy that kinda still doesn't understand famo.us

1. **At the lowest level, famo.us is a matrix transformations library.**

  The most primitive unit of action that famo.us does the output of a transformation matrix for rendering. I have not touched the GL or DirectX side of things, but as far as the traditional DOM goes, famo.us outputs a 4v4 matrix that gets interpreted by the browser as a `-webkit-transform: matrix3d` css property. Every single div is rendered with absolute positioning applied, and layout, size, animations, are all determined by matrices.

  Physics effects, animations, etc., are *secondary* to outputting matrix transformations. Realistically (and with great difficulty), somebody else can come along and write their own way to output matrix transformations and compete with famo.us.

2. **Famo.us *still* delegates the hard work of div rendering to the browser.**

  Steve Newcomb has said that famo.us skips the browser render and talks directly with the GPU. This is only half true. As long as we're talking about the DOM, the browser is still in charge of all rendering. This is obvious enough; just do a inspect element on [their website](http://famo.us/), remove the `-webkit-transform: matrix3d` property on their divs, and notice how they all float to the top left of the browser window.

  The browser is the final gateway between taking these divs and rendering them in the correct manner. Famo.us has simply built an abstraction layer to take advantage of the fact that these transformations are hardware accelerated.

3. **Famo.us is an immature framework, to a high degree.**

  During just my three weeks there, they only just started talking about using version numbers on their modules to track dependency, changes and all that good stuff. They are currently in the process of determining what modules are ready to be shipped for public beta, and what is not ready yet.

  Certain things that are trivial in a normal web page are inexplicably difficult on famo.us. For one, we wanted to render divs that resized based on the amount of text content inside them. The problem was, all Famo.us elments need a specific height and width property, otherwise they wouldn't be rendered properly. We had no way of know how many lines a piece of text would take up, so we didn't have any way to pre-determine the correct height and width values. In a regular website, this would have been completely trivial.

  Another factor is that their API for their various components aren't completely thought out and only cover a limited use-case. For example, we used a widget called a scrollview to render a card-like layout in our app. We wanted to apply Matrix transformations to cards depending on their position in the scrollview, but there was no interface for it. I ended up hacking up their scrollview to get the kind of response that I needed from it. This is just one of many hacks that we built in order to get things to work.


### Why is it painful? And should I disregard famo.us already?

A huge part of our challenge stemmed from the fact that we wrote this thing with almost zero documentation. When we arrived, I was expecting some sort of miniature on-boarding procedure that would give us an idea for how to write applications in their framework. Instead, we were given some loosely written Github wiki articles that did not adequately explain how to do anything. We learned everything the hard way. We pulled down old repos, played around with the source code, and tried to ascertain what mattered and what didn't. We even spent countless hours reading Famo.us' core source code to figure out exactly how to use their components. This problem was exacerbated by the fact that famo.us is such a steep paradigm shift from traditional frameworks that there were no comparisons for me to draw from.

Documentation aside, a giant hurdle for them right now is the lack of a clear app structure. They desperately need a way for developers to implement MVC. While there's been quite a bit of internal discusison on how to achieve this, there is no canonical way to do it, and no prototypal application where this is achieved. When I was there, I was advised to disregard the idea of MVC for the time being.

Famo.us needs to figure this out, and be extremely opinionated on how it can be done correctly. To me, it seems like there are two very good ways to do it. One, they can write their own MVC framework that is tightly coupled with the rest of their library. Secondly, it has been suggested by some of their own engineers that Backbone would be a great way to implement MVC structure to their applications. I won't explore this right now, but it does make sense to me that Backbone can be used alongside Famo.us, since it is unopinionated about DOM rendering.

Steve Newcomb wants developers to be able to pick up famo.us and start building great things with it within 30 minutes. While this would be an amazing achievement for them, it simply isn't realistic. I *can* see famo.us reaching a point where people can comfortable understand the framework within one day, however. Once they have a more established ideal for how to structure an app, and have adequate documentation, etc., these hurdles that I've mentioned will be much more easily surmounted.

---

With all this said, should you disregard famo.us? **Hell no**. If your goal is to build a mobile HTML5 app with smooth, scalable and performant transitions, there simply is no other alternative right now. Famo.us is doing things with the DOM that have never been done before, and changes the way we think HTML5 apps work. I'm excited for their release into open public beta, and you can bet that I will be around on Stack Overflow answering questions that early adopters may have about the framework. I want to see people build amazing widgets that trump the components that famo.us engineers have already built, and for this to become a more robust and mature product.

----

So what did my team and I build during our time there? Click below to play! I'd love to hear any comments you may have on the comments section of our video.



<a name="walkthrough" class="not-link"><iframe width="100%" height="500" src="//www.youtube.com/embed/HMyJS46H7b0" frameborder="0" allowfullscreen></iframe></a>

<script>document.bind</script>