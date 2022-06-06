const booksService = require('./booksService');

const service = new booksService();

class booksController {
  createBook = async (req, res) => {
    console.log({ user: req.user, book: req.body });
    await service.createBook(req.body);

    res.status(200).json({ status: 200, message: 'ok' });
  };
}

module.exports = booksController;
