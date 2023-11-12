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

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError('Аутентификация не удалась. Пользователь не найден.');
      }

      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
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

  const allowedFields = ['name', 'about'];
  const updatedFields = {};

  allowedFields.forEach((field) => {
    if (req.body[field]) {
      updatedFields[field] = req.body[field];
    }
  });

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

  // Проверка наличия и валидности поля avatar в теле запроса
  const { avatar } = req.body;
  if (!avatar || typeof avatar !== 'string') {
    throw new BadRequestError('Переданы некорректные данные');
  }

  User.findByIdAndUpdate(userId, { $set: { avatar } }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send({ data: updatedUser });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
      }
      next(error);
    });
};
