const { Schema, model } = require('mongoose');
const Joi = require('joi');

const bookSchema = Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'book',
    require: [true, 'Set book ID'],
  },
  title: String,
  author: String,
  year: Number,
  pages: Number,
  status: String,
});

const librarySchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      require: [true, 'Set owner for library'],
    },
    books: [bookSchema],
  },
  { versionKey: false, timestamps: true }
);

const createSchema = Joi.object({
  id: Joi.string(), // remove
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

const Library = model('library', librarySchema);

module.exports = { Library, librarySchemas };
