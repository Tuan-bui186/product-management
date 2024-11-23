const Roles = require("../../models/roles.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Roles.find(find);

  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Thêm mới nhóm quyền",
  });
};

module.exports.createPost = async (req, res) => {
  const records = new Roles(req.body);
  await records.save();
  req.flash("success", "Tạo mới quyền thành công!");
  res.redirect(`${systemConfig.prefixAmin}/roles`);
};
