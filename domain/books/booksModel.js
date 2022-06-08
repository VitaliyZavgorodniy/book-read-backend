const { Schema, model } = require('mongoose');
const Joi = require('joi');

const reviewSchema = Schema({
  rating: Number,
  text: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: [true, 'Set owner for review'],
  },
});

const bookSchema = Schema(
  {
    id: String,
    title: String,
    author: String,
    year: Number,
    pages: Number,
    reviews: [reviewSchema],
  },
  { versionKey: false, timestamps: true }
);

const createSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string(),
  author: Joi.string(),
  year: Joi.number(),
  pages: Joi.number(),
});

const addReview = Joi.object({
  id: String,
});

const bookSchemas = {
  create: createSchema,
};

const Book = model('book', bookSchema);

module.exports = { Book, bookSchemas };
