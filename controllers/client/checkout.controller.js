const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/product");
const Order = require("../../models/order");

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
  res.render("client/pages/checkout/index.pug", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({ _id: cartId });
  let products = [];
  for (const item of cart.products) {
    const objectProduct = {
      product_id: item.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: item.quantity,
    };
    const productInfo = await Product.findOne({ _id: item.product_id });
    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }
  const objectOrder = {
    card_id: cartId,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(objectOrder);
  await order.save();

  await Order.updateOne({ _id: cartId }, { products: [] });
  res.redirect(`/checkout/success/${order.id}`);
};

module.exports.success = async (req, res) => {
  const id = req.params.orderId;
  const order = await Order.findOne({ _id: id });
  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");
    product.productInfo = productInfo;
    product.priceNew = productHelper.priceNewOneProduct(product);
    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/pages/checkout/success.pug", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
