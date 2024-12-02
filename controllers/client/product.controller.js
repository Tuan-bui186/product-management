const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const ProductCategory = require("../../models/products-category.model");
const productCategoryHelper = require("../../helpers/product-category");

// [Get] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProduct(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      deleted: false,
      status: "active",
    });

    const listSubCategory = await productCategoryHelper.getSubCategory(
      category.id
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
    }).sort({ position: "desc" });

    const newProducts = productHelper.priceNewProduct(products);

    res.render("client/pages/products/index.pug", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.redirect(`/`);
  }
};
