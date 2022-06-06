const express = require('express');
const router = express.Router();

const { bookSchemas } = require('../books/booksModel');
const libraryController = require('./libraryController');

const { ctrlWrapper } = require('../../helpers');
const { validation } = require('../../middlewares');

const ctrl = new libraryController();

// router.post('/', validation(bookSchemas.add), ctrlWrapper(ctrl.add));

router.patch('/library', ctrlWrapper(ctrl.findOneAndUpdate));

// router.post('/login', validation(userSchemas.login), ctrlWrapper(ctrl.login));

// router.get('/login/google-redirect', ctrlWrapper(ctrl.loginGoogleRedirect));

// router.get('/current', validationToken, ctrlWrapper(ctrl.current));

// router.get('/logout', validationToken, ctrlWrapper(ctrl.logout));

// router.patch(
//   '/avatars',
//   multerUpload.single('image'),
//   validationToken,
//   ctrlWrapper(ctrl.updateAvatar)
// );

module.exports = router;
