import React, {useEffect} from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormAndValidation } from '../hooks/use-form-and-validation';
import { CurrentUserContext } from '../constexts/CurrentUserContext';

function AddPlacePopup(props) {

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

  // Обработчик отправки формы - Добавить место
  function handleSubmit(e){
    e.preventDefault()
    props.onAddPlace({
      name: values.place,
      link: values.link
    });
  }

  useEffect(() => {
    if (currentUser.place) {
      setValues({
        ...values,
        ['name']: currentUser.place || '',
        ['link']: currentUser.link || ''
      });
      setIsValid(true);
    }

    return () => {
      resetForm()
    }
  }, [currentUser]);


  return (
    <PopupWithForm
      name="add-place"
      title="Новое место"
      submitButtonText="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      disabled={props.isPending || !isValid}
      isPending={props.isPending}
    >
      <label className="popup__field">
        <input
          type="text"
          className="popup__input"
          id="popupAddPlaceInput"
          name="place"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required
          onChange={handleChange}
          value={values.place || ''}
        />
        <span className="popup__error-visible" >
          {errors.place}
        </span>
      </label>
      <label className="popup__field">
        <input
          type="url"
          className="popup__input"
          id="popupLinkAddPlaceInput"
          name="link"
          placeholder="Ссылка на картинку"
          required
          onChange={handleChange}
          value={values.link || ''}
        />
        <span className="popup__error-visible" >
          {errors.link}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
