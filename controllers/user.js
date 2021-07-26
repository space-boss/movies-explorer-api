const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const BadRequestError = require('../errors/bad-request-err');
const ValidationError = require('../errors/validation-err');
const AuthError = require('../errors/authentication-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const opts = { runValidators: true, new: true, useFindAndModify: false };
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(new NotFoundError('Пользователь с данным _id не найден'));
    res.json(
      {
        name: user.name, email: user.email, about: user.about, avatar: user.avatar, _id: user._id,
      },
    );
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { email, name }, opts)
      .orFail(new NotFoundError('Запрашиваемый профиль не найден'));
    res.json(
      {
        email: user.email, name: user.name, _id: user._id,
      },
    );
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('При обновлении профиля переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({ name, email, password: hash });
    res.send({ message: 'Пользователь успешно создан' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные'));
      return;
    }
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Данный email уже зарегистрирован'));
      return;
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Неверные почта или пароль');
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new AuthError('Неверные почта или пароль');
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};
