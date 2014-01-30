---
layout: post
title: Introducing ParkSwap!
date: 2014-01-07 11:13:00
---

Over a period of 2.5 weeks around late December/early January, I worked with a team of two other people to write [ParkSwap](http://park-swap.herokuapp.com/), a mobile web app to help people find parking spots.

The idea is this. In any busy city, people spend way too much time driving around finding parking spots. At the same time, people spend way too much time walking to their car which was parking far away. If you are trying to park, this app helps you to find people who are on their way to their car. You pick them up, give them a ride to their spot and take it after they leave. If you've parked far away, you get a free ride to your car.

Practically speaking, if you want a ride, all you do is select where your car is (we provide an Uber-style pin navigation), then wait for somebody to choose to take your parking spot. If you want to park, all you do is wait for the screen to populate with people looking for rides back to their parking spot. The app will show you a list of people currently within 1 mile radius of you, and will order all the parking spots by distance from you.

---

Our main thought process when building this app is that it has to be extremely pleasant looking and easy to use. It had to be stupid easy for people who are driving around to use our app, and immediately clear for people wanting a ride for what to do. I think we accomplished just that.

We still have some work to do if we expect this to be a legitimate consumer app. The first, most basic version of the app is done, but here's a list of things we need to build upon before I expect people to want to use it.

1. There needs to be some sort of reputation system, so people getting rides can trust that whoever is picking them up is not going to abduct them.
2. We need to anonymize phone numbers. Right now, if you choose to pick somebody up, we pretty much just send the phone numbers of either party to the other person. This isn't a dating app, and we need to protect user privacy.
3. We need to verify that somebody's phone number is real. There's several ways to do this, but the most direct method would be to just send a user an SMS that contains a certain passcode to enter on the website.

---

###Screenshots

<a href="/assets/parkswap-login.png"><img src="/assets/parkswap-login.png" height="30%" width="30%"></img></a>
<a href="/assets/parkswap-main.png"><img src="/assets/parkswap-main.png" height="30%" width="30%"></img></a>
<a href="/assets/parkswap-where.png"><img src="/assets/parkswap-where.png" height="30%" width="30%"></img></a>
<a href="/assets/parkswap-wait.png"><img src="/assets/parkswap-wait.png" height="30%" width="30%"></img></a>
<a href="/assets/parkswap-list.png"><img src="/assets/parkswap-list.png" height="30%" width="30%"></img></a>
<a href="/assets/parkswap-pickup.png"><img src="/assets/parkswap-pickup.png" height="30%" width="30%"></img></a>

---

Please do check it out. If this thing becomes popular, it will save everybody a ton of time *and* money. Note that this is meant to be a mobile app, and was designed with a mobile portrait view in mind. If viewed from a widescreen browser, everything will be distorted.

Our project is open source on [Github](http://github.com/bioball/parkswap/). Check out the readme for a more technical explanation of our app.

Special shoutout to Emma Tzeng, who came up with the original idea for this app.