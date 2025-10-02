const register = document.querySelector(`#register-form`);
const errorMsg = document.querySelector(`#error-msg`);

register.addEventListener('submit', async(event) => {

    event.preventDefault();

    const formData = new FormData(event.target);
    
    const role = formData.get('role');
    const email = formData.get('email');
    const admin_password = formData.get('password');
    const fullname = formData.get('fullname');
    const admin_address = formData.get('address');
    const admin_contact = formData.get('contact');

    const confirmPass = document.querySelector(`#confirm-password`).value;

    if(admin_password !== confirmPass) {

        errorMsg.textContent = "Passwords do not match!";
        return;

    }

    const data = {

        role: role,
        email: email,
        admin_password: admin_password,
        fullname: fullname,
        admin_address: admin_address,
        admin_contact: admin_contact,

    }

    try{

        const response = await fetch(`http://localhost:3000/register/admin`, {

            method: 'POST',
            headers: {

                'Content-Type' : 'application/json'

            },
            body: JSON.stringify(data),

        });

        const result = await response.json();

        if(response.ok) {

            localStorage.setItem('token', result.token);
            window.location.href = "../pages/landingpage.html";
            alert(`Successfully Registered`);

        }else{

            errorMsg.textContent = result.message || "Something went wrong.";

        }

    }catch(error) {

        errorMsg.textContent = "Server is unreachable.";
        console.log(error);

    }

});