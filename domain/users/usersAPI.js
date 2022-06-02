const express = require('express');
const router = express.Router();

const { userSchemas } = require('./usersModel');
const usersController = require('./usersController');

const { ctrlWrapper } = require('../../helpers');
const {
  validation,
  validationToken,
  multerUpload,
} = require('../../middlewares');

const ctrl = new usersController();

router.post(
  '/register',
  validation(userSchemas.register),
  ctrlWrapper(ctrl.register)
);

router.post('/login', validation(userSchemas.login), ctrlWrapper(ctrl.login));

router.get('/login/google', ctrlWrapper(ctrl.loginGoogle));

router.get('/login/google-redirect', ctrlWrapper(ctrl.loginGoogleRedirect));

router.get('/current', validationToken, ctrlWrapper(ctrl.current));

router.get('/logout', validationToken, ctrlWrapper(ctrl.logout));

router.patch(
  '/avatars',
  multerUpload.single('image'),
  validationToken,
  ctrlWrapper(ctrl.updateAvatar)
);

module.exports = router;
