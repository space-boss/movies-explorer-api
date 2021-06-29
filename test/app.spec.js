/* eslint-disable*/

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const email = `test+${Date.now()}@example.com`;
const agent = supertest.agent(app);

let token = '';

beforeAll(function (done) {

  function clearCollections() {
    for (var collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].deleteMany(function() {});
    }
    return done();
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.test.db, function (err) {
      if (err) throw err;
      return clearCollections();
    });
  } else {
    return clearCollections();
  }
});

afterAll(function (done) {
  mongoose.disconnect();
  return done();
});

describe('POST /signup with invalid email', () => {
  it('SignUp returns a 400', (done) => {
    agent
      .post('/signup')
      .send({ email: 'a', password: '12345678', name: 'Hans Schnitzel' })
      .expect(400)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('POST /signup without name', () => {
  it('SignUp returns a 400', (done) => {
    agent
      .post('/signup')
      .send({ email: 'hans@schnitzel.com', password: '12345678', name: '' })
      .expect(400)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('POST /signup with invalid password', () => {
  it('SignUp returns a 400', (done) => {
    agent
      .post('/signup')
      .send({ email, password: '1', name: 'Hans Schnitzel' })
      .expect(400)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('POST /signup', () => {
  it('SignUp returns a 200', (done) => {
    agent
      .post('/signup')
      .send({ email, password: '12345678', name: 'Hans Schnitzel' })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('POST /signin', () => {
  it('SignIn with invalid credentials returns a 401', (done) => {
    agent
      .post('/signin')
      .send({ email, password: '87654321' })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('POST /signin', () => {
  it('SignIn returns a 200 and a valid id', (done) => {
    agent
      .post('/signin')
      .send({ email, password: '12345678' })
      .expect((res) => {
        res.body.token === /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i;
      })
      .expect(200)
      .end((err, res) => {
        token = res.body.token;
        if (err) done(err);
        done();
      });
  });
});

describe('GET /users/me', () => {
  it('Gets information about the user', (done) => {
    agent
      .get('/users/me')
      .set({ "Authorization": `Bearer ${token}` })
      .expect((res) => {
        console.log(res.body)
        res.body.name === "Hans Schnitzel";
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('POST /movies', () => {
  it('Posting movies returns a 200', (done) => {
    agent
      .post('/movies')
      .set({ "Authorization": `Bearer ${token}` })
      .send({
        "country": "AU",
        "director": "Wes Anderson",
        "duration": 120,
        "year": 2013,
        "description": "movie about two kids running away",
        "image": "https://filmquarterly.org/wp-content/uploads/2014/01/moonrise_featured.jpg",
        "trailer": "https://filmquarterly.org/wp-content/uploads/2014/01/moonrise_featured.jpg",
        "thumbnail": "https://filmquarterly.org/wp-content/uploads/2014/01/moonrise_featured.jpg",
        "nameRU": "Королевство полной луны",
        "nameEN": "Moonrise Kingdom"
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
});

describe('GET /movies', () => {
  it('Gets all movies and returns a 200', (done) => {
    agent
      .get('/movies')
      .set({ "Authorization": `Bearer ${token}` })
      .expect(200)
      .end((err, res) => {
        console.log(res.body);
        movieId = res.body._id;
        done();
      });
  });
});
