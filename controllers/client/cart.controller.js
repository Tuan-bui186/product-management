const Cart = require("../../models/cart.model");

module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (existProductInCart) {
    const quantityNew = quantity + existProductInCart.quantity;
    console.log(quantityNew);
    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId },
      { $set: { "products.$.quantity": quantityNew } }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } });
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
  res.redirect("back");
};