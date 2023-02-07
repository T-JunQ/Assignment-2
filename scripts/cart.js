$("document").ready(function () {
  $("#includehtml").load("header.html");
  let apikey = "63b648a1969f06502871aa39";
  let cart = JSON.parse(localStorage.getItem("cart"));
  let total = 0;
  let account = JSON.parse(sessionStorage.getItem("Account"));
  let failedmodal = $("#failedbuy");
  let successmodal = $("#sucessbuy");
  let loading = $("#loading");

  showItems();

  if (account == null) {
    $("#cart_listings").html("<p>Please Log in to buy items</p>");
  }

  $("#buy_items").click(function () {
    buyItems();
  });

  $("#cart_listings").on("click", ".remove_item", function (e) {
    console.log("text");
    let id = $(this).parent().attr("id");
    console.log(id);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i]._id == id) {
        cart.splice(i, 1);
        console.log(cart);
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(cart);
      }
    }
    if (cart.length == 0) {
      localStorage.removeItem("cart");
    }
    window.location.reload();
  });

  $("#delete_items").click(function () {
    console.log("cleared");
    localStorage.removeItem("cart");
    window.location.reload();
  });

  async function buyItems() {
    let checkout = confirm("Are you sure you want to check-out?");
    if (checkout == true) {
      if (account.balance - total >= 0) {
        account.balance = parseFloat(account.balance);
        account.balance -= total;
        for (var i = 0; i < cart.length; i++) {
          loading.modal("show");
          account.inventory.items.push(cart[i]);
          setTimeout(getSeller(cart[i].seller[0]._id, cart[i].price));
          await sleep(2000);
          setTimeout(deleteItem(cart[i]._id));
          await sleep(2000);
        }
        console.log(account.inventory);
        setTimeout(
          updateUser(
            account._id,
            account.email,
            account.username,
            account.password,
            account.picture,
            parseFloat(account.balance).toFixed(2),
            account.inventory
          ),
          2000
        );
        loading.modal("hide");
        sessionStorage.setItem("Account", JSON.stringify(account));
        successmodal.modal("show");
        successmodal.on("hidden.bs.modal", function () {
          window.location.href = "../templates/marketplace.html";
        });
      } else {
        failedmodal.modal("show");
      }
    }
  }

  function updateUser(
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
        loading.modal("show");
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      localStorage.removeItem("cart");
    });
  }

  async function getSeller(id, profits) {
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
        loading.modal("show");
      },
    };

    $.ajax(settings).done(async function (response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        if (response[i]._id == id) {
          let newbalance = (response[i].balance += profits);
          await sleep(2000);
          updateUser(
            response[i]._id,
            response[i].email,
            response[i].username,
            response[i].password,
            response[i].picture,
            newbalance,
            response[i].inventory
          );
        }
      }
    });
  }

  function deleteItem(id) {
    var settings = {
      async: true,
      crossDomain: true,
      url: `https://interactivedev-f58c.restdb.io/rest/listings/${id}`,
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
      beforeSend: function () {
        loading.modal("show");
      },
    };

    $.ajax(settings).done(async function (response) {
      console.log(response);
      await sleep(2000);
    });
  }

  function showItems() {
    if (cart != null) {
      let content = "";
      $("#buy_items").prop("disabled", false);
      for (var i = 0; i < cart.length; i++) {
        let price = parseFloat(cart[i].price);
        console.log(cart);
        total += price;
        content = `${content}<div class="listing" id="${cart[i]._id}">
          <h2 class="item_name">${cart[i].name}</h2>
          <h3 class="game_name">${cart[i].game}</h3>
            <div class="img_container">
            <img class="img-thumbnail item_img img-fluid" src="${
              cart[i].image
            }">
          </div>
          <h2 class="item_price">$ ${price.toFixed(2)}</h2>
          <button class="btn btn-danger remove_item">Remove</button><br>
          <div class="seller">
            <img class="seller_pic" src="${
              cart[i].seller[0].picture
            }" alt="profilepic" onerror="src='../pics/vecteezy_profile-icon-design-vector_5544718.jpg'"  width="20px" height="20px">
            <h4 class="seller_name">${cart[i].seller[0].username}</h4>
        </div>
        </div>`;
      }
      $("#cart_listings").html(content);
      console.log($("#cart_info").html());
      $("#cart_info").html(
        `<p>Subtotal: $ ${total.toFixed(
          2
        )} </p><p>Discount: $ 0 </p><p>Total: $ ${total.toFixed(2)}</p>`
      );
    } else {
      $("#buy_items").prop("disabled", true);
      $("#cart_listings").html("<p>No items in cart</p>");
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
