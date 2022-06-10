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

module.exports = router;
