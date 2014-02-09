---
layout: post
title: Introducing ParkSwap!
date: 2014-01-07 11:13:00
---

> *If you are trying to get to your car, this is your free Uber-esque ride to your parking spot. 
If you are parking, this is your ticket to finding an extremely easy spot.*

Imagine this. It's Friday night, and you're driving to *the* popular spot in town. There's cars parked everywhere on all the streets, and many more circling around blocks trying to look for one. You pull out your phone, and are immediately shown tons of parking spots near your current location. You choose one spot, and are given instructions to pick somebody up, then you drive them to their car to exchange parking spots with them.

Let's imagine that this app exists, and that everybody uses it. People suggest that 20% - 30% of all city traffic comes from people looking for parking spots<sup>[1](#note)</sup>. That's ridiculous. What if that were gone entirely? Time would be saved, there would be less pollution, and lots of money would be saved as well.

That's the ambition that my team and I had, so we built that app. Let me introduce to you...

ba-dum-tish..

<div style="text-align: center;"><a href="http://parkswap.co"><h2>ParkSwap</h2></a></div>

---

Our main thought process when building this app is that it has to be extremely pleasant looking and easy to use. It had to be stupid easy for people who are driving around to use our app, and immediately clear for people wanting a ride for what to do. I think we accomplished just that.

We still have some work to do if we expect this to be a legitimate consumer app. The first, most basic version of the app is done, but here's a list of things we need to build upon before I expect people to want to use it.

1. There needs to be some sort of reputation system, so people getting rides can trust that whoever is picking them up is not going to abduct them.
2. We need to anonymize phone numbers. Right now, if you choose to pick somebody up, we pretty much just send the phone numbers of either party to the other person. This isn't a dating app, and we need to protect user privacy.
3. We need to verify that somebody's phone number is real. There's several ways to do this, but the most direct method would be to just send a user an SMS that contains a certain passcode to enter on the website.

---

###Screenshots

<a href="/assets/parkswap-login.png"><img src="/assets/parkswap-login.png" height="32%" width="32%"></img></a>
<a href="/assets/parkswap-main.png"><img src="/assets/parkswap-main.png" height="32%" width="32%"></img></a>
<a href="/assets/parkswap-where.png"><img src="/assets/parkswap-where.png" height="32%" width="32%"></img></a>
<a href="/assets/parkswap-wait.png"><img src="/assets/parkswap-wait.png" height="32%" width="32%"></img></a>
<a href="/assets/parkswap-list.png"><img src="/assets/parkswap-list.png" height="32%" width="32%"></img></a>
<a href="/assets/parkswap-pickup.png"><img src="/assets/parkswap-pickup.png" height="32%" width="32%"></img></a>

Please do check it out. If this thing becomes popular, it will save everybody a ton of time *and* money. Note that this is meant to be a mobile app, and was designed with a mobile portrait view in mind. If viewed from a widescreen browser, everything will be distorted.

Our project is open source on [Github](http://github.com/bioball/parkswap/). Check out the readme for a more technical explanation of our app.

Special shoutout to Emma Tzeng, who came up with the original idea for this app.

---

###Notes

1. <a name="note" href="http://www.sfexaminer.com/sanfrancisco/san-francisco-transit-agency-says-drivers-seeking-parking-account-for-30-percent-of-traffic-but-data-questioned/Content?oid=2580026">http://www.sfexaminer.com/sanfrancisco/san-francisco-transit-agency-says-drivers-seeking-parking-account-for-30-percent-of-traffic-but-data-questioned/Content?oid=2580026</a>