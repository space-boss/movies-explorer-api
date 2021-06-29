const mongoose = require('mongoose');
const { Movie } = require('../models/Movie');
const BadRequestError = require('../errors/bad-request-err');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country, director, duration,
      year, description, image, trailer,
      thumbnail, nameRU, nameEN,
    } = req.body;
    const ownerId = new mongoose.Types.ObjectId(req.user._id);
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      owner: ownerId,
      nameRU,
      nameEN,
      thumbnail,
    });
    res.json({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      thumbnail: movie.thumbnail,
      owner: movie.owner,
      _id: movie._id,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('При создании страницы фильма переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

module.exports.deleteMovieById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.movieId)) {
      throw new ValidationError('Формат _id не валиден');
    } else {
      const movie = await Movie.findById(req.params.movieId)
        .orFail(new NotFoundError('Запрашиваемый фильм не найден'));
      if (movie.owner.toString() !== req.user._id) {
        throw new BadRequestError('У вас нет прав для удаления информации о фильме');
      } else {
        const movieWithId = await Movie.findByIdAndDelete(req.params.movieId)
          .orFail(new NotFoundError('Запрашиваемый фильм не найден'));
        res.send(movieWithId);
      }
    }
  } catch (err) {
    next(err);
  }
};
