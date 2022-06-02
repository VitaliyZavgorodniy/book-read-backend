const usersService = require('./users.service');

const { resizeAvatar } = require('../../helpers');

const service = new usersService();

class usersController {
  register = async (req, res) => {
    const result = await service.createUser(req.body);

    res.status(200).json(result);
  };

  login = async (req, res) => {
    const result = await service.loginUser(req.body);

    res.status(200).json(result);
  };

  loginGoogle = async (req, res) => {
    const redirectUrl = await service.loginUserGoogle(req.body);

    res.redirect(redirectUrl);
  };

  loginGoogleRedirect = async (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const redirectUrl = await service.loginUserGoogleRedirect(fullUrl);

    res.redirect(redirectUrl);
  };

  current = async (req, res) => {
    const { name, avatarURL } = req.user;

    res.status(200).json({ name, avatarURL });
  };

  logout = async (req, res) => {
    await service.logoutUser({ _id: req.user._id });

    res.status(204).json();
  };

  updateAvatar = async (req, res) => {
    const avatarPath = await resizeAvatar(req.file);

    const result = await service.patchUserAvatar(
      { _id: req.user._id },
      avatarPath
    );

    res.status(200).json(result);
  };
}

module.exports = usersController;
