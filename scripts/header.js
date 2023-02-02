$(document).ready(function ($) {
  var url = window.location.href;
  let account = JSON.parse(sessionStorage.getItem("Account"));
  console.log(account);
  console.log(account.username);
  $("#nav_username").text(account.username);
  $("#nav_balance p").text(`$ ${account.balance}`);
  $("#nav_buttons a").each(function () {
    console.log(url);
    var linkPage = this.href;
    if (url == linkPage) {
      $(this).css({
        "font-weight": "700",
        color: "white",
      });
    }
  });

  $("#nav_profile").click(function () {
    window.location.href = "";
  });
});
