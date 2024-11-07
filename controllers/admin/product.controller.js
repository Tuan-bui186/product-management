const Product = require("../../models/product.model");

// [Get] /admin/products
module.exports.product = async (req, res) => {
  let filter = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  if (req.query.status) {
    const index = filter.findIndex((item) => item.status == req.query.status);
    filter[index].class = "active";
  } else {
    const index = filter.findIndex((item) => item.status == "");
    filter[index].class = "active";
  }

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

  console.log(product);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    product: product,
    filter: filter,
    keyword: keyword,
  });
};
