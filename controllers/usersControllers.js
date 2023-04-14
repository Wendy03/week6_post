const bcrypt = require('bcryptjs');
const validator = require('validator');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const successHandler = require('../service/successHandler');
const { generateSendJWT } = require('../service/auth');

const User = require('../models/usersModel');

const passwordRule = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;

const users = {
  signup: handleErrorAsync(async (req, res, next) => {
    let { name, email, password, photo } = req.body;
    const findUser = await User.findOne({ email });
    const errMsgAry = [];
    if (!name || !email || !password) {
      return appError(400, '欄位未填寫正確', next);
    }
    if (findUser) {
      return appError(400, '此 E-mail 已經註冊', next);
    }
    if (!validator.isLength(name, { min: 2 })) {
      errMsgAry.push('暱稱至少 2 個字元以上');
    }
    if (!validator.isLength(password, { min: 8 })) {
      errMsgAry.push('密碼需至少 8 碼以上');
    }
    if (!passwordRule.test(password)) {
      errMsgAry.push('密碼需英數混合的驗證');
    }
    if (!validator.isEmail(email)) {
      errMsgAry.push('Email 格式不正確');
    }
    if (errMsgAry.length > 0) {
      return appError(400, errMsgAry, next);
    }
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name,
      photo,
    });
    generateSendJWT(newUser, 201, res);
  }),
  signin: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return appError(400, '帳號密碼不可為空', next);
    }
    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth || !user) {
      return appError(400, '帳號或密碼錯誤，請重新輸入！', next);
    }
    generateSendJWT(user, 200, res);
  }),
  getUser: handleErrorAsync(async (req, res, next) => {
    successHandler(res, '取得資料', req.user);
  }),
  editUser: handleErrorAsync(async (req, res, next) => {
    const { name, gender, photo } = req.body;
    if (!name) {
      return appError(400, '欄位資料填寫不全', next);
    } else {
      const editUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          name,
          gender,
          photo,
        },
        { new: true }
      );
      if (!editUser) {
        return appError(400, '編輯失敗', next);
      } else {
        const user = await User.findById(req.user.id);
        successHandler(res, '編輯成功', user);
      }
    }
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const errMsgAry = [];
    if (!validator.isLength(password, { min: 8 })) {
      errMsgAry.push('密碼需至少 8 碼以上');
    }
    if (password !== confirmPassword) {
      errMsgAry.push('密碼不一致！');
    }
    if (!passwordRule.test(password)) {
      errMsgAry.push('密碼需英數混合的驗證');
    }
    if (errMsgAry.length > 0) {
      return appError(400, errMsgAry, next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: newPassword,
      },
      { new: true }
    );
    successHandler(res, '密碼更新成功', user);
  }),
};

module.exports = users;
