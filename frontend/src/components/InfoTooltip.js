import React from "react";
import successImage from '../image/success.svg'
import errorImage from '../image/errors.svg'
import {usePopupClose} from "../hooks/use-popup-close";

const InfoTooltip = ({ isOpen, onClose, isSuccess }) => {
    const imageSrc = isSuccess ? successImage : errorImage;

    // Кастомный хук для закрытия попапа
    usePopupClose(isOpen, onClose);

    const imageIsSuccess = isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'
    const title = isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.';

    return (
        <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
                <button type="button" className="popup__close-button" onClick={onClose} />
                <img src={imageSrc} alt={imageIsSuccess} className="popup__tooltip-image" />
                <h2 className="popup__tooltip-title">{title}</h2>
            </div>
        </div>
    );
}

export default InfoTooltip;