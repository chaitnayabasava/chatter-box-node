const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const appServer = require('./app');
const secret = require('./secret');
const registerController = require('./controllers/register');
const loginController = require('./controllers/login');
const searchController = require('./controllers/search');
const { checkAuth } = require('./controllers/authorization');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/register', registerController);
app.post('/login', loginController);
app.post('/search', checkAuth, searchController);
app.get('/checkAuth', checkAuth, (req, res) => res.json(true));

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const { message } = error;
  console.log(message);
  res.status(status).json({ message });
});

mongoose.connect(secret.mongodb_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    appServer(app);
  })
  .catch((err) => console.log(err));
