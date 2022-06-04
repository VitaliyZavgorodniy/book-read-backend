const express = require('express');
const router = express.Router();

const { bookSchemas } = require('./booksModel');
const BooksController = require('./booksController');

const { ctrlWrapper } = require('../../helpers');
const { validation } = require('../../middlewares');

const ctrl = new BooksController();

router.post('/', validation(bookSchemas.add), ctrlWrapper(ctrl.add));

router.get('/library', ctrlWrapper(ctrl.getLibrary));

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
