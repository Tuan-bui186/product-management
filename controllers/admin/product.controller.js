const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");

// [Get] /admin/products
module.exports.product = async (req, res) => {
  const filter = filterStatusHelper(req.query);
  console.log(filter);
  let find = {
    deleted: false,
  };

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");

    find.title = regex;
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  const product = await Product.find(find);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    product: product,
    filter: filter,
    keyword: keyword,
  });
};
