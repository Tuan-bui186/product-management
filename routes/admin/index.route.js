const dashboardRouter = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRouter = require("./product.route");
const productCategoryRouter = require("./product-category.route.js");
const rolesRouter = require("./roles.route.js");
const accountRouter = require("./account.route.js");
const authRouter = require("./auth.route.js");

const PATH_ADMIN = systemConfig.prefixAmin;
module.exports = (app) => {
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter);
  app.use(PATH_ADMIN + "/products", productRouter);
  app.use(PATH_ADMIN + "/products-category", productCategoryRouter);
  app.use(PATH_ADMIN + "/roles", rolesRouter);
  app.use(PATH_ADMIN + "/accounts", accountRouter);
  app.use(PATH_ADMIN + "/auth", authRouter);
};
