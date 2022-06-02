const usersRouter = require('./users.API');
const usersService = require('./users.service');
const usersController = require('./users.controller');
const { User, userSchemas } = require('./users.model');

module.exports = { usersRouter, usersService, usersController, User, userSchemas };