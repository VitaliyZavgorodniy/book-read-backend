const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const queryString = require('query-string');
const axios = require('axios');

const { jwtGenerator } = require('../../helpers');

const { Book } = require('../books');

class libraryService {
  findBook = asyncHandler(async (parameter) => {
    const result = await Book.findOne(parameter, '-createdAt -updatedAt');

    return result ?? null;
  });

  findBooks = asyncHandler(async () => {
    const result = await Book.find({ owner: _id }).populate('owner');
    return result ?? null;
  });

  updateBookById = asyncHandler(async (id, payload) => {
    const isValid = isValidObjectId(id);
    if (!isValid) {
      throw createError(404);
    }
    const result = await Book.findOneAndUpdate(id, payload);

    return result;
  });

  addBookToLibrary = asyncHandler(
    async ({ title, author, pages, year, status }) => {
      const result = await this.findBook({ title });

      if (result) {
        throw createError(409, 'Book exist');
      }

      const book = await Book.create({
        title,
        author,
        pages,
        year,
        status,
      });
    }
  );
}

module.exports = libraryService;
