const express = require('express');
const { moviesRoutes } = require('./movies');
/*const { userRoutes } = require('./user');*/

const routes = express.Router();
routes.use('/movies', moviesRoutes);
/*routes.use('/user', userRoutes);*/

exports.routes = routes;
