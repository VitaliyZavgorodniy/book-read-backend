const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const { Training } = require('./trainingsModel');
const { Book } = require('../books/booksModel');

const librariesService = require('../libraries/librariesService');

const libServ = new librariesService();

class trainingsService {
  findTraining = asyncHandler(async (parameter) => {
    const result = await Training.findOne(parameter, '-createdAt -updatedAt');

    return result;
  });

  createTraining = asyncHandler(async (training, user) => {
    const foundTraining = await this.findTraining({ owner: user._id });

    // if (foundTraining?.inProgress)
    //   throw createError(401, 'Training is already started');

    const booksArray = await Book.find({ _id: training.books });

    if (!booksArray?.length)
      throw createError(401, 'Books for training was not found');

    const booksList = booksArray.map((book) => ({
      ...book._doc,
      pagesRead: 0,
      status: 'reading',
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

    if (foundTraining && !foundTraining.inProgress)
      await Training.findOneAndUpdate({ owner: user._id }, newTraining);

    const result = await this.getTraining(user);

    result.books.forEach(async (book) => {
      await libServ.updateBookStatus('reading', book._id, user);
    });

    return result;
  });

  addReadPagesToStat = asyncHandler(async (stat, user) => {
    const foundTraining = await Training.findOne({ owner: user._id });

    if (!foundTraining) throw createError(401, 'Training was not found');

    await Training.findOneAndUpdate(
      { owner: user._id },
      {
        $push: {
          stats: stat,
        },
      }
    );

    await Training.findOneAndUpdate(
      {
        owner: user._id,
        'books._id': stat.bookId,
      },
      {
        $inc: {
          'books.$.pagesRead': stat.pages,
        },
      }
    );

    const result = await this.handleTrainingEnd(user);

    return result;
  });

  handleTrainingEnd = asyncHandler(async (user) => {
    const foundTraining = await Training.findOne({ owner: user._id });

    foundTraining.books.forEach(async (book) => {
      if (book.pages <= book.pagesRead) {
        await this.updateTrainingBookStatus('completed', book._id, user);
        await libServ.updateBookStatus('completed', book._id, user);
      }
    });

    const checkTraining = await Training.findOne({
      owner: user._id,
      _id: foundTraining._id,
    });

    const readingBooks = checkTraining.books.filter(
      (book) => book.status !== 'completed'
    );

    if (readingBooks.length === 0)
      await Training.findOneAndUpdate(
        { owner: user._id },
        { inProgress: false }
      );

    const resultTraining = await this.getTraining(user);

    return resultTraining;
  });

  updateTrainingBookStatus = asyncHandler(async (status, bookID, user) => {
    await Training.findOneAndUpdate(
      { owner: user._id, 'books._id': bookID },
      {
        $set: {
          'books.$.status': status,
        },
      }
    );
  });

  getTraining = asyncHandler(async (user) => {
    const training = await Training.findOne({ owner: user._id });

    if (!training) throw createError(500, 'Training was not found!');

    return training;
  });
}

module.exports = trainingsService;
