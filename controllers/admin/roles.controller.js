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

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await Roles.findOne({ _id: id, deleted: false });

    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      records: records,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAmin}/roles`);
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  await Roles.updateOne({ _id: id }, req.body);
  req.flash("success", "Chỉnh sửa nhóm quyền thành công!");
  res.redirect("back");
};

module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Roles.find(find);

  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    await Roles.updateOne({ _id: item.id }, { permissions: item.permissions });
  }
  req.flash("success", "Cập nhật phân quyền thành công!");
  res.redirect("back");
};
