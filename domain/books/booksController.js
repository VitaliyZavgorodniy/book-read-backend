const booksService = require('./booksService');

const service = new booksService();

class booksController {
  createBook = async (req, res) => {
    const result = await service.createBook(req.body, req.user);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  addReview = async (req, res) => {
    const result = await service.addReview(req.body, req.user);

    res.status(200).json({ status: 200, message: 'ok', result });
  };
}

module.exports = booksController;
