const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字'],
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '密碼必填'],
      select: false,
    },
    gender: {
      type: String,
      default: 'male',
      enum: ['male', 'female'],
    },
    photo: String,
  },
  { versionKey: false }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
