const fs = require("fs/promises");
const createError = require("http-errors");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");

const RESIZE_HEIGHT = 250;
const RESIZE_WIDTH = 250;
const RESIZE_QUALITY = 80;

const resizeAvatar = async ({ path }) => {
  const avatarPath = await Jimp.read(path)
    .then((lenna) => {
      const fileName = uuidv4();
      const fileExtension = lenna.getExtension();

      lenna
        .resize(RESIZE_HEIGHT, RESIZE_WIDTH)
        .quality(RESIZE_QUALITY)
        .write(`./public/avatars/${fileName}.${fileExtension}`);

      fs.unlink(path);

      return `/${fileName}.${fileExtension}`;
    })
    .catch((err) => {
      throw createError(500, err.message);
    });

  return avatarPath;
};

module.exports = resizeAvatar;
