const booksService = require('./booksService');

const service = new booksService();

class booksController {
  add = async (req, res) => {
    const result = await service.addBook(req.body);
    res.status(200).push([]);
  };
  getLibrary = async (req, res) => {
    const result = await service.findBooks();
    res.status(200);
  };
  //   login = async (req, res) => {
  //     const result = await service.loginUser(req.body);

  //     res.status(200).json(result);
  //   };

  //   logout = async (req, res) => {
  //     await service.logoutUser({ _id: req.user._id });

  //     res.status(204).json();
  //   };
}

module.exports = booksController;
