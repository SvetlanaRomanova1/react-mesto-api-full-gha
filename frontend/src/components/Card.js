import React from 'react';
import { CurrentUserContext } from '../constexts/CurrentUserContext';

function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;

  const isLiked = card.likes.some(id => id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `card__like-button ${isLiked && 'card__like-button_active'}`
  );
  // Обработчик клика на карточку
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onCardClick(card);
  }
// Обработчик для удаления карточки
 function handleDeleteClick(e){
   e.preventDefault();
   e.stopPropagation();
    onCardDelete(card);
  }

  return (
    <article
      className="card"
      onClick={handleClick}
    >
      <div
        className="card__image"
        style={{ backgroundImage: `url(${card.link})` }}
      />
      {isOwn && <button
        type="button"
        aria-label="Корзина"
        className='card__delete-button'
        onClick={handleDeleteClick}
      />}
      <div className="card__container">
        <h4 className="card__title">{card.name}</h4>
        <button
          className={cardLikeButtonClassName}
          type="button"
          aria-label="Лайк"
          onClick={(e) => onCardLike(e, card)}
        >
          <span className="card__like-number">{card.likes.length}</span>
        </button>
      </div>
    </article>
  );
}

export default Card;
