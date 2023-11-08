import React from 'react';
import PopupWithForm from './PopupWithForm';

function DeletePopupCard(props) {

  return(
    <PopupWithForm
      name="remove-card"
      title="Вы уверены"
      submitButtonText="Да"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      disabled={props.isPending}
      isPending={props.isPending}
     />
  )
}

export default DeletePopupCard;
