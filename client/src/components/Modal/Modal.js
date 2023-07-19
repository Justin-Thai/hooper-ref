import './Modal.css';
import React from 'react';

function Modal({ closeModal, continueAction }) {
  return (
    <div className="modal-background">
        <div className="modal-container">
            <div className="modal-exit"> 
                <button onClick={() => closeModal(false)}>X</button>
            </div>
            <div className="modal-text">
                <span>Are you sure you want to continue?</span>
            </div>
            <div className="modal-footer">
                <button className="modal-cancel" onClick={() => closeModal(false)}>Cancel</button>
                <button className="modal-continue" onClick={() => continueAction()}>Continue</button>
            </div>
        </div>
    </div>
  )
}

export default Modal;