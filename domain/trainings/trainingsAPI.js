const express = require('express');
const router = express.Router();

const { trainingSchemas } = require('./trainingsModel');
const trainingsController = require('./trainingsController');

const { ctrlWrapper } = require('../../helpers');
const { validation, validationToken } = require('../../middlewares');

const ctrl = new trainingsController();

router.post(
  '/',
  validationToken,
  validation(trainingSchemas.create),
  ctrlWrapper(ctrl.create)
);

router.get('/', validationToken, ctrlWrapper(ctrl.find));

router.post(
  '/add-pages',
  validationToken,
  validation(trainingSchemas.updatePages),
  ctrlWrapper(ctrl.addReadPages)
);

module.exports = router;
