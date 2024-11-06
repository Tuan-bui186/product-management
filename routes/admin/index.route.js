const dashboardRouter = require("./dashboard.route");
const systemConfig = require("../../config/system");

const PATH_ADMIN = systemConfig.prefixAmin;
module.exports = (app) => {
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter);
};
