const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [Get] /admin/products
module.exports.product = async (req, res) => {
  const filter = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };

  let objectSearch = searchHelper(req.query);

  if (objectSearch.keyword) {
    find.title = objectSearch.regex;
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  const countProduct = await Product.countDocuments(find);
  const objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProduct
  );

  const product = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    product: product,
    filter: filter,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [Get] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  res.redirect("back");
};
