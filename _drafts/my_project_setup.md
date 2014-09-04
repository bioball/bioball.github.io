---
layout: post
title: My project setup
date: 2014-07-30
---

Beware in advance, this is going to be a long read. It's worth it, though. I hope everybody that comes here will learn at least one thing from all this.

I've been doing quite a lot of web front-end work lately, involving JavaScript, HTML and CSS, which has led me to put quite a lot of thought into how I handle my build process, my folder structure, etc. I'm actually quite satisfied with the way everything works in my dev environment, so I figured I should share it. I'm also always looking to better myself, so if you have any ideas on how I could be doing this better, please let me know.

The details of this post are catered towards a project that is purely *just* a front-end application, and a good bit of it may not be relevant to you. I write mostly Angular applications, I use Jade, CoffeeScript, SASS, image sprites, and I use Gulp for my build process. I use Bower for dependency management. I deploy to S3 and CloudFront. If certain things aren't relevant to you, feel free to skip to other sections. Hell, I'll even include a table of contents. Here you go.


  1. [Files and folder structure](#folder)
  2. [Managing JavaScript dependencies](#coffeescript)
    - [External dependencies with Bower](#bower)
    - [Application dependencies](#app)
  3. [SASS → CSS](#sass)
    - [Partials and mixins](#partials)
    - [Sprites](#sprites)
  4. [Jade → HTML](#jade)
  5. [Image sprites](#sprite)
  6. [Configs](#config)
  7. [Deployment](#deployment)

---

<a name="folder"></a>
# Files and folder structure

Here is a typical setup for one of my projects:

```
root/
|-- stylesheets/
    |-- style.sass
    |-- partials/
        |-- _normalize.sass
        |-- _variables.sass
        |-- _sprite.sass
        |-- _sprite_2x.sass
        |-- _mixins.sass
        |-- _home.sass
    |-- bourbon/
        |-- bourbon.scss
|-- public/
    |-- app/
        |-- services/
            |-- userService.coffee
        |-- directives/
            |-- directiveThing.coffee
        |-- config/
            |-- routes.coffee
            |-- config.coffee
        |-- sections/
            |-- home/
                |-- home.jade
                |-- homeController.coffee
            |-- header/
                |-- header.jade
                |-- headerController.coffee
    |-- build/
        |-- js/
            |-- libraries.js
            |-- application.js
        |-- stylesheets/
            |-- style.css
        |-- views/
            |-- home.html
            |-- header.html
    |-- lib/
        |-- jquery/
        |-- angular/
        |-- angular-ui-route/
    |-- assets/
        |-- images/
        |-- whatever_other_asset_types/
|-- spec/
    |-- unit/
        |-- controllers/
            |-- homeControllerSpec.coffee
            |-- headerControllerSpec.coffee
        |-- services/
            |-- someServiceSpec.coffee
    |-- e2e/
        |-- homePageSpec.coffee
        |-- checkoutPageSpec.coffee
    |-- index.html
|-- index.jade
|-- .gitignore
|-- bower.json
|-- .bowerrc
|-- package.json
|-- .travis.yml
|-- other_thing.file

```

The most interesting thing about the way I structure my folders, I think, is the way I structure my Angular application. I've seen too many Angular projects that look like this

```
controllers/
-- homeController.js
-- postsController.js
-- modalController.js
-- userPageController.js
-- someOtherController.js
```

This is totally fine for a small app that only has a couple of views, but once your app starts to grow, it quickly starts to become hard to digest. It's not conducive to a normal workflow--when you're working on a web app, you're never working on groups of controllers at a time. You're always working on **sections** at a time, like the home page or something, so you'd be jumping from the homeController to the home template, to to the css for the home section, etc. It's much more conducive to keep these files together in the same folder.

> Side note: I'd love to include my sass files in these same section folders, but because of the way I'm compiling my sass, I can't think of a good way to do it right now. Please let me know if you know of a solution.

The project structure is entirely designed for only the public folder to be served up. Any sensitive information (deploy keys and whatnot) live outside of the public folder.


---

<a name="coffeescript"></a>
# CoffeeScript → JavaScript

My goal with my JavaScript build process is two-fold:

1. Keep all my files as modular as possible when I write them
2. Condense them as much as possible when I serve them up

As detailed earlier in my folder structure section, I keep my entire JavaScript application within `./public/app`. The app divies up into multiple folders categorized by application components (services, directives, config files, etc), and sections which group my controllers with jade files.

In my HTML, my end goal is to only have two script tags in the entire application, and they would be:

{% highlight html %}
<script src="/build/js/libraries.js"></script>
<script src="/build/js/application.js"></script>
{% endhighlight %}

The point of doing this is that it reduces page load by quite a lot. Instead of making dozens of requests to the server, it's only making two requests.

> Why not use CDNs? My reasoning is that not everything I need can be found on a CDN. I'd rather use one method to serve all of my external libraries. Plus, my site is hosted out of Cloudfront, which is a CDN in itself.

<a name="bower"></a>
## Managing external javascript dependencies with Bower

My external dependencies are all managed by [Bower](http://bower.io/). For the uninitiated, Bower is a package manager designed for web applications, based off git. It takes care of downloading and saving the libraries that you need, and has an extremely large repository of libraries. When you can't find the library on the Bower registry, you can point Bower to a git repository.

All of these libraries are described by you in the `bower.json` file. So let's say you want to install jQuery. Your can do one of these many things in your `bower.json`.

Point to a version

{% highlight json %}
{
  "jquery": "~2.1.1"
}
{% endhighlight %}

Point to a git tag

{% highlight json %}
{
  "jquery": "git@github.com:jquery/jquery.git#v1.11.1"
}
{% endhighlight %}

Point to a git branch

{% highlight json %}
{
  "jquery": "git@github.com:jquery/jquery.git#master"
}
{% endhighlight %}

Point to a git hash

{% highlight json %}
{
  "jquery": "git@github.com:jquery/jquery.git#995f70777a"
}
{% endhighlight %}

Most of the time, you'll just want to point to a version and let bower figure out where to download it for you. However, this comes in useful if your own libraries that aren't registered with bower.

You can install these libraries into whatever path you'd like (by default, they're installed into `./bower_components`), and these are configured by creating a file called `.bowerrc` and placing it in the same directory as your `bower.json`. The `.bowerrc` needs to be formatted as JSON, and looks something like this:

{% highlight json %}
{
  "directory": "public/lib"
}
{% endhighlight %}

In this example, all of our dependencies will eventually look something like this

```
root/
|-- public/
    |-- lib/
        |-- angular/
        |-- jquery/
        |-- angular-ui-route/
```

Most of the packages that bower installs will have their own `bower.json` file, and many of these files will have a property that points to its main file (in the case of jquery, it would be `jquery.js`). To build one libraries.js file, we'll need to concatenate all of our libraries with gulp. Thankfully, there is just the module to do that, called [main-bower-files](https://github.com/ck86/main-bower-files). What this module does is pretty simple--it will iterate through your `bower.json`, and for each dependency it will grab the main file as defined by the dependency's own `bower.json`, and feed it into your gulp stream (Learn more about gulp [here](http://gulpjs.com)). This allows you to concatenate everything and build one giant file out of it.

{% highlight coffeescript %}
# gulpfile.coffee

gulp   = require 'gulp'
concat = require 'gulp-concat'
bower  = require 'main-bower-files'

gulp.task 'bower', ->
  gulp.src bower(bowerrc: './.bowerrc', bowerJson: './bower.json'), base: './public/lib'
  .pipe concat('libraries.js')
  .pipe gulp.dest('./public/build/js')
});

{% endhighlight %}

> If I *really* can't manage a library through bower, I download it and stick it in a `vendor` folder.

<a name="app"></a>
## Managing application JavaScript dependencies

When building out the application, I want to keep your dev files seperated, but all concatenated together within the browser. However, when I debug, I don't want to see all the thousands of lines of JavaScript that I've written, I just want to see the file that I'm currently debugging. My build process is basically threefold

1. Compile CoffeeScript into JavaScript
2. Write source maps for my CoffeeScript
3. Concatenate everything into one `application.js`

Here's my gulp logic

{% highlight coffeescript %}
# gulpfile.coffee

gulp        = require 'gulp'
clean       = require 'gulp-clean'
concat      = require 'gulp-concat'
coffee      = require 'gulp-coffee'
gutil       = require 'gulp-util'
sourcemaps  = require 'gulp-sourcemaps'

gulp.task 'clean-script', ->
  gulp.src './build/js/application.js', read: false
  .pipe clean()

gulp.task 'script', ['clean-script'], ->
  coffeeStream = coffee()

  coffeeStream.on 'error', gutil.log

  gulp.src './public/app/**/*.coffee'
    .pipe sourcemaps.init()
    .pipe coffee(bare: true)
    .pipe concat('application.js')
    .pipe sourcemaps.write('./maps')
    .pipe gulp.dest('./public/build/js')
{% endhighlight %}

Now when I'm debugging in the browser, I can add debugger statements to my coffeescript and walk through the logic in my browser.

> Note: The "clean-script" task deletes the file. In this case, it deletes my old `application.js` before I build the new one. 

---

<a name="sass"></a>

# SASS → CSS

Just a recap, my stylesheets folder looks like this:

```
|-- stylesheets/
    |-- style.sass
    |-- partials/
        |-- _normalize.sass
        |-- _variables.sass
        |-- _mixins.sass
        |-- _home.sass
    |-- bourbon/
        |-- bourbon.scss
```

All of my sass components live in their own partials, and so my `style.sass` file is just a series of `@import` commands. My sass file looks something like this:

{% highlight sass %}
// style.sass

@import bourbon/bourbon
@import partials/normalize
@import partials/variables
@import partials/mixins
@import partials/site
{% endhighlight %}

> `@import` is a SASS-specific directive that includes the contents of the argument into the current file.

Any site I build will be run through [normalize.css](http://necolas.github.io/normalize.css/) first, a CSS library intended to fix inconsistencies across different browsers. I pretty much just run the CSS file through a CSS to SASS convertor, and drop it into my `/partials` folder so I can `@import` it.

I also rely on the [Bourbon](http://bourbon.io/) mixin library to add the necessary vendor prefixes for all the CSS styles that I need. I run `bourbon install` in my stylesheets directory, and bourbon installs itself within the `/bourbon` folder.

I use SASS variables to manage my site's colors, fonts and image sizes. And whatever else, really, that makes sense as a variable. I also make heavy use of `darken()` and `lighten()`, instead of defining a new color variable for things like hover state on links.

<a name="partials"></a>

## Some cool mixin patterns

<ol>
  <li><p>Breakpoints</p>

I use mixins to manage my breakpoints throughout my stylesheets. I like to have individual sass files for different sections of the site that I'm working on, and responsive media queries specific to that section on the same file. Stupidly, sass doesn't support variables in media queries, so <code>@media(min-width: $mobileWidth)</code> will break. However, you can wrap the media query within a mixin, and use that mixin whenever you have a breakpoint.

{% highlight sass %}
// mixins.sass
=breakpoint-tablet
  @media(min-width: 760px)
    @content

=breakpoint-desktop
  @media(min-width: 1024px)
    @content

// home.sass
+breakpoint-tablet
  .username
    display: block
{% endhighlight %}
  </li>
  <li><p>Retina content</p>

For many of my images assets, I keep two versions in my assets folder, a standard size and a size blown up 2x, so they look good on high DPI screens. I append <code>_2x</code> onto all of these pictures, and have a mixin that looks like this

{% highlight sass %}

// mixins.sass
=retina
  // note: there are a ton of vendor prefixes to consider here, I just took them out for example sake
  @media only screen and (min-resolution: 2dppx)
    @content

=image($path, $type)
  background-image: url($path + '.' + $type)
  +retina
    background-image: url($path + '_2x.' + $type)

// home.sass
.home-picture
  +image('/assets/images/home', 'png')

{% endhighlight %}

My assets folder looks like this

{% highlight text %}
root/
|-- public/
    |-- assets/
        |-- images/
            |-- home.png
            |-- home_2x.png
{% endhighlight %}

Users that use non-retina devices will only load the smaller image, and users that have retina screens will load the larger images with higher clarity.

  </li>
</ol>

<a name="sprites"></a>
## Managing sprites

Image sprites are large images stitched together from multiple smaller images. You use CSS to target a specific background position on the image spritesheet to render individual images onto the DOM. The whole point to doing this is to prevent multiple HTTP requests, as this is yet another source of slowing down the page load. Thankfully, it's quite easy to manage sprites with a handy combination of Gulp and SASS.

First, we'll need to set up a gulp task to generate the spritesheets for us, as well as the sprite mixins. I use a tool called [gulp.spritesmith](https://github.com/twolfson/gulp.spritesmith). This tool has two functions: (1) generate a spritesheet with your assets, and (2) generate a SASS file with the proper mixins (it can generate plain CSS, and compile to other CSS pre-processors as well).

Of course, we don't want to just show one resolution for these images. Let's get some retina sprites for users with high DPI screens, and normal sprites for all other users.

In our project directory, we'll need to create folders to store these sprites so our gulp task can know where to look for them. My directory looks like this

```
root/
|-- public/
    |-- assets/
        |-- images/
            |-- sprite/
              |-- icon_1.png
              |-- icon_2.png
              |-- icon_3.png
            |-- sprite_2x/
              |-- icon_1.png
              |-- icon_2.png
              |-- icon_3.png
```

The next step is to simply instruct gulp to grab all the images from the `sprite/` folder, stitch them together into one `.png`, and put it back into the folder. Likewise, I need to repeat this step again for the retina images.

Generating the SASS files for retina images will give us the exact same mixins, but different variables, which we need. Note that I pass a `cssVarMap` function into gulp.spritesmith to append `-2x` onto these variables.

{% highlight coffeescript %}
# gulpfile.coffee

gulp        = require 'gulp'
clean       = require 'gulp-clean'
spritesmith = require 'gulp-spritesmith'

gulp.task "clean-sprite", ->
  gulp.src "./public/assets/images/sprite/sprite.png"
  .pipe clean()
  gulp.src "./public/assets/images/sprite_2x/sprite.png"
  .pipe clean()

# sprite task for normal sprites
gulp.task "sprite", ['clean-sprite', 'sprite-retina'], ->
  spriteData = gulp.src 'public/assets/images/sprite/*.png'
  .pipe spritesmith 
    imgName: 'sprite.png'
    cssName: '_sprite.sass'
    cssFormat: 'sass'
    imgPath: '/assets/images/sprite/sprite.png'
    algorithm: 'diagonal'

  spriteData.img.pipe gulp.dest './public/assets/images/sprite/'
  spriteData.css.pipe gulp.dest './stylesheets/partials/'

# sprite task for retina sprites
gulp.task 'sprite-retina', ->
  sprite2xData = gulp.src './public/assets/images/sprite_2x/*.png'
  .pipe spritesmith 
    imgName: 'sprite.png'
    cssName: '_sprite2x.sass'
    cssFormat: 'sass'
    imgPath: '/asset/images/sprite_2x/sprite.png'
    algorithm: 'diagonal'
    cssVarMap: (sprite) ->
      sprite.name = "#{ sprite.name }-2x"
      return

  sprite2xData.img.pipe gulp.dest './public/assets/images/sprite_2x/'
  sprite2xData.css.pipe gulp.dest './stylesheets/partials'
{% endhighlight %}

Spritesmith also generates mixins for us, which I've configured here to place into my stylesheets/partials folder. The mixins look something like this

{% highlight sass %}
// _sprite.sass

$icon-x: 26px
$icon-y: 26px
$icon-offset-x: -26px
$icon-offset-y: -26px
$icon-width: 26px
$icon-height: 27px
$icon-total-width: 104px
$icon-total-height: 106px
$icon-image: '/assets/images/sprite/sprite.png'
$icon: 26px 26px -26px -26px 26px 27px 104px 106px '/assets/images/sprite/sprite.png'

@mixin sprite-width($sprite)
  width: nth($sprite, 5)

@mixin sprite-height($sprite)
  height: nth($sprite, 6)

@mixin sprite-position($sprite)
  $sprite-offset-x: nth($sprite, 3)
  $sprite-offset-y: nth($sprite, 4)
  background-position: $sprite-offset-x  $sprite-offset-y

@mixin sprite-image($sprite)
  $sprite-image: nth($sprite, 9)
  background-image: url(#{$sprite-image})

@mixin sprite($sprite)
  @include sprite-image($sprite)
  @include sprite-position($sprite)
  @include sprite-width($sprite)
  @include sprite-height($sprite)

{% endhighlight %}

Conveniently enough, I just need to call `+sprite($icon)` in my sass to gain the proper width, height, image source and image position for that sprite.

### Retina sprites

For retina, I have these mixins that I add to my `_mixins.sass`. These mixins aren't generated, unlike the previous mixins.

{% highlight sass %}
// _mixins.sass

=retina-sprite-width($sprite)
  width: ceil(nth($sprite, 5)/2) + 2
 
=retina-sprite-height($sprite)
  height: ceil(nth($sprite, 6)/2) + 2

=retina-sprite-position($sprite)
  $sprite-offset-x: ceil(nth($sprite, 3)/2)
  $sprite-offset-y: ceil(nth($sprite, 4)/2)
  background-position: $sprite-offset-x  $sprite-offset-y
 
=retina-sprite-size($sprite)
  background-size: (nth($sprite, 7)/2) (nth($sprite, 8)/2)
 
=retina-sprite($sprite)
  +sprite-image($sprite)
  +retina-sprite-position($sprite)
  +retina-sprite-width($sprite)
  +retina-sprite-height($sprite)
  +retina-sprite-size($sprite)

{% endhighlight %}

Since I ran gulp.spritesmith over my retina sprite folder as well, I have variables available to me for the retina images, postfixed `-2x`. I can then combile the retina mixin with the retina-sprite mixin to show higher DPI image through media queries. If I wanted to add a sprite to the `icon` selector, it would look like this:

{% highlight sass %}
.icon
  +sprite($icon)
  +retina
    +retina-sprite($icon-2x)
{% endhighlight %}

---

# Jade → HTML

There's not too much I can say about the way I build jade. 

