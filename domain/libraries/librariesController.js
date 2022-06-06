const libaryService = require('./booksService');

const service = new libaryService();

class librariesController {
  removeBookFromLibrary = async (req, res) => {
    console.log({ user: req.user, book: req.body });
    await service.createBook(req.body);

    res.status(200).json({ status: 200, message: 'ok' });
  };
}

module.exports = librariesController;
