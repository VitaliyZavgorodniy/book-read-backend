const usersRouter = require('./usersAPI');
const usersService = require('./usersService');
const usersController = require('./usersController');
const { User, userSchemas } = require('./usersModel');

module.exports = {
  usersRouter,
  usersService,
  usersController,
  User,
  userSchemas,
};
