const productRouter = require("./products.route");
const homeRouter = require("./home.route");

module.exports = (app) => {
  app.use("/", homeRouter);
  app.use("/products", productRouter);
};
