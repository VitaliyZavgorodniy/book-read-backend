const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const { NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const { jwtGenerator } = require("../../helpers");

const { User } = require("./Users.model");

class usersService {
  findUser = asyncHandler(async (parameter) => {
    const result = await User.findOne(parameter, "-createdAt -updatedAt");

    return result ?? null;
  });

  updateUserById = asyncHandler(async (id, payload) => {
    const result = await User.findByIdAndUpdate(id, payload);

    return result;
  });

  createUser = asyncHandler(async ({ email, password, name }) => {
    const result = await this.findUser({ email });

    if (result) {
      throw createError(409, "Email in use!");
    }

    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      avatarURL: gravatar.url(email, {
        s: "250",
      }),
      name,
    });

    const token = jwtGenerator({ id: user._id });
    this.updateUserById(user._id, { token });

    return { token };
  });

  loginUser = asyncHandler(async ({ email, password }) => {
    const user = await this.findUser({ email }, "-createdAt -updatedAt");

    if (!user.verify) {
      throw createError(400, "User not verified");
    }

    if (!user) {
      throw NotFound("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, "Email or password is wrong");

    const token = jwtGenerator({ id: user._id });
    this.updateUserById(user._id, { token });

    return { token };
  });

  loginUserGoogle = asyncHandler(async ({ name, googleId }) => {
    const userName = name ?? "New User";

    const user = await this.findUser({ googleId });

    if (user) {
      const token = jwtGenerator({ id: user._id });
      this.updateUserById(user._id, { token });

      return { token };
    }

    const newUser = await User.create({
      avatarURL: gravatar.url(name, {
        s: "250",
      }),
      name: userName,
      googleId,
    });

    const token = jwtGenerator({ id: newUser._id });
    this.updateUserById(newUser._id, { token });

    return { token };
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
