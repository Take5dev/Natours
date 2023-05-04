// const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user.id}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const ext = 'webp';
  req.file.filename = `user-${req.user.id}.${ext}`;

  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat(ext)
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
// );

// exports.checkID = (req, res, next, val) => {
//   // const user = users.find((item) => item._id === val);
//   // if (!user) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: `User with ID ${val} is not found`,
//   //   });
//   // }
//   // res.user = user;
//   next();
// };

exports.getUsers = factory.getAll(User);
exports.getUserByID = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUserByID = factory.updateOne(User);
exports.deleteUserByID = factory.deleteOne(User);

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `You are not allowed to update password from this route. Please use /updatePassword route`,
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `You are not allowed to update password from this route. Please use /updatePassword route`,
        400
      )
    );
  }

  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
