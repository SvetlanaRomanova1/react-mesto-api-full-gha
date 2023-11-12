const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const Conflict = require('../errors/conflict-error');
const ServerError = require('../errors/server-error');
const { JWT_SECRET } = require('../utils/config');
const AuthorisationError = require('../errors/unauthorized-error');

// Контроллер для получения всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Контроллер для получения пользователя по ID
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Запрашиваемый пользователь не найден'));
      } else {
        next(e);
      }
    });
};

// Контроллер для создания пользователей
module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  // Хеширование пароля
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      throw new ServerError('Произошла ошибка при хешировании пароля');
    }

    return User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        // Exclude the 'password' field from the user object
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(201).send({ data: userWithoutPassword });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next(new BadRequestError('Введены некорректные данные'));
        } else if (error.code === 11000) {
          next(new Conflict('Такой пользователь уже существует!)'));
        } else {
          next(error);
        }
      });
  });
};

// Контроллер для аутентификации пользователя и выдачи JWT-токена
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const TOKEN_EXPIRATION = '7d';
  let foundUser; // Declare the variable here

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError('Аутентификация не удалась. Пользователь не найден.');
      }

      foundUser = user; // Assign the value to the variable
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (result) {
        const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).send({ message: 'Аутентификация успешна.', token });
      } else {
        throw new AuthorisationError('Аутентификация не удалась. Неверный пароль.');
      }
    })
    .catch((error) => next(error));
};

// Контроллер для обновления профиля пользователя
// eslint-disable-next-line consistent-return
module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;

  const updatedFields = {};
  updatedFields.name = req.body.name;
  updatedFields.about = req.body.about;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError('Невалидный идентификатор пользователя');
  }

  User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: updatedUser });
    })
    .catch((error) => {
      // Обработка ошибок валидации
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(error);
      }
    });
};

// Контроллер для получения информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Запрашиваемый пользователь не найден'));
      } else {
        next(e);
      }
    });
};

// Контроллер для обновления аватар
// eslint-disable-next-line consistent-return
module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { $set: { avatar } }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send({ data: updatedUser });
    })
    .catch((error) => {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
      } else {
        next(error);
      }
    });
};
