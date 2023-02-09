$(document).ready(function ($) {
  var url = window.location.href;
  let account = JSON.parse(sessionStorage.getItem("Account"));
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

  if (account != null) {
    $("#nav_username").text(account.username);
    $("#nav_balance p").text(`$ ${parseFloat(account.balance).toFixed(2)}`);
    $("#nav_profile").click(function () {
      console.log("he");
      window.location.href = "profile.html";
    });
    console.log(account.picture);
    if (account.picture != null) {
      $("#nav_profilepic").attr("src", account.picture);
    } else {
      $("#nav_profilepic").attr(
        "src",
        "../pics/vecteezy_profile-icon-design-vector_5544718.jpg"
      );
    }
  } else {
    $("#nav_add").click(function (e) {
      e.preventDefault();
    });
  }
});
