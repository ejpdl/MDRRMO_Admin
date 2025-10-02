async function LoadPersonalInfo() {

    const token = localStorage.getItem('token');

    try {

        const response = await fetch(`http://localhost:3000/admin/profile`, {

            headers: {
                
                'Content-Type'    :   'application/json',
                'Authorization'   :   `Bearer ${token}`,
            }

        });

        const data = await response.json();

        if(response.ok && data) {

            document.querySelector(`#fullname`).value = data.fullname;
            document.querySelector(`#address`).value = data.admin_address;
            document.querySelector(`#contact`).value = data.admin_contact;
            document.querySelector(`#email`).value = data.email;
            document.querySelector(`#password`).value = "";

        }else{

            console.log(`No data found or an error occured`);
            alert(`Could not retrieve user data. Please try again`);

        }

    }catch(error) {

        console.log(error);

    }


}

function setupEditableField(buttonId, inputId, fieldName) {

    const button = document.querySelector(buttonId);
    const input = document.querySelector(inputId);

    button.addEventListener("click", async function () {

        if (input.hasAttribute("readonly")) {
          
            input.removeAttribute("readonly");
            input.focus();
            this.textContent = "Save";
            this.classList.add("editing-btn");

        } else {
            
            const newValue = input.value;

            const token = localStorage.getItem("token");

            try {

                const response = await fetch(`http://localhost:3000/admin/edit_info`, {

                    method: "PUT",
                    headers: {

                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,

                    },
                    body: JSON.stringify({ [fieldName]: newValue }),

                });

                const data = await response.json();

                if(response.ok){

                    alert(`${fieldName} updated successfully!`);
                    input.setAttribute("readonly", true);
                    this.textContent = `Change ${capitalize(fieldName)}`;
                    this.classList.remove("editing-btn");

                    if (fieldName === "password") {
                        input.value = "";
                    }

                }else{

                    alert(data.message || "Error updating field");

                }
            }catch(error){

                console.error(error);
                alert("Something went wrong. Please try again.");

            }

        }

    });

}

function capitalize(str) {

    return str.charAt(0).toUpperCase() + str.slice(1);

}


document.addEventListener("DOMContentLoaded", LoadPersonalInfo);

setupEditableField("#updateFullName", "#fullname", "fullname");
setupEditableField("#updateAddress", "#address", "address");
setupEditableField("#updateContact", "#contact", "contact");

setupEditableField("#updateEmail", "#email", "email");
setupEditableField("#updatePassword", "#password", "password");