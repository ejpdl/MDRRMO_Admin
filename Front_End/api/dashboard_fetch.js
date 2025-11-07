
// ----------------------------- LOAD DASHBOARD INFO -----------------------------

async function LoadDashboardInfo() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/admin/status`, {

            headers: {

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`,

            }

        });

        const data = await response.json();

        if(response.ok && data) {

            document.querySelector(`#officerCount`).innerText = data.officerCount;
            document.querySelector(`#userCount`).innerText = data.userCount;
            document.querySelector(`#inventoryCount`).innerText = data.inventoryCount;
            document.querySelector(`#accidentCount`).innerText = data.accidentCount;

        }else{

            console.error(`Error loading stats: `, data);

        }

    }catch(error){

        console.log(error);

    }

}





// ----------------------------- LOAD EMERGENCY CONTACT INFO -----------------------------




async function loadEmergencyContacts() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/viewAll/contacts`, {

            headers: {

                'Content-Type'  : 'application/json',
                'Authorization' : `Bearer ${token}`,

            }

        });

        const data = await response.json();

        const tbody = document.querySelector(`#emergency_contacts`);
        tbody.innerHTML = "";

        data.forEach((contact) => {

            const row = document.createElement("tr");

            const hotline = contact.hotline ?? "--";
            const landline = contact.landline ?? "--";
            const phone = contact.phone_number ?? "--";
            
            row.innerHTML = `

                <td> ${contact.office_name} </td>
                <td> ${hotline} </td>
                <td> ${landline} </td>
                <td> ${phone} </td>
                <td class="action-button">
                    <button class="edit" id="open-add-modal" onclick="editEditModal(${contact.contact_id})">Edit</button>
                    <button class="delete" id="open-delete-modal" onclick="openDeleteModal(${contact.contact_id}, '${contact.office_name}')">Delete</button>
                </td>

            `;

            tbody.appendChild(row);

        });

    }catch(error){

        console.log(error);

    }

}




// ----------------------------- ADD CONTACT -----------------------------




const open_add = document.querySelector(`#open-add-modal`);
const add_modal_container = document.querySelector(`#add-modal-container`);
const cancel_add = document.querySelector(`#cancel-add`);

const add_contact = document.querySelector(`#add-contact-form`);
const submitBtn = document.querySelector(`#submit-contact-btn`);
const modal_title = document.querySelector(`#modal-title`);

let currentMode = "add";
let currentEditId = null;

open_add.addEventListener('click', (e) => {

    e.preventDefault();

    currentMode = "add";
    currentEditId = null;
    modal_title.innerHTML = `<span style="color:#EA4D2E;">Add</span> Emergency Contact`;
    submitBtn.textContent = "Add Contact";
    add_contact.reset();
    add_modal_container.classList.add('show');

});

cancel_add.addEventListener('click', () => {

    add_modal_container.classList.remove('show');

});

document.addEventListener('keydown', (e) => {

    if (e.key === "Escape") add_modal_container.classList.remove('show');

});


add_contact.addEventListener('submit', async (event) => {

  event.preventDefault();

  const formData = new FormData(event.target);

  const office_name = formData.get('offices');
  const hotline = formData.get('hotlines');
  const landline = formData.get('landlines');
  const phone_number = formData.get('phone_number');

  const data = {

    office_name: office_name.trim(),
    hotline: hotline.trim() || null,
    landline: landline.trim() || null,
    phone_number: phone_number.trim() || null

  };

  try {

    const token = localStorage.getItem('token');

    const url = currentMode === "add"
      ? `http://localhost:3000/add/contact`
      : `http://localhost:3000/update/contact/${currentEditId}`;

    const method = currentMode === "add" ? 'POST' : 'PUT';

    submitBtn.disabled = true;
    submitBtn.textContent = currentMode === "add" ? "Adding..." : "Saving...";

    const response = await fetch(url, {

      method,
      headers: {

        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`

      },
      body: JSON.stringify(data),

    });

    const result = await response.json();

    if(response.ok){

      showSnackbar(

        currentMode === "add"
          ? "Successfully Added Contact"
          : "Successfully Updated Contact"

      );

      event.target.reset();
      
      add_modal_container.classList.remove('show');
      loadEmergencyContacts();

    }else{

      showSnackbar(result.message || 'Operation Failed', 'error');
      console.error(`Error: `, result);

    }

  }catch(error){

    console.error(`Error while saving contact:`, error);
    showSnackbar('Server Error', 'error');

  }finally{

    submitBtn.disabled = false;
    submitBtn.textContent = currentMode === "add" ? "Add Contact" : "Save Changes";

  }

});




// ----------------------------- EDIT CONTACT -----------------------------




async function editEditModal(contact_id) {

  try {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3000/view/contact/${contact_id}`, {

      headers: {

        'Content-Type'  : 'application/json',
        'Authorization': `Bearer ${token}`

      }

    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Failed to fetch contact');

    document.querySelector('#offices').value = result.office_name;
    document.querySelector('#hotlines').value = result.hotline || '';
    document.querySelector('#landlines').value = result.landline || '';
    document.querySelector('#phone_number').value = result.phone_number || '';

    currentMode = "edit";
    currentEditId = contact_id;
    modal_title.innerHTML = `<span style="color:#EA4D2E;">Update</span> Emergency Contact`;
    submitBtn.textContent = "Save Changes";

    add_modal_container.classList.add('show');

  }catch(error){

    console.error('Error fetching contact:', error);
    showSnackbar('Failed to load contact data', 'error');

  }

}



// ----------------------------- DELETE CONTACT -----------------------------



let contactDelete = null;
function openDeleteModal(contact_id, office_name) {

    contactDelete = contact_id;
    document.querySelector('#delete-modal-title').textContent = office_name;
    document.querySelector('#delete-modal-container').classList.add('show');

}

function closeDeleteModal() {

    document.querySelector('#delete-modal-container').classList.remove('show');
    contactDelete = null;

}

document.querySelector('#confirm-delete').addEventListener('click', async () => {

    if(!contactDelete) return;

    try{

        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/delete/contact/${contactDelete}`, {

            method: 'DELETE',
            headers: { 

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`

            }

        });

        const result = await response.json();

        if(response.ok){

            showSnackbar(`Successfully Deleted Contact`);
            loadEmergencyContacts();

        }else{

            showSnackbar(result.message || 'Failed to Delete Contact', 'error');
            console.error(`Error deleting contact: `, result);

        }

    }catch(error){

        console.log(error);
        showSnackbar(`Failed to Delete Contact`, 'error');

    }

    closeDeleteModal();

});

document.querySelector('#cancel-delete').addEventListener('click', closeDeleteModal);





// ----------------------------- SNACKBAR -----------------------------



function showSnackbar(message, type = "success") {

  const snackbar = document.querySelector(`#snackbar`);
  const messageBox = document.querySelector(`#snackbar-message`);
  const closeBtn = document.querySelector(`#snackbar-close`);

  messageBox.textContent = message;

  snackbar.className = ''
  snackbar.classList.add('show', type);

    if (type === 'success') {

        const timeout = setTimeout(() => {

            snackbar.classList.remove('show');
            loadEmergencyContacts();

        }, 3000);

        closeBtn.onclick = () => {

            clearTimeout(timeout);
            snackbar.classList.remove('show');
            loadEmergencyContacts();

        };

    }else if(type === 'error') {

        const timeout = setTimeout(() => {

            snackbar.classList.remove('show');

        }, 3000);

        closeBtn.onclick = () => {

            clearTimeout(timeout);
            snackbar.classList.remove('show');

        };

    }

}


document.addEventListener("DOMContentLoaded", LoadDashboardInfo);
document.addEventListener("DOMContentLoaded", loadEmergencyContacts);
