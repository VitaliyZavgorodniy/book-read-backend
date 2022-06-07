const libaryService = require('./librariesService');

const service = new libaryService();

class librariesController {
  addBookToLibrary = async (req, res) => {};

  removeBookFromLibrary = async (req, res) => {
    await service.createBook(req.body);

    res.status(200).json({ status: 200, message: 'ok' });
  };
}

module.exports = librariesController;
