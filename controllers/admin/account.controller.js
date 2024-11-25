const Account = require("../../models/accounts");
const systemConfig = require("../../config/system");
const Roles = require("../../models/roles.model");
const md5 = require("md5");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Roles.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

module.exports.create = async (req, res) => {
  const records = await Roles.find({ deleted: false });
  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Thêm mới tài khoản",
    records: records,
  });
};

module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const records = new Account(req.body);
    await records.save();
    req.flash("success", "Tạo mới tài khoản thành công");
    res.redirect(`${systemConfig.prefixAmin}/accounts`);
  }
};
