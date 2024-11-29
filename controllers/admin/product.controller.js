const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/products-category.model");
const Account = require("../../models/accounts");

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

  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullname;
    }

    const updateBy = product.updateBy.slice(-1)[0];
    if (updateBy) {
      const userUpdated = await Account.findOne({ _id: updateBy.account_id });
      updateBy.accountFullName = userUpdated.fullname;
    }
  }

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    product: products,
    filter: filter,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updateBy = {
    account_id: res.locals.user.id,
    updateAt: new Date(),
  };
  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updateBy: updateBy } }
  );
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};

// [Patch] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updateBy = {
    account_id: res.locals.user.id,
    updateAt: new Date(),
  };
  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { $push: { updateBy: updateBy }, status: "active" }
      );
      req.flash("success", "Cập nhật trạng thái thành công!");
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { $push: { updateBy: updateBy }, status: "inactive" }
      );
      req.flash("success", "Cập nhật trạng thái thành công!");
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deleteBY: { account_id: res.locals.user.id, deleteAt: new Date() },
        }
      );
      req.flash("success", "Xóa sản phẩm thành công!");
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          { position: position, $push: { updateBy: updateBy } }
        );
      }
      req.flash("success", "Thay đổi vị trí thành công!");
      break;
    default:
      break;
  }
  res.redirect("back");
};

// [delete] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteBY: {
        account_id: res.locals.user.id,
        deleteAt: new Date(),
      },
    }
  );
  req.flash("success", "Xóa sản phẩm thành công!");
  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create.pug", {
    pageTitle: "thêm mới sản phẩm",
    category: newCategory,
  });
};

// [Post] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countPosition = await Product.countDocuments();
    req.body.position = countPosition + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createBy = {
    account_id: res.locals.user.id,
  };

  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAmin}/products`);
};

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);

    const category = await ProductCategory.find({
      deleted: false,
    });
    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit.pug", {
      pageTitle: "chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAmin}/products`);
  }
};

module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  try {
    const updateBy = {
      account_id: res.locals.user.id,
      updateAt: new Date(),
    };

    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updateBy: updateBy },
      }
    );
    req.flash("success", "Chỉnh sửa sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Chỉnh sửa sản phẩm thất bại!");
  }

  res.redirect("back");
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAmin}/products`);
  }
};
