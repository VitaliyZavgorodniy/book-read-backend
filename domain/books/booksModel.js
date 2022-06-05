const { Schema, model } = require('mongoose');
const Joi = require('joi');

const bookSchema = Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    pages: {
      type: Number,
    },
    year: {
      type: Number,
      min: 4,
    },
    status: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
);

const addBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  pages: Joi.string().required(),
  year: Joi.string().min(4).required(),
  status: Joi.string(),
});

const bookSchemas = {
  add: addBookSchema,
};

const Book = model('book', bookSchema);

module.exports = { Book, bookSchemas };
