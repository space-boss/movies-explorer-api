const express = require('express');
/*const { celebrate, Joi } = require('celebrate');*/
const { isURL } = require('validator');

const {
  getMovies, createMovie, deleteMoviebyId,
} = require('../controllers/movies');

const moviesRoutes = express.Router();

const validateUrl = (value, helpers) => {
  if (!isURL(value, { require_protocol: true })) {
    return helpers.message('В данном поле допустимы только валидные ссылки');
  }
  return value;
};

moviesRoutes.get('/movies', getMovies);

moviesRoutes.post('/movies', /*celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().min(1).max(1000),
    year: Joi.number().integer().required().min(1900)
      .max(2022),
    description: Joi.string().min(2).max(1800).required(),
    image: Joi.string().required().custom(validateUrl, 'Ссылка не валидна'),
    trailer: Joi.string().required().custom(validateUrl, 'Ссылка не валидна'),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
    thumbnail: Joi.string().required().custom(validateUrl, 'Ссылка не валидна'),
    movieId: Joi.string().hex().length(24),
  }),
}),*/ createMovie);

/*moviesRoutes.delete('/movies/movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteMoviebyId); */

exports.moviesRoutes = moviesRoutes;
