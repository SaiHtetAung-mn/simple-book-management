const modal = document.getElementById('confirm-modal');
const modal_title = document.getElementById('confirm-modal-title');
const modal_description = document.getElementById('confirm-modal-description');
const modal_ok = document.getElementById('confirm-modal-ok');
const modal_cancel = document.getElementById('confirm-modal-cancel');

let modalActionCallback = new Function();

initialize();

function initialize() {
    iniEventListener();
}

function iniEventListener() {
    if(modal_ok) {
        modal_ok.addEventListener('click', () => {
            if(typeof modalActionCallback == 'function') {
                modalActionCallback();
            }
            else {
                (function(){}());
            }

            closeModal();
        });
    }
    if(modal_cancel) {
        modal_cancel.addEventListener('click', closeModal);
    }
}

export function openModal(title, description, callback) {
    modalActionCallback = callback;

    modal_title.innerText = title;
    modal_description.innerText = description;

    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}