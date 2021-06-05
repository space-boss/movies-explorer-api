const express = require('express');
const mongoose = require('mongoose');

const { PORT = 2000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsbd' } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
