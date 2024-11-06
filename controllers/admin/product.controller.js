module.exports.product = (req, res) => {
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
  });
};
