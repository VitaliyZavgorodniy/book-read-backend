const express = require('express');
const router = express.Router();

const { bookSchemas } = require('./booksModel');
const booksController = require('./booksController');

const { ctrlWrapper } = require('../../helpers');
const { validation, validationToken } = require('../../middlewares');

const ctrl = new booksController();

router.post(
  '/search',
  validationToken,
  validation(bookSchemas.searchBook),
  ctrlWrapper(ctrl.searchBooks)
);

router.post(
  '/',
  validationToken,
  validation(bookSchemas.create),
  ctrlWrapper(ctrl.createBook)
);

router.post(
  '/add-review',
  validationToken,
  validation(bookSchemas.addReview),
  ctrlWrapper(ctrl.addReview)
);

router.post(
  '/update-review',
  validationToken,
  validation(bookSchemas.updateReview),
  ctrlWrapper(ctrl.updateReview)
);

router.get(
  '/reviews',
  validationToken,
  ctrlWrapper(ctrl.getReviews)
);

module.exports = router;
