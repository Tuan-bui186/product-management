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

  const productNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
  const newProductNew = productHelper.priceNewProduct(productNew);
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productFeatured: newProductFeatured,
    productNew: productNew,
  });
};
