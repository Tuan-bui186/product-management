const ProductCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecord = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecord,
  });
};

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecord = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    records: newRecord,
  });
};

module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countPosition = await ProductCategory.countDocuments();
    req.body.position = countPosition + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAmin}/products-category`);
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    const record = await ProductCategory.find({ deleted: false });
    const newRecord = createTreeHelper.tree(record);
    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      record: newRecord,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAmin}/products-category`);
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  await ProductCategory.updateOne({ _id: id }, req.body);
  req.flash("success", "Cập nhật danh mục thành công!");
  res.redirect("back");
};
