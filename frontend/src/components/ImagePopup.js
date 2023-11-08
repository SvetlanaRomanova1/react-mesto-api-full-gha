import React from 'react';
import { usePopupClose } from '../hooks/use-popup-close/index';

function ImagePopup(props) {

  usePopupClose(props.selectedCard?.link, props.onClose);

  return (
    <div
      onClick={props.onClose}
      className={`popup popup_overlay ${props.isOpen ? 'popup_opened' : ''}`}
    >
      <div className="popup__wrapper">
        <button
          type="button"
          className="popup__cross-button"
          onClick={props.onClose}
        />
        <img src={props.selectedCard?.link} alt={props.selectedCard?.name} className="popup__image" />
        <p className="popup__text">{props.selectedCard?.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
