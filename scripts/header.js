$(document).ready(function ($) {
  var url = window.location.href;
  let account = JSON.parse(sessionStorage.getItem("Account"));
  console.log(account);
  console.log(account.username);
  $("#nav_username").text(account.username);
  $("#nav_balance p").text(`$ ${account.balance}`);
  $("#nav_profilepic").attr("src", account.picture);
  $("#nav_buttons a").each(function () {
    console.log(url);
    var linkPage = this.href;
    if (url == linkPage) {
      $(this).css({
        "font-weight": "800",
        color: "white",
      });
      $(this).hover(function () {
        $(this).css({
          "animation-name": "buttons",
          "animation-duration": "0.3s",
          filter: "brightness(800%)",
        });
      });
    }
  });

  $("#nav_profile").click(function () {
    window.location.href = "";
  });
});
