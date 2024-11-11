const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });

router.get("/", controller.product);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
router.get("/create", controller.create);
router.post("/create", upload.single("thumbnail"), controller.createPost);

module.exports = router;
