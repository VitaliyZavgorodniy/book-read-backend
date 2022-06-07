const express = require('express');
const router = express.Router();

const { librarySchemas } = require('./librariesModel');
const librariesController = require('./librariesController');

const { ctrlWrapper } = require('../../helpers');
const { validation, validationToken } = require('../../middlewares');

const ctrl = new librariesController();

router.get('/', validationToken, ctrlWrapper(ctrl.getLibrary));

module.exports = router;
