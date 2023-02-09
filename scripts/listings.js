$("document").ready(function () {
  $("#includehtml").load("header.html");
  let apikey = "63b648a1969f06502871aa39";
  let modal = $("#addedtocart");

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
        if ("") var price = parseFloat(response[i].price).toFixed(2);
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
    });
  }
});
