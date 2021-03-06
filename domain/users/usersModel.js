const { Schema, model } = require('mongoose');
const Joi = require('joi');

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const userSchema = Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
    },
    avatarURL: String,
    token: {
      type: String,
      default: null,
    },
    isOnTraining: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string(),
  password: Joi.string().min(5).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const userSchemas = {
  register: registerSchema,
  login: loginSchema,
};

const User = model('user', userSchema);

module.exports = { User, userSchemas };
