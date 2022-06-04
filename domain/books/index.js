const booksRouter = require('./booksAPI');
const booksService = require('./booksService');
const booksController = require('./booksController');
const { Book, bookSchemas } = require('./booksModel');

module.exports = {
  booksRouter,
  booksService,
  booksController,
  Book,
  bookSchemas,
};
