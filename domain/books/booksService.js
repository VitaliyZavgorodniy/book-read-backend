const asyncHandler = require('express-async-handler');

const { Book } = require('./booksModel');
const { Library } = require('../libraries/librariesModel');

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

  searchBooks = asyncHandler(async (query) => {
    const result = await Book.find({
      title: { $regex: query, $options: 'i' },
    }).limit(5);

    return result;
  });

  createBook = asyncHandler(async (book, user) => {
    const foundBook = await Book.findById(book.id);

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

  addReview = asyncHandler(async (data, userID) => {
    const { review, bookID } = data;

    const result = await Book.findByIdAndUpdate(
      bookID,
      {
        $push: { reviews: [{ ...review, owner: userID }] },
      },
      { new: true }
    );

    await Library.findOneAndUpdate(
      { owner: userID, 'books._id': bookID },
      { $set: { 'books.$.review': review } }
    );

    return result;
  });

  updateReview = asyncHandler(async (data, userID) => {
    const { review, bookID } = data;

    const result = await Book.findOneAndUpdate(
      { _id: bookID, 'reviews._id': review.id },
      {
        $set: {
          'reviews.$.text': review.text,
          'reviews.$.rating': review.rating,
        },
      },
      { new: true }
    );

    await Library.findOneAndUpdate(
      { owner: userID, 'books._id': bookID },
      { $set: { 'books.$.review': review } }
    );

    return result;
  });
}

module.exports = booksService;
