$("document").ready(function () {
  let apikey = "63b648a1969f06502871aa39";
  let rmbme = localStorage.getItem("rememberme");
  if (rmbme == "true") {
    $("#remember_me").prop("checked", true);
    $("#login_email").val(localStorage.getItem("email"));
    $("#login_pwd").val(localStorage.getItem("pwd"));
  }

  $("#signup").submit(function (e) {
    e.preventDefault();
    let email = $("#signup_email").val();
    let name = $("#signup_user").val();
    let pwd = $("#signup_pwd").val();
    let pwd2 = $("#signup_pwd2").val();
    if (pwd == pwd2) {
      createAccount(email, name, pwd);
    } else {
      alert("Passwords do not match");
    }
  });

  $("#login").submit(function (e) {
    e.preventDefault();
    let email = $("#login_email").val();
    let pwd = $("#login_pwd").val();
    if ($("#remember_me").is(":checked")) {
      let email = $("#login_email").val();
      let pwd = $("#login_pwd").val();
      console.log("checked");
      localStorage.setItem("rememberme", true);
      localStorage.setItem("email", email);
      localStorage.setItem("pwd", pwd);
      console.log(localStorage);
    } else {
      console.log("notcheck");
      localStorage.setItem("rememberme", false);
      localStorage.removeItem("email");
      localStorage.removeItem("pwd");
    }
    matchAccounts(email, pwd);
  });

  function createAccount(email, username, password) {
    var jsondata = {
      email: email,
      username: username,
      password: password,
      picture: null,
      balance: 0.0,
      inventory: { items: [] },
    };

    console.log(jsondata);

    var settings = {
      async: true,
      crossDomain: true,
      url: "https://interactivedev-f58c.restdb.io/rest/accounts",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
      processData: false,
      data: JSON.stringify(jsondata),
      beforeSend: function () {
        $("#submit").html(
          `<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_ht6o1bdu.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px; margin-left:auto; margin-right:auto;"  loop  autoplay></lottie-player>`
        );
      },
    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      $("#sucess").modal("show");
      $("#sucess").on("hidden.bs.modal", function () {
        window.location.href = "../templates/login.html";
      });
    });
  }

  function matchAccounts(email, password) {
    var settings = {
      async: true,
      crossDomain: true,
      url: "https://interactivedev-f58c.restdb.io/rest/accounts",
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
      beforeSend: function () {
        $("#submit").html(
          `<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_ht6o1bdu.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px; margin-left:auto; margin-right:auto;"  loop  autoplay></lottie-player>`
        );
      },
    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      var loggedin = false;
      for (var i = 0; i < response.length; i++) {
        if (response[i].email == email && response[i].password === password) {
          loggedin = true;
          $("#login_submit").html(
            `<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_ht6o1bdu.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px; margin-left:auto; margin-right:auto;"  loop  autoplay></lottie-player>`
          );
          sessionStorage.setItem("Account", JSON.stringify(response[i]));
          console.log(sessionStorage.getItem("Account"));
          window.location.href = "../templates/marketplace.html";
        }
      }
      if (loggedin === false) {
        alert("The email or password is incorrect");
        $("#login_submit").html(
          `<button type="submit" class="btn btn-default">Log In</button>`
        );
      }
    });
  }
});
