import React from 'react';
import imageAvatar from '../image/avatar.jpg';
import Card from './Card';
import {CurrentUserContext} from '../constexts/CurrentUserContext';

function Main(props) {
  const { cards } = props;
  // Получаем объект текущего пользователя из контекста
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__container">
          <div onClick={props.onEditAvatar} className="profile__avatar-wrap">
            <img
              className="profile__avatar"
              src={currentUser.avatar || imageAvatar}
              alt="Фото профиля"
            />
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              onClick={props.onEditProfile}
              className="profile__button"
              type="button"
              aria-label="Редактировать профиль"
            />
            <p className="profile__title">{currentUser.about}</p>
          </div>
        </div>
        <button
          onClick={props.onAddPlace}
          className="profile__add-button"
          type="button"
          aria-label="Добавить место"
        />
      </section>
      <section className="cards" aria-label="Фотогалерея">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardDelete={props.onCardDelete}
            onCardLike={props.onCardLike}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
