

// ----------------------------- LOAD PERSONAL INFO -----------------------------

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



// ----------------------------- EDIT INFO -----------------------------



function setupEditableField(buttonId, inputId, fieldName) {

    const button = document.querySelector(buttonId);
    const input = document.querySelector(inputId);

    button.addEventListener("click", async function () {

        if (input.hasAttribute("readonly")) {
          
            input.removeAttribute("readonly");
            input.focus();
            this.textContent = "Save Changes";
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

                    showSnackbar(`${capitalize(fieldName)} updated successfully!`);
                    input.setAttribute("readonly", true);
                    this.textContent = `Change ${capitalize(fieldName)}`;
                    this.classList.remove("editing-btn");

                    if (fieldName === "password") {
                        input.value = "";
                    }

                }else{

                    showSnackbar(data.message || "Error updating field", "error");

                }
            }catch(error){

                console.error(error);
                showSnackbar(data.message || "Something Went Wrong");

            }

        }

    });

}




// ----------------------------- DELETE ACCOUNT -----------------------------



document.addEventListener('DOMContentLoaded', () => {

  const openDeleteButton = document.querySelector('#open-delete-modal');
  const admin_id = localStorage.getItem('admin_id');

  openDeleteButton.addEventListener('click', () => {

    if(!admin_id) {

      console.error('Admin ID not found in localStorage');
      showSnackbar('Admin ID not found. Please log in again.', 'error');
      return;

    }

    openDeleteModal(admin_id);

  });
  
});

let accountDelete = null;
function openDeleteModal(admin_id) {

    accountDelete = admin_id;
    document.querySelector('#delete-modal-container').classList.add('show');

}

function closeDeleteModal() {

    document.querySelector('#delete-modal-container').classList.remove('show');
    accountDelete = null;

}

document.querySelector('#confirm-delete').addEventListener('click', async () => {

    if(!accountDelete) return;

    try{

        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/delete/account/${accountDelete}`, {

            method: 'DELETE',
            headers: { 

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`

            }

        });

        const result = await response.json();

        if(response.ok){

            showSnackbar(`Successfully Deleted Account`);
            window.location.href = "../pages/landingpage.html";

        }else{

            showSnackbar(result.message || 'Failed to Delete Account', 'error');
            console.error(`Error deleting Account: `, result);

        }

    }catch(error){

        console.log(error);
        showSnackbar(`Failed to Delete Account`, 'error');

    }

    closeDeleteModal();

});

document.querySelector('#cancel-delete').addEventListener('click', closeDeleteModal);


function capitalize(str) {

    return str.charAt(0).toUpperCase() + str.slice(1);

}



// ----------------------------- SNACKBAR -----------------------------



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


document.addEventListener("DOMContentLoaded", LoadPersonalInfo);

setupEditableField("#updateFullName", "#fullname", "fullname");
setupEditableField("#updateAddress", "#address", "address");
setupEditableField("#updateContact", "#contact", "contact");

setupEditableField("#updateEmail", "#email", "email");
setupEditableField("#updatePassword", "#password", "password");