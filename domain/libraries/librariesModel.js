const { Schema, model, ObjectId } = require('mongoose');
const Joi = require('joi');

const bookSchema = Schema({
  _id: {
    type: ObjectId,
    ref: 'book',
    require: [true, 'Set book ID'],
  },
  title: String,
  author: String,
  year: Number,
  pages: Number,
  status: String,
  review: {
    type: {
      id: ObjectId,
      rating: Number,
      text: String,
    },

    default: null,
  },
});

const librarySchema = Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'user',
      require: [true, 'Set owner for library'],
    },
    books: { type: [bookSchema], default: [] },
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

const removeBookFromLibSchema = Joi.object({
  id: Joi.string().required(),
});

const librarySchemas = {
  create: createSchema,
  removeBook: removeBookFromLibSchema,
};

const Library = model('library', librarySchema);

module.exports = { Library, librarySchemas };
