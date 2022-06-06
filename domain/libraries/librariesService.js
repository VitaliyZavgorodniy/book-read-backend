const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const queryString = require('query-string');
const axios = require('axios');

const { Library } = require('./libraryModel');

class librariesService {
  findBook = asyncHandler(async (parameter) => {
    const result = await Book.findOne(parameter, '-createdAt -updatedAt');

    return result ?? null;
  });

  createBook = asyncHandler(async (book, user) => {
    const foundBook = await this.findBook({ _id: book.id });

    let newBook = null;

    if (!foundBook) {
      const { title, author, year, pages } = book;

      const createdBook = await Book.create({ title, author, year, pages });

      newBook = createdBook;
    }

    console.log({ newBook });

    // added book in library

    console.log({ foundBook });
  });
}

module.exports = librariesService;
