const express = require('express');
/* const { celebrate, Joi } = require('celebrate'); */

const {
  getUserProfile, updateUserProfile,
} = require('../controllers/user');

const userRoutes = express.Router();

userRoutes.get('/users/me', getUserProfile);

userRoutes.patch('/users/me', /* celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), */ updateUserProfile);

exports.userRoutes = userRoutes;
