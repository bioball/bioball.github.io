const m = require('mandolin');
const { Option, Some, None } = m;

$(function(){

  var currentTheme = Option.reads.getValue(window.localStorage.getItem('theme')).get();

  const reloadDisqus = function(){
    window.DISQUS && window.DISQUS.reset({ reload: true });
  };

  const themesSyntaxes = {
    default: $('<link rel="stylesheet" href="/css/syntax.css">'),
    light: $('<link rel="stylesheet" href="/css/solarized-light.css">'),
    dark: $('<link rel="stylesheet" href="/css/solarized-dark.css">')
  };

  const applyTheme = function(theme){
    $('head').append(themesSyntaxes[theme]);
    $(`.theme-picker button[data-theme="${ theme }"]`).addClass('active');
    $('body').addClass(theme);
    reloadDisqus();
  };

  const removeTheme = function(theme){
    themesSyntaxes[theme].remove();
    $(`.theme-picker button[data-theme="${ theme }"]`).removeClass('active');
    $('body').removeClass(theme);
  };

  currentTheme.map(applyTheme);
  
  $('.theme-picker button').click(function(e){
    e.preventDefault();
    // theme is either dark, light or default.
    const theme = $(this).attr('data-theme');
    currentTheme
    .match({
      Some (t) { return t === theme ? new None : new Some(theme); },
      None () { return new Some(theme); }
    })
    .map((newTheme) => {
      currentTheme.map(removeTheme);
      applyTheme(newTheme);
      currentTheme = new Some(newTheme);
      localStorage.setItem('theme', theme);
    });
  });

});
