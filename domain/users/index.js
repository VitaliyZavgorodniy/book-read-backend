const usersRouter = require('./users.API');
const usersService = require('./users.service');
const usersController = require('./users.controller');
const { User, schemas } = require('./users.model');

module.exports = { usersRouter, usersService, usersController, User, schemas };
