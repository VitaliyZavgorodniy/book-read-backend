const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const queryString = require('query-string');
const axios = require('axios');

const { jwtGenerator } = require('../../helpers');

const { Book } = require('./booksModel');

// const { FRONTEND_URL, GOOGLE_CLIENT, GOOGLE_SECRET, BASE_URL } = process.env;

class booksService {
  findBook = asyncHandler(async (parameter) => {
    const result = await Book.findOne(parameter, '-createdAt -updatedAt');

    return result ?? null;
  });

  findBooks = asyncHandler(async () => {
    const result = await Book.find({ owner: _id }).populate('owner');
    console.log(result);
    return result ?? null;
  });

  updateBookById = asyncHandler(async (id, payload) => {
    const result = await Book.findOneAndUpdate(id, payload);

    return result;
  });

  addBook = asyncHandler(async ({ title, author, pages, year, status }) => {
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
  });

  // loginUser = asyncHandler(async ({ email, password }) => {
  //   const user = await this.findUser({ email }, '-createdAt -updatedAt');

  //   if (!user) {
  //     throw NotFound('User not found');
  //   }

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) throw createError(401, 'Email or password is wrong');

  //   const token = await this.userTokenUpdate(user._id);

  //   return { token };
  // });
}

module.exports = booksService;
