const { Schema, model } = require('mongoose');
const Joi = require('joi');

const bookSchema = Schema({
  _id: ObjectId,
  title: String,
  author: String,
  year: Number,
  pages: Number,
  status: String,
});

const librarySchema = Schema(
  {
    owner: String,
    books: [bookSchema],
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

const removeBookFromLibSchema = Joi.object({
  id: Joi.string().required(),
});

const librarySchemas = {
  create: createSchema,
  removeBook: removeBookFromLibSchema,
};

const Library = model('book', librarySchema);

module.exports = { Library, librarySchemas };
