const md5 = require("md5");
const Account = require("../../models/accounts");
const systemConfig = require("../../config/system");

module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Trang đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash("error", `Email ${email} không tồn tại`);
    res.redirect("back");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu`);
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", `Tài khoản ${user.email} đã bị khóa!`);
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAmin}/dashboard`);
};

module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAmin}/auth/login`);
};
