const asyncHandler = require('express-async-handler');

const { Library } = require('./librariesModel');

class librariesService {
  findLibrary = asyncHandler(async (parameter) => {
    const result = await Library.findOne(parameter, '-createdAt -updatedAt');

    return result;
  });

  findSortedLibrary = asyncHandler(async (parameter) => {
    const { books } = await Library.findOne(parameter, '-createdAt -updatedAt');

    const pending = books.filter((book) => book.status === 'pending');
    const reading = books.filter((book) => book.status === 'reading');
    const completed = books.filter((book) => book.status === 'completed');

    return { pending, reading, completed };
  });

  addBookToLibrary = asyncHandler(async (book, user) => {
    const foundLibrary = await this.findLibrary({ owner: user._id });

    const inserBook = {
      _id: book._id,
      title: book.title,
      author: book.author,
      year: book.year,
      pages: book.pages,
      status: 'pending',
    };

    if (foundLibrary) {
      await Library.findOneAndUpdate(
        {
          _id: foundLibrary._id,
        },
        { $push: { books: [inserBook] } }
      );
    }

    if (!foundLibrary) {
      await Library.create({
        owner: user._id,
        books: [inserBook],
      });
    }

    const result = await this.findSortedLibrary({ owner: user._id });

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
