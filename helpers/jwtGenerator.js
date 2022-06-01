const jwt = require("jsonwebtoken");

const { SECRET_SALT } = process.env;

const jwtGenerator = (payload) => jwt.sign(payload, SECRET_SALT);

module.exports = jwtGenerator;
