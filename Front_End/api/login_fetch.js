const login = document.querySelector(`#login-form`);

login.addEventListener('submit', async (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);

    const email = formData.get('email');
    const admin_password = formData.get('password');

    const data = {

        email: email,
        admin_password: admin_password

    }

    try{

        const response = await fetch(`http://localhost:3000/login/admin`, {

            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(data),

        });

        const result = await response.json();

        if(response.ok){

            localStorage.setItem('token', result.token);
            const tokenPayload = JSON.parse(atob(result.token.split('.')[1]));
            localStorage.setItem('admin_id', tokenPayload.admin_id);
            window.location.href = '../MDRRMO_Admin/Front_End/pages/dashboard.html'

        }else {

            showSnackbar(`Incorrect Password or Username`, "error");

        }


    }catch(error){

        console.log(error);
        showSnackbar(`Incorrect Password or Username`, "error");

    }

});

function showSnackbar(message, type = "success") {

  const snackbar = document.querySelector(`#snackbar`);
  const messageBox = document.querySelector(`#snackbar-message`);
  const closeBtn = document.querySelector(`#snackbar-close`);

  messageBox.textContent = message;

  snackbar.className = ''
  snackbar.classList.add('show', type);

  const timeout = setTimeout(() => {

    snackbar.classList.remove('show');

  }, 3000);

  closeBtn.onclick = () => {

    clearTimeout(timeout);
    snackbar.classList.remove('show');

  };

}
