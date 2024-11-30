const Account = require("../../models/accounts");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Thông tin tài khoản",
  });
};

module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa tài khoản",
  });
};

module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
    _id: { $ne: id },
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thông tin cá nhân thành công");
  }
  res.redirect("back");
};
