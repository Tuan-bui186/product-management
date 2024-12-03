const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];

  if (keyword) {
    const regex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: regex,
      deleted: false,
      status: "active",
    });
    newProducts = productHelper.priceNewProduct(products);
  }
  res.render("client/pages/search/index.pug", {
    pageTitle: "Tìm kiếm sản phẩm",
    products: newProducts,
    keyword: keyword,
  });
};
