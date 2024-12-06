const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

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

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({ _id: productId });

      productInfo.priceNew = productHelper.priceNewOneProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  await Cart.updateOne(
    { _id: cartId },
    { $pull: { products: { product_id: productId } } }
  );
  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
  res.redirect("back");
};
