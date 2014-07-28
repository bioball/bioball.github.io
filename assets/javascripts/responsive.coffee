$( ->
  class Slider
    constructor: (@el, @toggleButton) ->
      @currentPos = 0
      @mcSlider = new Hammer(@el[0])
      @mcButton = new Hammer(@toggleButton[0])

    open: ->
      @el.css transform: 'translate3d(230px, 0, 0)'
      @currentPos = 230
      @toggleButton.addClass('active')

    close: ->
      @el.css transform: 'translate3d(0, 0, 0)'
      @currentPos = 0
      @toggleButton.removeClass('active')

    init: ->
      @mcSlider.on 'dragstart touchstart', (event) => @handleStart(event)
      @mcSlider.on 'dragleft dragright swipeleft swiperight', (event) => @handleMove(event)
      @mcSlider.on 'release', (event) => @handleEnd(event)
      @mcButton.on 'tap', => @toggle()

    handleStart: (event) ->
      return if window.innerWidth >= 900
      @el.addClass 'animate'

    handleEnd: (event) ->
      return if window.innerWidth >= 900
      @el.removeClass 'animate'
      if Math.abs(event.gesture.deltaX)
        @close() if event.gesture.direction is 'left'
        @open() if event.gesture.direction is 'right'

    handleMove: (event) ->
      return if window.innerWidth >= 900
      event.preventDefault()
      @el.css transform: "translate3d(#{ @currentPos + event.gesture.deltaX }px, 0, 0)"

    isOpen: ->
      @currentPos > 0

    toggle: ->
      if @isOpen() then @close() else @open()

  slider = new Slider $('body'), $('.hamburger')
  slider.init()

)