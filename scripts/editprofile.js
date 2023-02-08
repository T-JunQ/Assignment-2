$(document).ready(function () {
  $("#includehtml").load("header.html");
  let apikey = "63b648a1969f06502871aa39";
  let account = JSON.parse(sessionStorage.getItem("Account"));
  let successmodal = $("#sucesschange");

  getValues();
  $("#profile_pic").attr("src", account.picture);
  $("input").on("keyup", function () {
    $(this).css("color", "red");
  });

  $("#picture").on("keyup", function () {
    let src = $(this).val();
    $("#profile_pic").attr("src", src);
  });

  $("#edit_form").submit(function (e) {
    e.preventDefault();
    let cpwd = $("#pwd2").val();
    if (cpwd === account.password) {
      let email = $("#email").val();
      let name = $("#user").val();
      let picture = $("#picture").val();
      let password = $("#pwd").val();
      let id = account._id;
      let inventory = account.inventory;
      let balance = parseFloat(account.balance).toFixed(2);
      updateAccount(id, email, name, picture, password, balance, inventory);
    } else {
      alert("Incorrect password");
    }
  });

  function getValues() {
    $("#email").val(account.email);
    $("#user").val(account.username);
    $("#picture").val(account.picture);
    $("#pwd").val(account.password);
  }

  function updateAccount(
    id,
    email,
    name,
    picture,
    password,
    balance,
    inventory
  ) {
    var jsondata = {
      email: email,
      username: name,
      password: password,
      picture: picture,
      balance: balance,
      inventory: inventory,
    };
    var settings = {
      async: true,
      crossDomain: true,
      url: `https://interactivedev-f58c.restdb.io/rest/accounts/${id}`,
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
      processData: false,
      data: JSON.stringify(jsondata),
      beforeSend: function () {
        $("#submit").html(
          `<lottie-player src="https://assets6.lottiefiles.com/packages/lf20_kxsd2ytq.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px;"  loop  autoplay></lottie-player>`
        );
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      sessionStorage.setItem("Account", JSON.stringify(response));
      successmodal.modal("show");
      $("#sucesschange").on("hidden.bs.modal", function () {
        window.location.href = "../templates/marketplace.html";
      });
    });
  }
});
