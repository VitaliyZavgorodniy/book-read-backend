const express = require('express');
const router = express.Router();

const { bookSchemas } = require('./booksModel');
const BooksController = require('./booksController');

const { ctrlWrapper } = require('../../helpers');
const {
  validationToken,
  validation,
  validationId,
} = require('../../middlewares');

const ctrl = new BooksController();

router.post(
  '/',
  validationToken,
  validation(bookSchemas.add),
  ctrlWrapper(ctrl.addBook)
);

router.get('/library', validationToken, ctrlWrapper(ctrl.getLibrary));

// router.patch('/login', validation(userSchemas.login), ctrlWrapper(ctrl.login));

// router.get('/login/google-redirect', ctrlWrapper(ctrl.loginGoogleRedirect));

// router.get('/current', validationToken, ctrlWrapper(ctrl.current));

// router.get('/logout', validationToken, ctrlWrapper(ctrl.logout));

router.patch(
  ':id/resume',
  validationToken,
  validation(bookSchemas.resume),
  ctrlWrapper(ctrl.addResume)
);

module.exports = router;
