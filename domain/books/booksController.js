const booksService = require('./booksService');

const service = new booksService();

class booksController {
  add = async (req, res) => {
    const result = await service.addBook(req.body);
    res.status(200).json(result);
  };
  getLibrary = async (req, res) => {
    const result = await service.findBooks();
    res.status(200);
  };
}

module.exports = booksController;
