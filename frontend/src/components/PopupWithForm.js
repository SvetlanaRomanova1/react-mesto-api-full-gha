import { usePopupClose } from '../hooks/use-popup-close/index';

function PopupWithForm
({  isOpen,
    onClose,
    name,
    title,
    submitButtonText,
    children,
    disabled,
    isPending,
    onSubmit
})
{
  // Кастомный хук для закрытия попапа
  usePopupClose(isOpen, onClose);


  const isDisabled = disabled || isPending;
  const buttonClass = isDisabled
    ? 'popup__button popup__submit-button popup__button_disabled'
    : 'popup__button popup__submit-button'

  return (
    <div

      className={`popup popup_type_${name} ${
        isOpen ? 'popup_opened' : ''
      }`}
    >
      <div className="popup__container">
        <form
          className={`popup__form popup__form_type_${name}`}
          name={name}
          onSubmit={onSubmit}
        >
          <button
            type="button"
            className="popup__cross-button"
            onClick={onClose}
          />
          <h2 className="popup__title">{title}</h2>
          {children}
          <button
            className={buttonClass}
            type="submit"
            disabled={isDisabled}
          >
            {isPending ? 'Сохранение...' : submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
