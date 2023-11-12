const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const Forbidden = require('../errors/forbidden-error');

// Контроллер для получения всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// Контроллер для создания карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user && req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequestError(`Переданы некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

// Контроллер для удаления карточки по идентификатору
module.exports.deleteCardId = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      const owner = card.owner.toString();
      if (userId !== owner) {
        throw new Forbidden('Невозможно удалить карточку');
      }

      return Card.deleteOne(card)
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные удаления'));
      }
      return next(e);
    });
};

// Контроллер для добавления лайка к карточке
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
  .then((card) => res.send(card))
  .catch((e) => {
    if (e.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для добавления лайка'));
    }
    return next(e);
  });

// Контроллер для удаления лайка к карточке
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
  .then((card) => res.send(card))
  .catch((e) => {
    if (e.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
    }
    return next(e);
  });
