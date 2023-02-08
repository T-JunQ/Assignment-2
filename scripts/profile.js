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
    $(".btn").prop("disabled", true);
    $("#login").show();
    $("#logout").hide();
  } else {
    console.log(account.inventory.items[3]);
    loadInventory();
    $("#username").text(account.username);
    $("#profile_pic").attr("src", account.picture);
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
    for (var i = 0; i < inventory.length; i++) {
      if (id == inventory[i]._id) {
        item = inventory[i];
      }
    }
    console.log(item);
    postListing(item.name, item.game, item.image, item.price, account);
    await sleep(2000);
    getItem();
  });

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
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }

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

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
