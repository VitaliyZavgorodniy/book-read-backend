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

  createBook = asyncHandler(async (book, userID) => {
    const foundBook = await Book.findById(book.id);

    if (foundBook) {
      libService.addBookToLibrary(foundBook, userID);

      return foundBook;
    }

    if (!foundBook) {
      const { title, author, year, pages } = book;

      const createdBook = await Book.create({ title, author, year, pages });

      await libService.addBookToLibrary(createdBook, userID);

      return createdBook;
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
      { _id: bookID, 'reviews.owner': userID },
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

  getReviews = asyncHandler(async (userID) => {
    const booksList = await Book.find({
      'reviews.0': { $exists: true },
    }).populate({
      path: 'reviews',
      populate: {
        path: 'owner',
        select: '-_id -password -email -token -createdAt -updatedAt',
      },
    });

    let library = await Library.findOne({ owner: userID });

    if (!library) library = { books: [] };

    const result = booksList.map((book) => {
      if (library.books.some(({ title }) => title === book.title)) {
        return { ...book._doc, isOwned: true };
      }

      return { ...book._doc, isOwned: false };
    });

    return result;
  });
}

module.exports = booksService;
