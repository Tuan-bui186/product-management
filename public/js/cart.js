const inputQuantity = document.querySelectorAll("input[name = 'quantity']");
if (inputQuantity.length > 0) {
  inputQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      console.log(e.target.value);
      const productId = input.getAttribute("product-id");
      const quantity = input.value;

      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}
