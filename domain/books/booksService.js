const asyncHandler = require('express-async-handler');

const { Book } = require('./booksModel');

const librariesService = require('../libraries/librariesService');

const libService = new librariesService();

class booksService {
  findBook = asyncHandler(async (parameter) => {
    const result = await Book.findOne(parameter, '-createdAt -updatedAt');

    return result ?? null;
  });

  findBooksById = asyncHandler(async (IDarray) => {
    const result = await Book.find({ _id: IDarray });

    return result;
  });

  createBook = asyncHandler(async (book, user) => {
    const foundBook = await this.findBook({ _id: book.id });

    if (foundBook) {
      const result = await libService.addBookToLibrary(foundBook, user);

      return result;
    }

    if (!foundBook) {
      const { title, author, year, pages } = book;

      const createdBook = await Book.create({ title, author, year, pages });

      const result = await libService.addBookToLibrary(createdBook, user);

      return result;
    }
  });
}

module.exports = booksService;
