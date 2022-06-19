const booksService = require('./booksService');

const service = new booksService();

class booksController {
  createBook = async (req, res) => {
    const result = await service.createBook(req.body, req.user._id);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  searchBooks = async (req, res) => {
    const result = await service.searchBooks(req.body.query);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  addReview = async (req, res) => {
    const result = await service.addReview(req.body, req.user._id);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  updateReview = async (req, res) => {
    const result = await service.updateReview(req.body, req.user._id);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  getReviews = async (req, res) => {
    const result = await service.getReviews(req.user._id);

    res.status(200).json({ status: 200, message: 'ok', result });
  };
}

module.exports = booksController;
