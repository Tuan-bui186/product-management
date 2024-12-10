const productRouter = require("./products.route");
const homeRouter = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const searchRoute = require("./search.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use("/", homeRouter);
  app.use("/products", productRouter);
  app.use("/search", searchRoute);
  app.use("/cart", cartRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/user", userRouter);
};
