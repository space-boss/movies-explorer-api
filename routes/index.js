const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');

const { moviesRoutes } = require('./movies');
const { userRoutes } = require('./user');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/user');
const NotFoundError = require('../errors/not-found-err');

const router = express.Router();

router.use(bodyParser.json());

router.use(cookieParser());

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

router.route('/signin').post(celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

router.route('/signup').post(celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).default('Квентин Тарантино'),
  }),
}), createUser);

router.use('/', auth, userRoutes);
router.use('/', auth, moviesRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
