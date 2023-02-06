$(document).ready(function () {
  $("#includehtml").load("header.html");
  $("#failedbuy").modal("show");
  $("#buy_items").click(function () {
    let checkout = confirm("Are you sure you want to check-out?");

    if (checkout == true) {
      let cart = localStorage.getItem("cart");
      let total = 0;
      for (var i = 0; i < cart.length; i++) {
        let price = parseFloat(cart[i].price);
        total += price;
      }
      let balance = JSON.parse(sessionStorage("Account")).balance;
      if (balance - total >= 0) {
      } else {
        $("#failedbuy").modal("show");
      }
    }
  });
});
