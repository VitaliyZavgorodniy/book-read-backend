const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const { usersService } = require('../domain/users');

const { SECRET_SALT } = process.env;
const service = new usersService();

const validationToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') throw createError(401);

    const { id } = jwt.verify(token, SECRET_SALT);
    const user = await service.findUser({ _id: id });

    if (!user || !user.token) throw createError(401);
    req.user = user;

    next();
  } catch (err) {
    if (err.message === 'Invalid signature') err.status === 401;

    next(err);
  }
};

module.exports = validationToken;
