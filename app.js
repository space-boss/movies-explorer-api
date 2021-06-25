require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
/* const { routes } = require('./routes/index'); */

const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { isURL } = require('validator');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 2000, MONGO_URL = 'mongodb://localhost:27017/beatfilmsdb' } = process.env;
const { userRoutes } = require('./routes/user');
const { moviesRoutes } = require('./routes/movies');
const { createUser, login } = require('./controllers/user');
const NotFoundError = require('./errors/not-found-err');

const app = express();

app.use(express.json());

app.use(requestLogger);

mongoose.set('debug', true);

router.use(bodyParser.json());

router.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const methodNotAllowed = (req, res, next) => res.status(404).send();

router.route('/signin').post(celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login).all(methodNotAllowed);

router.route('/signup').post(celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).default('Квентин Тарантино'),
  }),
}), createUser).all(methodNotAllowed);

router.use('/', auth, userRoutes);
router.use('/', auth, moviesRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errorLogger);

router.use(errors());

router.use(errorHandler);

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

module.exports = router;
