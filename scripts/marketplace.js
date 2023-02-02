$("document").ready(function () {
  $("#includehtml").load("header.html");
  let apikey = "63b648a1969f06502871aa39";
  $("#game_filter").change(function () {
    let game = $(this).find(":selected").data("game");
    console.log(game);
    $(".listing game_name").each(function (n) {
      if (n == game) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
  getListings();
  $();
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
        <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_kxsd2ytq.json"  background="transparent"  speed="1"  style="width: 100px; height: 100px;margin-left:46%;align-self:center;"  loop  autoplay></lottie-player>
        `);
      },
    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      let content = "";
      for (var i = 0; i < response.length; i++) {
        console.log(response[i].image[0]);
        content = `
        ${content}
        <div class="listing" id="${response[i]._id}">
        <h2 class="item_name">${response[i].name}</h2>
        <h3 class="game_name">${response[i].game}</h3>
        <div class="img_container">
        <img class="img-thumbnail item_img img-fluid" src="https://interactivedev-f58c.restdb.io/media/63db6dbfaa8607500002bbfe" alt="itemimg">
        </div>
        <h2 class="item_price">$ ${response[i].price}</h2>
        <button class="btn btn-primary" class="addtocart">Add to Cart <i class="fa-solid fa-cart-plus"></i></i></button>
       </div>`;
      }
      $("#mp_listings").html(content);
    });
  }
});
