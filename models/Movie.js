const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(v);
      },
      message: (props) => `${props.value} - не валидный адрес ссылки!`,
    },
  },

  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(v);
      },
      message: (props) => `${props.value} - не валидный адрес ссылки!`,
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(v);
      },
      message: (props) => `${props.value} - не валидный адрес ссылки!`,
    },
  },

  owner: {
    type: mongoose.ObjectId,
    required: true,
  },

  movieId: {
    type: mongoose.ObjectId,
    required: true,
  },

  nameRu: {
    type: String,
    required: true,
  },

  nameEng: {
    type: String,
    required: true,
  },
});

exports.Movie = mongoose.model('movie', movieSchema);
