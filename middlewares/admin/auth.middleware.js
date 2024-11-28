const { prefixAmin } = require("../../config/system");
const Account = require("../../models/accounts");
const Roles = require("../../models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${prefixAmin}/auth/login`);
  } else {
    const user = await Account.findOne({ token: req.cookies.token }).select(
      "-password"
    );
    if (!user) {
      res.redirect(`${prefixAmin}/auth/login`);
    } else {
      const role = await Roles.findOne({ _id: user.role_id }).select(
        "title permissions"
      );
      res.locals.user = user;
      res.locals.role = role;
      next();
    }
  }
};
