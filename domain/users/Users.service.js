const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const queryString = require('query-string');
const axios = require('axios');

const { jwtGenerator } = require('../../helpers');

const { User } = require('./users.model');

const { FRONTEND_URL, GOOGLE_CLIENT, GOOGLE_SECRET, BASE_URL, PORT } =
  process.env;

class usersService {
  findUser = asyncHandler(async (parameter) => {
    const result = await User.findOne(parameter, '-createdAt -updatedAt');

    return result ?? null;
  });

  updateUserById = asyncHandler(async (id, payload) => {
    const result = await User.findByIdAndUpdate(id, payload);

    return result;
  });

  createUser = asyncHandler(async ({ email, name, password }) => {
    const result = await this.findUser({ email });

    if (result) {
      throw createError(409, 'Email in use!');
    }

    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      avatarURL: gravatar.url(email, {
        s: '250',
      }),
      name,
    });

    const token = jwtGenerator({ id: user._id });
    this.updateUserById(user._id, { token });

    return { token };
  });

  loginUser = asyncHandler(async ({ email, password }) => {
    const user = await this.findUser({ email }, '-createdAt -updatedAt');

    if (!user.verify) {
      throw createError(400, 'User not verified');
    }

    if (!user) {
      throw NotFound('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, 'Email or password is wrong');

    const token = jwtGenerator({ id: user._id });
    this.updateUserById(user._id, { token });

    return { token };
  });

  loginUserGoogle = asyncHandler(async () => {
    const params = queryString.stringify({
      client_id: GOOGLE_CLIENT,
      redirect_uri: `${BASE_URL}/api/users/login/google-redirect`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  });

  loginUserGoogleRedirect = asyncHandler(async (fullUrl) => {
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;

    const { data: tokenData } = await axios({
      url: 'https://oauth2.googleapis.com/token',
      method: 'post',
      data: {
        client_id: GOOGLE_CLIENT,
        client_secret: GOOGLE_SECRET,
        redirect_uri: `${BASE_URL}/api/users/login/google-redirect`,
        grant_type: 'authorization_code',
        code,
      },
    });

    const { data: userData } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const user = await this.findUser({ email: userData.email });

    if (!user) {
      const avatar =
        userData.picture ??
        gravatar.url(email, {
          s: '250',
        });

      const newUser = await User.create({
        email: userData.email,
        name: userData.name,
        avatarURL: avatar,
      });

      const token = jwtGenerator({ id: newUser._id });
      this.updateUserById(newUser._id, { token });

      return `${FRONTEND_URL}?token=${token}`;
    }

    return `${FRONTEND_URL}?token=${user.token}`;
  });

  logoutUser = asyncHandler(async (id) => {
    const result = await this.updateUserById(id, { token: null });

    return result;
  });

  patchUserAvatar = asyncHandler(async (id, avatarURL) => {
    await this.updateUserById(id, { avatarURL });

    return avatarURL;
  });
}

module.exports = usersService;
