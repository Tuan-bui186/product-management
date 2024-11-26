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

module.exports.edit = async (req, res) => {
  const id = req.params.id;
  let find = {
    deleted: false,
    _id: id,
  };
  try {
    const data = await Account.findOne(find);

    const roles = await Roles.find({ deleted: false });
    res.render("admin/pages/accounts/edit.pug", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAmin}/accounts`);
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
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
    req.flash("success", "Cập nhật tài khoản thành công");
  }
  res.redirect("back");
};
