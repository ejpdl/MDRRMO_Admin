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
            localStorage.setItem('adminId', tokenPayload.admin_id);
            window.location.href = '../pages/dashboard.html'

        }else {

            alert(`Incorrect Password or Username`);

        }


    }catch(error){

        console.log(error);
        alert(`Incorrect Password or Username`);

    }

})