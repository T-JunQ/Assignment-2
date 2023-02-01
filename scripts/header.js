$(document).ready(function ($) {
  var url = window.location.href;
  var activePage = url;
  $("nav #nav_buttons a").each(function () {
    var linkPage = this.href;
    if (activePage == linkPage) {
      $(this).addClass("activepage");
    }
  });
});
