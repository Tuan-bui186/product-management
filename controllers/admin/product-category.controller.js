const ProductCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Thêm mới danh mục sản phẩm",
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
