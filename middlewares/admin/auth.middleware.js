const { prefixAmin } = require("../../config/system");
const Account = require("../../models/accounts");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${prefixAmin}/auth/login`);
  } else {
    const users = await Account.findOne({ token: req.cookies.token });
    if (!users) {
      res.redirect(`${prefixAmin}/auth/login`);
    } else {
      next();
    }
  }
};
