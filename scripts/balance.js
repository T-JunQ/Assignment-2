$(document).ready(function () {
  let rmb_card = localStorage.getItem("rmb_card");
  let account = JSON.parse(sessionStorage.getItem("Account"));
  let apikey = "63b648a1969f06502871aa39";
  let successmodal = $("#sucessful");
  $("#validation").hide();
  // If remember details is checked previously would chnage values
  if (rmb_card == "true") {
    $("#save_details").prop("checked", true);
    $("#card_no").val(localStorage.getItem("cardno"));
    $("#address").val(localStorage.getItem("addr"));
    $("#address2").val(localStorage.getItem("addr2"));
    $("#city").val(localStorage.getItem("city"));
    $("#state").val(localStorage.getItem("state"));
    $("#zip").val(localStorage.getItem("zip"));
  }

  // Checks if the numeric values are correct, then sends a put request to change balance
  $("#bal_form").submit(function (e) {
    e.preventDefault();
    let validation = true;
    let smalltext = $("#validation");
    let cardno = $("#card_no").val();
    let csv = $("#csv").val();
    let addr = $("#address").val();
    let addr2 = $("#address2").val();
    let city = $("#city").val();
    let state = $("#state").find(":selected").data("state");
    let zip = $("#zip").val();
    if ($.isNumeric(cardno) == false) {
      smalltext.text("Card number is invalid!");
      $("#card_no").css("border", "red 2px solid");
      smalltext.show();
      return false;
    } else {
      $("#card_no").css("border", "none");
    }
    if ($.isNumeric(csv) == false) {
      smalltext.text("CSV is invalid!");
      $("#csv").css("border", "red 2px solid");
      smalltext.show();
      return false;
    } else {
      $("#card_no").css("border", "none");
    }
    if ($.isNumeric(zip) == false) {
      smalltext.text("Zipcode is invalid!");
      $("#Zipcode").css("border", "red 2px solid");
      smalltext.show();
      return false;
    } else {
      $("#card_no").css("border", "none");
    }

    if ($("#save_details").is(":checked")) {
      localStorage.setItem("rmb_card", true);
      localStorage.setItem("cardno", cardno);
      localStorage.setItem("addr", addr);
      localStorage.setItem("addr2", addr2);
      localStorage.setItem("city", city);
      localStorage.setItem("state", state);
      localStorage.setItem("zip", zip);
      console.log(localStorage);
    } else {
      console.log("notcheck");
      localStorage.setItem("rmb_card", false);
      localStorage.removeItem("cardno", cardno);
      localStorage.removeItem("addr", addr);
      localStorage.removeItem("addr2", addr2);
      localStorage.removeItem("city", city);
      localStorage.removeItem("state", state);
      localStorage.removeItem("zip", zip);
    }
    let amount = $("#amount").val();
    account.balance = parseFloat(account.balance);
    amount = parseFloat(amount);
    account.balance += amount;
    updateBalance(
      account._id,
      account.email,
      account.username,
      account.password,
      account.picture,
      parseFloat(account.balance).toFixed(2),
      account.inventory
    );
  });

  // Updates record to reflect new balance
  function updateBalance(
    id,
    email,
    username,
    password,
    picture,
    balance,
    inventory
  ) {
    var jsondata = {
      email: email,
      username: username,
      password: password,
      picture: picture,
      balance: balance,
      inventory,
    };
    console.log(jsondata);
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
        $("#submit").prop("disabled", true);
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      successmodal.modal("show");
      sessionStorage.setItem("Account", JSON.stringify(response));
      successmodal.on("hidden.bs.modal", function () {
        window.location.href = "../templates/marketplace.html";
      });
    });
  }
});
