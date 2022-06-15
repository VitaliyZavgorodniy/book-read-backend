const { Schema, model, ObjectId } = require('mongoose');
const Joi = require('joi');

const reviewSchema = Schema({
  rating: Number,
  text: String,
  owner: {
    type: ObjectId,
    ref: 'user',
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

const searchBookSchema = Joi.object({
  query: Joi.string().required().min(3),
});

const addReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().max(5).min(1),
    text: Joi.string().required().min(1),
  }),
  bookID: Joi.string().required(),
});

const updateReviewSchema = Joi.object({
  review: Joi.object({
    id: Joi.string().required(),
    rating: Joi.number().required().max(5).min(1),
    text: Joi.string().required().min(1),
  }),
  bookID: Joi.string().required(),
});

const bookSchemas = {
  create: createSchema,
  searchBook: searchBookSchema,
  addReview: addReviewSchema,
  updateReview: updateReviewSchema,
};

const Book = model('book', bookSchema);

module.exports = { Book, bookSchemas };
