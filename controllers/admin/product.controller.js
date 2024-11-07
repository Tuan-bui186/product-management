const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

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

  const objectPagination = {
    currentPage: 1,
    limitItem: 4,
  };

  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;

  const product = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  const countProduct = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProduct / objectPagination.limitItem);
  objectPagination.totalPage = totalPage;

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    product: product,
    filter: filter,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
