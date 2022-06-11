const { Schema, model, ObjectId } = require('mongoose');
const Joi = require('joi');

const bookSchema = Schema({
  _id: {
    type: ObjectId,
    ref: 'book',
  },
  title: String,
  author: String,
  year: Number,
  pages: Number,
  pagesRead: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
});

const statsSchema = Schema({
  date: String,
  pages: Number,
});

const trainingSchema = Schema({
  books: [bookSchema],
  startDate: String,
  endDate: String,
  inProgress: Boolean,
  pagesAmount: Number,
  stats: [statsSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: [true, 'Set owner for training'],
  },
});

const createTrainingSchema = Joi.object({
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  books: Joi.array().min(1).items(Joi.string().required()).required(),
});

const updatePagesSchema = Joi.object({
  bookId: Joi.string().required(),
  date: Joi.string().required(),
  pages: Joi.number().required(),
});

const trainingSchemas = {
  create: createTrainingSchema,
  updatePages: updatePagesSchema,
};

const Training = model('training', trainingSchema);

module.exports = { Training, trainingSchemas };
