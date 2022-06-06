const booksService = require('./booksService');

const service = new booksService();

class booksController {
  addBook = async (req, res) => {
    const result = await service.addBook(req, res);
    res.json(result);
  };
  getLibrary = async (req, res) => {
    const result = await service.findBooks(req.body);
    res.json({
      status: 'success',
      code: 201,
      message: 'Created successfully',
      data: {
        result,
      },
    });
  };
  addResume = async (req, res) => {
    const id = req.params;
    const resume = req.body;
    const result = await service.addResume({ id, resume });
    res.json({
      status: 'success',
      code: 200,
      message: 'Created successfully',
      data: { result },
    });
  };
  deliteBook = async (req, res) => {
    const { id } = req.params;
    const delitedBook = await service.deliteBook(id);
    res.json({
      status: 'success',
      code: 200,
      message: 'Delited successfully',
    });
  };
}
module.exports = booksController;