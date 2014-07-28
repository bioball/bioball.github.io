---
layout: post
title: Let's write a calculator program in JavaScript
date: 2014-04-18 14:29:00
---

A while ago, I was interviewing for a company that asked me to write a calculator program in JavaScript that could add, subtract, multiply and divide. The program had to take inputs like a real calculator, like say, when you input `1, +, 3, *, 4`, the logic at each step should be:

1. Accept input `1`
2. Prepare `1` to be added to something
3. Accept input `3`
4. Prepare to multiply `3` by something, then add `1`
5. Evaluate `3 * 4`, then add `1`, output result

It's a simple concept, but every solution that I came up with at the time was verbose, complicated to follow and took too many lines of code to implement. The thing that hung me up was that the calculation happens in the *future* of inputting each operator.

Here's my eventual solution. I like it so much that I'm sitting here writing a blog post about it. First, it's a calculator, so let's lay down our functions that do the calculating for us.

{% highlight javascript %}
function add(a, b){
  return a + b;
}

function subtract(a, b){
  return a - b;
}

function multiply(a, b){
  return a * b;
}

funciton divide(a, b){
  return a / b;
}
{% endhighlight %}



