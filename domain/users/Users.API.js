const express = require("express");
const router = express.Router();

const { userSchemas } = require("./Users.model");
const usersController = require("./Users.controller");

const { ctrlWrapper } = require("../../helpers");
const {
  validation,
  validationToken,
  multerUpload,
} = require("../../middlewares");

const ctrl = new usersController();

router.post(
  "/register",
  validation(userSchemas.register),
  ctrlWrapper(ctrl.register)
);

router.post("/login", validation(userSchemas.login), ctrlWrapper(ctrl.login));

router.post(
  "/login/google",
  validation(userSchemas.loginGoogle),
  ctrlWrapper(ctrl.loginGoogle)
);

router.get("/current", validationToken, ctrlWrapper(ctrl.current));

router.get("/logout", validationToken, ctrlWrapper(ctrl.logout));

router.patch(
  "/avatars",
  multerUpload.single("image"),
  validationToken,
  ctrlWrapper(ctrl.updateAvatar)
);

module.exports = router;
