import React, {useEffect, useState} from "react";
import api from "../utils/api";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import UpdateAvatarPopup from "./UpdateAvatarPopup";
import DeletePopupCard from "./DeletePopupCard";
import ImagePopup from "./ImagePopup";
import {CurrentUserContext} from "../constexts/CurrentUserContext";

export default function Page({setCurrentUser}) {
    const [cards, setCards] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
    const [deleteCard, setDeleteCard] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const currentUser = React.useContext(CurrentUserContext);


    useEffect(() => {
        // Получаем картинки
        api.getCards()
            .then((initialCards) => {
                setCards(initialCards);
            })
            .catch((error) => {
                console.error(error);
            });
        // Получаем информацию о текущем пользователе при загрузке компонента
        api.getUserInfo()
            .then(userInfo => {
                setCurrentUser({
                    ...userInfo,
                });
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    }, []);

    // Обработчики открытия попапов
    // Открытие попапа - Редактировать аватар
    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true);
    }

//Открытие попапа - Добавить место
    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true);
    }

// Открытие попапа - Редактировать профиль
    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    }

// Открытие попапа - Удаление карточки
    function handleDeletePopupClick(card) {
        setDeleteCard(card);
    }

    // Обработчик клика по карточке для открытия попапа с изображением
    function handleCardClick(card) {
        setSelectedCard(card);
    }

// Обработчик управления лайками
    function handleCardLike(e, card) {
        e.preventDefault();
        e.stopPropagation();
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(id => id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        if (isLiked) {
            api.likeCardRemove(card._id)
                .then((newCard) => {
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                })
                .catch((error) => {
                    console.error('Error deleting card like:', error);
                });
        } else {
            api.likeCardAdd(card._id)
                .then((newCard) => {
                    console.log({newCard})
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                })
                .catch((error) => {
                    console.error('Error add card like:', error);
                });
        }
    }

    // Универсальная функция для обработки запросов
    function handleSubmit(request) {
        setIsPending(true);

        request()
            .then(closeAllPopups)
            .catch(console.error)
            .finally(() => setIsPending(false));

    }

    // Обработчик удаления карточки
    function handleCardDelete(e) {
        e.preventDefault();
        e.stopPropagation();
        // Установка isPending в true перед отправкой запроса
        setIsPending(true);

        e.preventDefault();
        api.deleteCard(deleteCard._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== deleteCard._id));
                // Закрываем модальные окна
                closeAllPopups();
            })
            .catch(error => {
                console.error('Error deleting card:', error);
            })
            .finally(() => {
                // Установка isPending в false после успешного запроса
                setIsPending(false);
            });
    }

    // Обработчик формы - Редактировать профиль
    function handleUpdateUser(updatedUserInfo) {
        handleSubmit(() => api.editUserInfo(updatedUserInfo)
            .then(response => {
                setCurrentUser({
                    ...currentUser,
                    ...response.data
                })
            })
        );
    }

    // Обработчик формы - Обновить аватар
    function handleUpdateAvatar(link) {
        handleSubmit(() => api.changeAvatar(link)
            .then(response => {
                setCurrentUser({
                    ...currentUser,
                    ...response.data,
                })
            }));
    }

    // Обработчик формы - Добавить место
    function handleAddPlaceSubmit(onAddPlace) {
        handleSubmit(() => api.addNewCard(onAddPlace).then((newCard) => {
                setCards([newCard, ...cards]);
            })
        );
    }

    // Закрытие всех попапов
    function closeAllPopups() {
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setEditAvatarPopupOpen(false);
        setSelectedCard(null);
        setDeleteCard(null);
    }


    return (
        <>
            <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeletePopupClick}
                cards={cards}
                setCards={setCards}
            />
            <Footer/>
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
                isPending={isPending}
            />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
                isPending={isPending}
            />
            <UpdateAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
                isPending={isPending}
            />
            <DeletePopupCard
                isOpen={deleteCard}
                onClose={closeAllPopups}
                onSubmit={handleCardDelete}
                isPending={isPending}
            />
            <ImagePopup
                isOpen={selectedCard}
                onClose={closeAllPopups}
                selectedCard={selectedCard}
            />
        </>
    )
}
