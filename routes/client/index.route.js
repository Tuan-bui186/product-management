const productRouter = require("./products.route");
const homeRouter = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const searchRoute = require("./search.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use("/", homeRouter);
  app.use("/products", productRouter);
  app.use("/search", searchRoute);
  app.use("/cart", cartRouter);
  app.use("/checkout", checkoutRouter);
};
