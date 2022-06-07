const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const usersRouter = require('./domain/users/usersAPI');
const booksRouter = require('./domain/books/booksAPI');
const librariesRouter = require('./domain/libraries/librariesAPI');

const { DB_CLUSTER, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const DB_PARAMS = 'retryWrites=true&w=majority';
const DB_HOST = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?${DB_PARAMS}`;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use('/api/library', librariesRouter);
app.use('/api/books', booksRouter);
app.use('/api', usersRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
  .connect(DB_HOST)
  .then(() => console.log('-- Database connected --'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
