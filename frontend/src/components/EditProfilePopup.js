import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../constexts/CurrentUserContext';
import { useFormAndValidation } from '../hooks/use-form-and-validation';


function EditProfilePopup({isOpen, onClose, isPending, onUpdateUser}) {

  const currentUser = React.useContext(CurrentUserContext);

  const {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    setValues,
    setIsValid
  } = useFormAndValidation();

  // Обработчик отправки формы - Редактировать профиль
  function handleSubmit(e) {
    e.preventDefault();
      onUpdateUser({
        ...currentUser,
        name: values.name,
        about: values.about,
      });
  }

  useEffect(() => {
    if (currentUser.name) {
      setValues({
        ...values,
        ['name']: currentUser.name || '',
        ['about']: currentUser.about || ''
      });
      setIsValid(true);
    }

    return () => {
      resetForm()
    }
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name='edit-profile'
      title='Редактировать профиль'
      submitButtonText='Сохранить'
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={onClose}
      disabled={isPending || !isValid}
      isPending={isPending}
    >
      <label className='popup__field'>
        <input
          type='text'
          className='popup__input'
          id='name'
          name='name'
          placeholder='Имя'
          minLength='2'
          maxLength='40'
          value={values.name || ''}
          onChange={handleChange}
          required
        />
        <span className='popup__error-visible'>
          {errors.name}
        </span>
      </label>
      <label className='popup__field'>
        <input
          type='text'
          className='popup__input'
          id='job'
          name='about'
          placeholder='О себе'
          minLength='2'
          maxLength='200'
          value={values.about || ''}
          onChange={handleChange}
          required
        />
        <span className='popup__error-visible' >
          {errors.about}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
