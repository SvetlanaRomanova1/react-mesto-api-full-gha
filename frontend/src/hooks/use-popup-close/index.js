import { useEffect } from 'react';

export function usePopupClose(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    function onClickOverlay(e) {
      if (e.target.classList.contains('popup_opened')) {
        onClose();
      }
    }

    function handleEscKeyPress(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscKeyPress);
    document.addEventListener('mousedown', onClickOverlay);

    return () => {
      document.removeEventListener('keydown', handleEscKeyPress);
      document.removeEventListener('mousedown', onClickOverlay);
    };
  }, [isOpen, onClose]);
}
