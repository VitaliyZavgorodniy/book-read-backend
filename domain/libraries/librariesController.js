const libaryService = require('./librariesService');

const service = new libaryService();

class librariesController {
  removeBookFromLibrary = async (req, res) => {
    // await service.createBook(req.body);

    res.status(200).json({ status: 200, message: 'ok' });
  };

  getLibrary = async (req, res) => {
    const result = await service.findSortedLibrary({ owner: req.user._id });

    res.status(200).json({ status: 200, message: 'ok', result });
  };
}

module.exports = librariesController;
