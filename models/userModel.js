const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A User must have a name'],
      unique: true,
      trim: true,
      minlength: [2, 'A User Name must have >= than 2 characters'],
      maxlength: [256, 'A User Name must have <= than 256 characters'],
    },
    email: {
      type: String,
      required: [true, 'A User must have an e-mail'],
      unique: true,
      lowercase: true,
      minlength: [6, 'A User Email must have >= than 6 characters'],
      maxlength: [256, 'A User Email must have <= than 256 characters'],
      validate: [validator.isEmail, 'A User Email is incorrect'],
    },
    role: {
      type: String,
      required: [true, 'A User must have a Role'],
      default: 'user',
      enum: {
        values: ['admin', 'user', 'guide', 'lead-guide'],
        message: 'A User Role must be eather admin or user',
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'A User must have a password'],
      minlength: [6, 'A User Password must have >= than 6 characters'],
      maxlength: [256, 'A User Password must have <= than 256 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm the password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords don't match",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = +(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
