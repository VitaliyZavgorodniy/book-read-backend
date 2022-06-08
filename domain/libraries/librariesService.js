const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const { Library } = require('./librariesModel');

const booksService = require('../books/booksService');

const booksServ = new booksService();

class librariesService {
  findLibrary = asyncHandler(async (parameter) => {
    const result = await Library.findOne(parameter, '-createdAt -updatedAt');

    return result;
  });

  findSortedLibrary = asyncHandler(async (parameter) => {
    const result = await Library.findOne(parameter, '-createdAt -updatedAt');

    if (!result) return { total: 0, pending: [], reading: [], completed: [] };

    const { books } = result;

    const pending = books.filter((book) => book.status === 'pending');
    const reading = books.filter((book) => book.status === 'reading');
    const completed = books.filter((book) => book.status === 'completed');

    return { total: books?.length, pending, reading, completed };
  });

  addBookToLibrary = asyncHandler(async (bookId, user) => {
    const foundLibrary = await this.findLibrary({ owner: user._id });

    const booksServ = new booksService();

    const foundBook = await booksServ.findBook({ _id: bookId });

    if (!foundBook) throw createError(401, 'Book not found in Database');

    const insertingBook = {
      ...foundBook,
      status: 'pending',
    };

    if (!foundLibrary) {
      await Library.create({
        owner: user._id,
        books: [insertingBook],
      });
    }

    if (foundLibrary) {
      await Library.findOneAndUpdate(
        {
          _id: foundLibrary._id,
        },
        { $push: { books: [insertingBook] } }
      );
    }

    const result = await this.findSortedLibrary({ owner: user._id });

    return result;
  });

  updateBookStatus = asyncHandler(async (status, bookID, user) => {
    console.log({ status, bookID, user });

    const updatedLibrary = await Library.findOneAndUpdate(
      { owner: user._id, 'books._id': bookID },
      {
        $set: {
          'books.$.status': status,
        },
      }
    );

    return updatedLibrary;
  });
}

module.exports = librariesService;
