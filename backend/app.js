require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT } = require('./utils/config');

const app = express();

// Подключение к MongoDB
const mongoURI = 'mongodb://localhost:27017/mestodb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Обработка ошибок подключения к базе данных
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
});

const auth = require('./middlewares/auth');
const { createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов

// Использование роутов пользователей
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// Обработчики для регистрации и входа (аутентификации)
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), require('./controllers/users').login);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
      email: Joi.string().required().email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.use((req, res, next) => {
  next(new NotFoundError('Not Found'));
});

app.listen(PORT);
