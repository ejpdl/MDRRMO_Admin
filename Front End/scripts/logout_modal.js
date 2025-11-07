const open = document.querySelector(`#open-logout-modal`);
const modal_container = document.querySelector(`#logout-modal-container`);
const cancel_logout = document.querySelector(`#cancel-logout`);

open.addEventListener('click', (e) => {

    e.preventDefault();
    modal_container.classList.add('show');

});


cancel_logout.addEventListener('click', () => {

    modal_container.classList.remove('show');

});

document.addEventListener('keydown', (e) => {

    if (e.key === "Escape") {
        modal_container.classList.remove('show');
    }

});


const confirm_logout = document.querySelector(`#confirm-logout`);

confirm_logout.addEventListener('click', () => {

    localStorage.removeItem('token');

    window.location.href = "../../landingpage.html";

});

