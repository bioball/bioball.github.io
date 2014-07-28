$(function(){
  var open;
  $('.hamburger').click(function(event){
    if(open) {
      $('.index-header, .fauxcolumn, .hamburger, .post-listing').removeClass('active');
      open = false;
    } else {
      $('.index-header, .fauxcolumn, .hamburger, .post-listing').addClass('active');
      open = true;
    }
  });
});