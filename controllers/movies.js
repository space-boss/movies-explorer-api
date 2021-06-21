const mongoose = require('mongoose');
const { Movie } = require('../models/Movie');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country, director, duration,
      year, description, image, trailer,
      nameRu, nameEn, thumbnail,
    } = req.body;
    const ownerId = new mongoose.Types.ObjectId(req.user._id);
    console.log(ownerId);
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      owner: ownerId,
      nameRu,
      nameEn,
      thumbnail,
    });
    res.status(200).json({
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
      nameRu: movie.nameRu,
      nameEn: movie.nameEn,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log('При создании карточки переданы некорректные данные');
      return;
    }
    next(err);
  }
};
