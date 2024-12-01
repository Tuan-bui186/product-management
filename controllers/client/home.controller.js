const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

// [Get] /
module.exports.index = async (req, res) => {
  const productFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);
  const newProductFeatured = productHelper.priceNewProduct(productFeatured);
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productFeatured: newProductFeatured,
  });
};
