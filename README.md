# MOVIES EXPLORER API. Graduation project at Yandex.Praktikum

## Description
This is a part of a graduation project of the web development course of Yandex Practicum. This repository contains REST API used for user authentification, edition user data and setting favorites in [__Movies Explorer__](https://github.com/space-boss/movies-explorer-frontend) - a web application that allows to search for documentaries within the database provided by [Beat Film Festival](https://en.beatfilmfestival.ru/). 

__Server domain name:__
`beatfilm-explorer.nomoredomains.monster/api`

## Methods and routes used in the project

Method | Route | Description
----- |------|---------
GET | `/users/me` | returns values of **email** and **name** of the current user
PATCH | `/users/me` | updates user info with the **email** and **имя** passed in the `body` of the query
POST | `/movies` | creates a movie with the following values set in the `body` **country**, **director**, **duration**, **year**, **description**, **image*, **trailer**, **nameRU**, **nameEN**, **movieId** and **thumbnail** (method used for creating a "saved movies" page)
GET | `/movies` | returns all movies that were saved by the user
DELETE | `/movies/movieId` | deletes a saved movie with a certain **_id**
POST | `/signup` | creates a new user with **email**, **password**, **name** set in `body`
POST | `/signin` | checks  **email** and **password** sent in `body` for validity and returns **JWT** in a success case

## Validation
* The queries that reach the server are getting validated with via celebrate middleware and joi validation library.
* Validation and server errors are handled

API is protected with authorization middleware.

## Technologies
* Express.js
* API REST
* MongoDB
* Celebrate & Joi validation
* cors
* winston
* helmet
* jsonwebtoken
* eslint

## Install the project
`git clone https://github.com/space-boss/movies-explorer-api.git`

`npm install` - installs the dependencies;

`npm run dev` — starts the server; 

`npm run start` — starts the server with hot-reload;
