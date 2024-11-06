const dashboardRouter = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRouter = require("./product.route");

const PATH_ADMIN = systemConfig.prefixAmin;
module.exports = (app) => {
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter);
  app.use(PATH_ADMIN + "/products", productRouter);
};
