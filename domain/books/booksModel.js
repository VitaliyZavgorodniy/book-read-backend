const { Schema, model } = require('mongoose');
const Joi = require('joi');

const bookSchema = Schema(
  {
    id: String,
    title: String,
    author: String,
    year: Number,
    pages: Number,
  },
  { versionKey: false, timestamps: true }
);

const createSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.number().required(),
  pages: Joi.number().required(),
});

const bookSchemas = {
  create: createSchema,
};

const Book = model('book', bookSchema);

module.exports = { Book, bookSchemas };
