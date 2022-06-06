const express = require('express');
const router = express.Router();

const { librarySchemas } = require('./booksModel');
const librariesController = require('./booksController');

const { ctrlWrapper } = require('../../helpers');
const { validation, validationToken } = require('../../middlewares');

const ctrl = new librariesController();

router.post(
  '/add-book',
  validationToken,
  validation(librarySchemas.addBook),
  ctrlWrapper(ctrl.createBook)
);

router.delete(
  '/remove-book',
  validationToken,
  validation(librarySchemas.removeBook),
  ctrlWrapper(ctrl.removeBookFromLibrary)
);

module.exports = router;
