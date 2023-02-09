$(document).ready(function () {
  $("#includehtml").load("header.html");
  let account = JSON.parse(sessionStorage.getItem("Account"));
  let apikey = "63b648a1969f06502871aa39";
  let listingmodal = $("#list_items");
  let item;
  console.log(account);
  $("#login").hide();
  if (account == null) {
    $("#inventory").html(`<p>Please log in to see your inventory</p>`);
    $("#edit_profile").prop("disabled", true);
    $("#login").show();
    $("#logout").hide();
  } else {
    console.log(account.inventory.items[3]);
    loadInventory();
    $("#username").text(account.username);
    $("#profile_pic").attr("src", account.picture);
    $("#email").text(account.email);
  }

  console.log(localStorage);
  $("#logout").click(function () {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });

  $("#edit_profile").click(function () {
    window.location.href = "../templates/editprofile.html";
  });

  $("#login").click(function () {
    window.location.href = "../templates/login.html";
  });

  $("#inventory").on("click", ".listitem", function (e) {
    item = $(this).parent();
    let itemimg = item.find(".img_container")[0].outerHTML;
    let modalbody = listingmodal.find(".modal-body");
    modalbody.html(`
    <h4>${item.find(".item_name").text()}</h4>
    <h6>${item.find(".game_name").text()}</h6>
    ${itemimg}
    <h6>${item.find(".item_price").text()}</h6>
    `);
    console.log(modalbody.html());
    listingmodal.modal("show");
  });

  $("#list_form").submit(async function (e) {
    e.preventDefault();
    let id = item.attr("id");
    let inventory = account.inventory.items;
    let price = $("#price").val();
    if ($.isNumeric(price) == true) {
      price = parseFloat(price).toFixed(2);
      for (var i = 0; i < inventory.length; i++) {
        if (id == inventory[i]._id) {
          item = inventory[i];
          item.price = price;
          inventory.splice(i, 1);
          console.log(inventory);
          break;
        }
      }
      console.log(item);
      postListing(item.name, item.game, item.image, price, account);
      if (localStorage.getItem("history") != null) {
      }
      await sleep(2000);
      account.inventory.items = inventory;
      updateInventory(
        account._id,
        account.email,
        account.username,
        account.password,
        account.picture,
        parseFloat(account.balance).toFixed(2),
        account.inventory
      );
    } else {
      $("#price_small").css("color", "red");
      $("#price_small").text("Please write a valid amount");
    }
  });

  // Creates a new record in listing
  function postListing(name, game, image, price, seller) {
    var jsondata = {
      name: name,
      game: game,
      image: image,
      price: price,
      seller: seller,
    };

    var settings = {
      async: true,
      crossDomain: true,
      url: "https://interactivedev-f58c.restdb.io/rest/listings",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
      processData: false,
      data: JSON.stringify(jsondata),
      beforeSend: function () {
        $(
          "#submit"
        )[0].outerHTML = `<lottie-player src="https://assets6.lottiefiles.com/packages/lf20_kxsd2ytq.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px;margin-left:auto;margin-right:auto;align-self:center;"  loop  autoplay id="spinner"></lottie-player>`;
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }

  // Changes record in database to reflect the item moving to listing
  function updateInventory(id, email, name, pwd, picture, balance, inventory) {
    var jsondata = {
      email: email,
      username: name,
      password: pwd,
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
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      let modalbody = listingmodal.find(".modal-body");
      sessionStorage.setItem("Account", JSON.stringify(response));
      modalbody.html(
        `<h3>Item Listed! </h3><br><h5>Item: ${item.name}</h5><h5>Price: ${item.price}</h5>`
      );
      $("#list_form").hide();
      $("#spinner").hide();
      $("#list_items").on("hidden.bs.modal", function () {
        window.location.reload();
      });
    });
  }

  // Loads inventory from sessionStorage
  function loadInventory() {
    let inventory = account.inventory.items;
    if (inventory.length == 0) {
      $("#inventory").html(
        `<p>You have no items in your inventory. Get some at the marketplace!</p>`
      );
    } else {
      let content = "";
      for (var i = 0; i < inventory.length; i++) {
        let price = parseFloat(inventory[i].price).toFixed(2);
        content = `${content} 
        <div class="item" id=${inventory[i]._id}>
          <h2 class="item_name">${inventory[i].name}</h2>
          <h3 class="game_name">${inventory[i].game}</h3>
          <div class="img_container">
            <img class="img-thumbnail item_img img-fluid" src="${inventory[i].image}">
          </div>
          <h3 class="item_price">Bought for $ ${price}</h3>
          <button class="btn btn-success listitem">List item</button><br>
        </div>
      `;
      }
      $("#inventory").html(content);
    }
  }

  // Delays ajax request due to rest db limitations
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
