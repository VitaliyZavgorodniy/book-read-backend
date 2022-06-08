const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const { Training } = require('./trainingsModel');

const librariesService = require('../libraries/librariesService');
const booksService = require('../books/booksService');

const libServ = new librariesService();
const booksServ = new booksService();

class trainingsService {
  findTraining = asyncHandler(async (parameter) => {
    const result = await Training.findOne(parameter, '-createdAt -updatedAt');

    return result;
  });

  createTraining = asyncHandler(async (training, user) => {
    const foundTraining = await this.findTraining({ owner: user._id });

    if (foundTraining?.inProgress)
      throw createError(401, 'Training is already started');

    const booksArray = await booksServ.findBooksById(training.books);

    console.log({ booksArray });

    if (!booksArray?.length)
      throw createError(401, 'Books for training was not found');

    const booksList = booksArray.map((book) => ({
      ...book,
      pagesRead: 0,
      status: 'reading',
    }));

    const newTraining = {
      endDate: training.endDate,
      inProgress: true,
      owner: user._id,
      books: booksList,
    };

    if (!foundTraining) await Training.create(newTraining);

    if (foundTraining && !foundTraining.inProgress)
      await Training.findOneAndUpdate({ owner: user._id }, newTraining);

    const result = this.findTraining({ owner: user._id });

    result.books.forEach(async (book) => {
      await libServ.updateBookStatus('reading', book._id, user);
    });

    return result;
  });

  addReadPagesToStat = asyncHandler(async (stat, user) => {
    const foundTraining = await this.findTraining({ owner: user._id });

    if (!foundTraining) throw createError(401, 'Training is not found');

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

    const result = await this.handleTrainingEnd(foundTraining._id, user);

    return result;
  });

  handleTrainingEnd = asyncHandler(async (trainingId, user) => {
    const foundTraining = await Training.findById(trainingId);

    foundTraining.books.forEach(async (book) => {
      if (book.pages <= book.pagesRead) {
        console.log('Go update book in lib');
        await libServ.updateBookStatus('completed', book._id, user);
      }
    });

    return foundTraining;
  });
}

module.exports = trainingsService;
