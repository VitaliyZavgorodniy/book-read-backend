const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const { Library } = require('./librariesModel');
const { Book } = require('../books/booksModel');

class librariesService {
  findLibrary = asyncHandler(async (parameter) => {
    const result = await Library.findOne(parameter, '-createdAt -updatedAt');

    return result;
  });

  findSortedLibrary = asyncHandler(async (parameter, user) => {
    const result = await Library.findOne(parameter, '-createdAt -updatedAt');

    if (!result) return { total: 0, pending: [], reading: [], completed: [] };

    const { books } = result;

    const pending = books.filter((book) => book.status === 'pending').reverse();
    const reading = books.filter((book) => book.status === 'reading');
    const completed = books.filter((book) => book.status === 'completed');

    return { total: books?.length, pending, reading, completed };
  });

  addBookToLibrary = asyncHandler(async (book, user) => {
    const insertingBook = {
      _id: book._id,
      title: book.title,
      author: book.author,
      year: book.year,
      pages: book.pages,
      status: 'pending',
    };

    const foundLibrary = await Library.findOne({ owner: user._id });

    if (!foundLibrary) {
      await Library.create({
        owner: user._id,
        books: [insertingBook],
      });
    }

    if (foundLibrary) {
      const searchBookInLibrary = await Library.findOne({
        owner: user._id,
        'books._id': book._id,
      });

      if (searchBookInLibrary)
        throw createError(401, 'Book is already in library');

      await Library.findOneAndUpdate(
        { owner: user._id },
        { $push: { books: [insertingBook] } }
      );
    }

    const result = await this.findSortedLibrary({ owner: user._id }, user);

    return result;
  });

  updateBookStatus = asyncHandler(async (status, bookID, user) => {
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
