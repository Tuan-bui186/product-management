const dashboardRouter = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRouter = require("./product.route");
const productCategoryRouter = require("./product-category.route.js");
const rolesRouter = require("./roles.route.js");
const accountRouter = require("./account.route.js");
const authRouter = require("./auth.route.js");
const authMiddleware = require("../../middlewares/admin/auth.middleware.js");

const PATH_ADMIN = systemConfig.prefixAmin;
module.exports = (app) => {
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRouter
  );
  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRouter);
  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRouter
  );
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, rolesRouter);
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRouter);
  app.use(PATH_ADMIN + "/auth", authRouter);
};
