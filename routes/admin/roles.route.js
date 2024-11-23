const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller");
const rolesValidate = require("../../validates/admin/roles.validate");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", rolesValidate.createPost, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", rolesValidate.createPost, controller.editPatch);

module.exports = router;
