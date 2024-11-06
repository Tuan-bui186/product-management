const Product = require("../../models/product.model");

// [Get] /admin/products
module.exports.product = async (req, res) => {
  const product = await Product.find({
    deleted: false,
  });

  console.log(product);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    product: product,
  });
};
