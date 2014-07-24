---
layout: post
title: JSON web tokens
date: 2014-07-23
---

At my work, we have writing our core infrastructure from the ground up, including the accounts, orders, e-commerce, etc. It's been quite a lot of work, and much of this requires us to pay extra attention to authentication, preventing fraud, malicious users, and any code that may expose sensitive information.

One such technology that we're using are JSON web tokens (JWT). JSON web tokens are a means for us to authenticate claims for any web request that our server receives from our clients, as well as maintaining a sense of "sessions" accross our various properties, through a single sign on. 

The premise is actually quite simple. The JWT comes in three parts:

## 1. Header

This contains information about the JWT itself, e.g. the algorithm used to sign it, the issuer, and the expiration date of the JWT. It is a JSON string, base64 encoded. The header might look like this

NON-encoded JSON
{% highlight json %}
{
  "alg": "HS256",
  "typ": "jwt",
  "exp": 11300819311
}
{% endhighlight %}
base64 encodeed
{% highlight json %}
"eyJhbGciOiJobWFjMjU2IiwidHlwIjoiand0IiwiZXhwIjoxMTMwMDgxOTMxMX0"
{% endhighlight %}

## 2. Claims set

This section are all the bits of information that the bearer of the JWT claims to be true. In our case, as we are using it for users and session auth, we provide information about the user here.

NON-encoded JSON
{% highlight json %}
{
  "firstName": "Bilbo",
  "lastName": "Baggins",
  "email": "bilbo@baggins.com",
  "avatar": "http://bilbo.com/me.jpg"
}
{% endhighlight %}

base64 encodeed
{% highlight json %}
"eyJmaXJzdE5hbWUiOiJCaWxibyIsImxhc3ROYW1lIjoiQmFnZ2lucyIsImVtYWlsIjoiYmlsYm9AYmFnZ2lucy5jb20iLCJhdmF0YXIiOiJodHRwOi8vYmlsYm8uY29tL21lLmpwZyJ9"
{% endhighlight %}

## 3. Signature

This is the signature of both the header and claims set using a one-way hash (in our example, it would be an HMAC-SHA256). Authentication in the server happens like this:

* The server receives the JWT
* The server signs the first and second portion of the JWT, and compares the newly signed string to the signature present in the JWT
* If the two signatures are identical, this is a valid JWT and the claims can be trusted

base64 string: firstPart and second part concatenated
{% highlight json %}
"eyJhbGciOiJobWFjMjU2IiwidHlwIjoiand0IiwiZXhwIjoxMTMwMDgxOTMxMX0eyJmaXJzdE5hbWUiOiJCaWxibyIsImxhc3ROYW1lIjoiQmFnZ2lucyIsImVtYWlsIjoiYmlsYm9AYmFnZ2lucy5jb20iLCJhdmF0YXIiOiJodHRwOi8vYmlsYm8uY29tL21lLmpwZyJ9"
{% endhighlight %}

signed by HMAC-SHA256 with the secret `'keyboardcat'`
{% highlight json %}
"ed1dbf5d498341ea2787c373aadfc2d94f179f60c8bb39c92ab23070d8baef89"
{% endhighlight %}

## 4. All together

To construct the entire JWT, we take the first part, second part and third part, and join them with the `.` character. All in all, it looks something like this:

{% highlight json %}
"eyJhbGciOiJobWFjMjU2IiwidHlwIjoiand0IiwiZXhwIjoxMTMwMDgxOTMxMX0.eyJmaXJzdE5hbWUiOiJCaWxibyIsImxhc3ROYW1lIjoiQmFnZ2lucyIsImVtYWlsIjoiYmlsYm9AYmFnZ2lucy5jb20iLCJhdmF0YXIiOiJodHRwOi8vYmlsYm8uY29tL21lLmpwZyJ9.ed1dbf5d498341ea2787c373aadfc2d94f179f60c8bb39c92ab23070d8baef89"
{% endhighlight %}

## Implementation in the browser

I've written my app to expect the JWT in one of three ways:

1. Present in the query string upon page load
2. Present in the user's `localStorage`
3. Received from the server when the user logs in.

Once I have the JSON web token, I store it in `localStorage` to maintain persistence upon page close. When the users loads my page, I check for a JSON web token, and if it exists, I build the user model out of it.

Any request that I make to my server includes an `Authentication` http header, with the token as its value. If the server detects this header in my request, it verifies its signature and responds accordingly.

## Benefits

JWT's make a lot of things that used to be tedious, suddenly extremely easy. For one, it isn't just a way to handle authentication, the token itself contains useful informaiton. For us, we add all public user information to the claims set, and our user model within the web app builds its schema from parsing this.

Another pretty giant benefit is that because we're not using cookies, it's not possible for this token to be transfered upon page redirect, and we are absolutely not vulnerable to CSRF.

JWT's also make single sign on between multiple web properties an absolute breeze to implement. Since the tokens are self-authenticating, as long as you pass the token around when the user navigates between the different sites, they will be considered logged in through the entire experience. In my sites, if a user is logged in, I append the token as a query parameter on any internal link.

The usage of JWT's also allows the server to be entirely stateless. Since authentication comes through comparing a string to its signed hash, there is no need to keep a set of current valid session tokens. They are easily scalable and easily implemented.

## Detriments

Although using JWTs means we are not vulnerable to CSRF, we are very susceptible to XSS attacks. Any malicious user that gains the ability to execute JavaScript on any of my pages means they will have easy access to all of our tokens. Since the tokens are self-authenticating, this can be disaterous if compromised. This means that any third party JavaScript library has to be scrutinized to make sure they aren't introducing XSS holes.

Another detriment to this is the fact that a single session can't be invalidated, unless you wanted to re-introduce state in the serve by specifically keeping track of a blacklist on token claims (like, say, a claim that the user's email is "bungo@baggins.com"). Common solutions that I've seen are to keep the expiration on these tokens quite low, and to configure clients to grab refresh tokens upon subsequent page views (Basically, a refresh token is just another JWT with a fresh expiration date).

Last of all, relying on `localStorage` (or `sessionStorage`) to store these tokens in the client side has compatibility issues with older browsers that don't support HTML5, and there is no easy fallback if the browser doesn't support it.

---

All in all, it has to be said that cookies are battle-tested and very well understood, whereas localStorage and JWT's are a relatively new concept. The conservative engineer is much more likely to stick with the cookie model of authentication. However, JWT's are a pretty intuitive solution and I'd love to see this mature.