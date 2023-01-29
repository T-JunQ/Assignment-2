$("document").ready(function () {
  let apikey = "63b648a1969f06502871aa39";
  $("#signup").submit(function (e) {
    e.preventDefault();
    let email = $("#signup_email");
    let name = $("#signup_name");

    let pwd = $("#signup_pwd").val();
    let pwd2 = $("#signup_pwd2").val();
    if (pwd == pwd2) {
      createAccount(email, name, pwd);
    } else {
      alert("Passwords do not match");
    }
  });

  function createAccount(email, username, password) {
    var jsondata = {
      email: email,
      username: username,
      password: password,
      balance: "0.00",
    };
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
        $("#signup_submit").html(
          `<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_ht6o1bdu.json"  background="transparent"  speed="1"  style="width: 80px; height: 80px;"  loop  autoplay></lottie-player>`
        );
      },
    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      $("#sucess").modal("show");
    });
  }
});
