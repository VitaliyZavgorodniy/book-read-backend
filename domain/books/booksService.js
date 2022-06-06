const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const queryString = require('query-string');
const axios = require('axios');

const { jwtGenerator } = require('../../helpers');

const { Book } = require('./booksModel');

class booksService {
  findBook = asyncHandler(async (parameter) => {
    const result = await Book.findOne(parameter, '-createdAt -updatedAt');

    return result ?? null;
  });

  addBook = asyncHandler(async (req, res) => {
    const { title } = req.params;
    const result = await this.findBook({ title });

    if (result) {
      throw createError(409, 'Book exist');
    }
    const { _id } = req.user;
    const book = await Book.create({ ...req.body, owner: _id });
    return book;
  });
  findBooks = asyncHandler(async (owner) => {
    const result = await Book.find(owner, '-createdAt -updatedAt').populate(
      'owner',
      'email'
    );
    return result ?? null;
  });
  deliteBook = asyncHandler(async (id) => {
    const result = await Book.findByIdAndDelete(id);
  });
  addResume = asyncHandler(async ({ id, resume }) => {
    const result = await Book.findOneAndUpdate({ id }, resume, {
      new: true,
    });
    if (!result) {
      throw createError(409, 'Book not exist');
    }
    console.log(result);
    return result;
  });
}
module.exports = booksService;


