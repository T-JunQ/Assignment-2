$("document").ready(function () {
  $("#includehtml").load("header.html");
  let apikey = "63b648a1969f06502871aa39";
  let modal = $("#addedtocart");
  let cart = JSON.parse(localStorage.getItem("cart"));
  getListings();

  $("#game_filter").change(function () {
    filter();
  });

  $("#price_filter").change(function () {
    filter();
  });

  $("#sortby_filter").change(function () {
    let sortby = $(this).find(":selected").data("sortby");
    let listings = $(".listing");
    listings
      .sort(function (a, b) {
        let aprice = $(".item_price", a).text();
        aprice = parseFloat(aprice.substring(1));
        console.log(aprice);
        let bprice = $(".item_price", b).text();
        bprice = parseFloat(bprice.substring(1));
        if (sortby == "asc") {
          return aprice - bprice;
        } else if (sortby == "desc") {
          return bprice - aprice;
        } else if (sortby == "") {
          return 0;
        }
      })
      .appendTo("#mp_listings");
  });

  $("#search_input").keyup(function (e) {
    let input = $("#search_input").val().toUpperCase();
    input = input.trim();
    console.log(input);
    let itemnames = $(".listing > .item_name");
    itemnames.each(function () {
      let name = $(this).text().toUpperCase();
      if (name.indexOf(input) != -1) {
        $(this).parent().show();
      } else {
        $(this).parent().hide();
      }
    });
  });

  $("#mp_listings").on("click", ".addtocart", function (e) {
    var allListings = JSON.parse(sessionStorage.getItem("listings"));
    let id = $(this).parent().attr("id");
    let modalbody = modal.find(".modal-body");
    console.log(allListings);
    for (var i = 0; i < allListings.length; i++) {
      if (allListings[i]._id == id) {
        listing = allListings[i];
      }
    }
    if (localStorage.getItem("cart") == null) {
      let array = [listing];
      localStorage.setItem("cart", JSON.stringify(array));
    } else {
      console.log(localStorage.getItem("cart"));
      let cartitems = JSON.parse(localStorage.getItem("cart"));
      cartitems.push(listing);
      localStorage.setItem("cart", JSON.stringify(cartitems));
    }
    console.log(localStorage.getItem("cart"));
    modalbody.html(
      `Item Name: ${listing.name}<br>Item Price: $ ${listing.price}`
    );
    modal.modal("show");
    $(this).parent().hide();
  });

  function filter() {
    let start = parseFloat($("#price_filter").find(":selected").data("start"));
    let end = parseFloat($("#price_filter").find(":selected").data("end"));
    let game = $("#game_filter").find(":selected").data("game");
    console.log(game);
    let listings = $(".listing");
    listings.each(function () {
      let gamename = $(this).children(".game_name").text();
      console.log(gamename);
      let price = $(this).children(".item_price").text();
      price = price.substring(1);
      console.log(price);
      if ((gamename == game) & (start < price) & (price < end)) {
        $(this).show();
      } else {
        $(this).hide();
      }
      if (game == "any") {
        if ((start < price) & (price < end)) {
          $(this).show();
        }
      }
    });
  }

  function getListings() {
    var settings = {
      async: true,
      crossDomain: true,
      url: "https://interactivedev-f58c.restdb.io/rest/listings",
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-apikey": apikey,
        "cache-control": "no-cache",
      },
      beforeSend: function () {
        $("#mp_listings").html(`
        <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_kxsd2ytq.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px;margin-left:auto;margin-right:auto;align-self:center;"  loop  autoplay></lottie-player>
        `);
      },
    };
    $.ajax(settings).done(function (response) {
      sessionStorage.setItem("listings", JSON.stringify(response));
      let content = "";
      for (var i = 0; i < response.length; i++) {
        var price = parseFloat(response[i].price).toFixed(2);
        content = `
        ${content}
        <div class="listing" id="${response[i]._id}">
          <h2 class="item_name">${response[i].name}</h2>
          <h3 class="game_name">${response[i].game}</h3>
          <div class="img_container">
            <img class="img-thumbnail item_img img-fluid" src="${response[i].image}" alt="itemimg" onerror="this.src='../pics/logo-no-background - Copy (2).png'">
          </div>
          <h2 class="item_price">$ ${price}</h2>
          <button class="btn btn-primary addtocart">Add to Cart <i class="fa-solid fa-cart-plus"></i></i></button>
          <div class="seller">
            <img class="seller_pic" src="${response[i].seller[0].picture}" alt="profilepic"
                onerror="src='../pics/vecteezy_profile-icon-design-vector_5544718.jpg'"  width="15px" height="15px">
            <h4 class="seller_name">${response[i].seller[0].username}</h4>
          </div>
        </div>`;
      }
      $("#mp_listings").html(content);
      let buyer = JSON.parse(sessionStorage.getItem("Account")).username;

      $(".listing").each(function () {
        let seller = $(this).children("div.seller").text().trim();

        if (cart != null) {
          for (var i = 0; i < cart.length; i++) {
            if (cart[i]._id == $(this).attr("id")) {
              $(this).hide();
            }
          }
        }
        if (seller == buyer) {
          console.log(seller);
          $(this).hide();
        }
      });
    });
  }
});
