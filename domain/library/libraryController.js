const libraryService = require('./libreryService');

const service = new libraryService();

class libraryController {
  getLibrary = async (req, res) => {
    const result = await service.findBooks();
    res.json({
      status: 'success',
      code: 200,
      message: 'Created successfully',
    });
  };
  addBookToLibrary = async (req, res) => {
    const result = await service.addBook(req.body);
    res.json({
      status: 'success',
      code: 200,
      message: 'Created successfully',
    });
  };
  findOneAndUpdate = async (req, res) => {
    const result = await service.findOneAndUpdate(req.body);
    res.json({
      status: 'success',
      code: 200,
      message: 'Updated successfully',
    });
  };
}

module.exports = libraryController;
