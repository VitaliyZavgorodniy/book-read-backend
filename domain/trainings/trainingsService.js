const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const { Training } = require('./trainingsModel');
const { Book } = require('../books/booksModel');
const { User } = require('../users/usersModel');

const librariesService = require('../libraries/librariesService');

const libServ = new librariesService();

class trainingsService {
  findTraining = asyncHandler(async (parameter) => {
    const result = await Training.findOne(parameter, '-createdAt -updatedAt');

    if (!result) throw createError(500, 'Training was not found!');

    return result;
  });

  getTraining = asyncHandler(async (userID) => {
    const training = await Training.findOne(
      { owner: userID },
      '-createdAt -updatedAt'
    );

    return training;
  });

  createTraining = asyncHandler(async (training, user) => {
    const foundTraining = await this.getTraining(user._id);

    if (foundTraining?.inProgress)
      throw createError(401, 'Training is already started');

    const booksArray = await Book.find({ _id: training.books });

    if (!booksArray?.length)
      throw createError(401, 'Books for training was not found');

    const booksList = booksArray.map((book) => ({
      ...book._doc,
    }));

    const pagesAmount = booksList
      .map((item) => item.pages)
      .reduce((acc, value) => acc + Number(value), 0);

    const newTraining = {
      startDate: training.startDate,
      endDate: training.endDate,
      inProgress: true,
      owner: user._id,
      books: booksList,
      pagesAmount,
      stats: [],
    };

    if (!foundTraining) await Training.create(newTraining);

    if (foundTraining)
      await Training.findOneAndUpdate({ owner: user._id }, newTraining);

    const result = await this.getTraining(user._id);

    result.books.forEach(async (book) => {
      await libServ.updateBookStatus('reading', book.id, user);
    });

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { isOnTraining: true } }
    );

    return result;
  });

  addReadPagesToStat = asyncHandler(async (stat, user) => {
    const foundTraining = await this.getTraining(user._id);

    if (!foundTraining) throw createError(401, 'Training was not found');

    await Training.findOneAndUpdate(
      { owner: user._id, 'books._id': stat.bookId },
      {
        $push: {
          stats: stat,
        },
        $inc: {
          'books.$.pagesRead': stat.pages,
        },
      }
    );

    const result = await this.handleTrainingEnd(user);

    return result;
  });

  handleTrainingEnd = asyncHandler(async (user) => {
    const { books: booksList } = await this.getTraining(user._id);

    booksList.forEach(async ({ _id, pages, pagesRead, isCompleted }) => {
      if (pages <= pagesRead && !isCompleted) {
        libServ.updateBookStatus('completed', _id, user);

        const { books } = await Training.findOneAndUpdate(
          { owner: user._id, 'books._id': _id },
          {
            $set: {
              'books.$.isCompleted': true,
            },
          },
          {
            new: true,
          }
        );

        const filteredBooks = books.filter(({ isCompleted }) => !isCompleted);

        if (filteredBooks.length === 0) {
          await Training.findOneAndUpdate(
            { owner: user._id },
            { inProgress: false }
          );

          await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { isOnTraining: false } }
          );
        }
      }
    });

    const result = await this.getTraining(user._id);

    return result;
  });

  updateTrainingBookStatus = asyncHandler(async (status, bookID, user) => {
    await Training.findOneAndUpdate(
      { owner: user._id, 'books.id': bookID },
      {
        $set: {
          'books.$.status': status,
        },
      }
    );
  });
}

module.exports = trainingsService;
