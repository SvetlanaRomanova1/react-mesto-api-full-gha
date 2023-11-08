import React, { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function UpdateAvatarPopup(props) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar(avatarRef.current.value);
  }

  return (
    <PopupWithForm
      name='update-avatar'
      title='Обновить аватар'
      submitButtonText='Сохранить'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      disabled={props.isPending}
      isPending={props.isPending}
    >
      <label className='popup__field-avatar'>
        <input
          ref={avatarRef}
          type='url'
          className='popup__input'
          id='link-avatar'
          name='link-avatar'
          placeholder='Ссылка на картинку'
          minLength='2'
          required
        />
        <span className='popup__error-visible' />
      </label>
    </PopupWithForm>
  );
}

export default UpdateAvatarPopup;
