

// ----------------------------- FORMAT DATE -----------------------------

function formatDateTime(datetimeString) {

    const date = new Date(datetimeString);

    const optionsDate = {

        month: "long",
        day: "numeric",
        year: "numeric"

    };

    const optionsTime = {

        hour: "numeric",
        minute: "2-digit",
        hour12: true

    };

    const formattedDate = date.toLocaleDateString("en-US", optionsDate);
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

    return `${formattedDate} / ${formattedTime}`;

}





// ----------------------------- LOAD INVENTORIES INFO -----------------------------



async function loadInventories() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/viewAll/inventories`, {

            headers: {

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`,

            }

        });

        const data = await response.json();

        const tbody = document.querySelector(`#inventories`);
        tbody.innerHTML = "";

        data.forEach((inventory) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td> ${inventory.item_name} </td>
                <td> ${inventory.quantity} </td>
                <td> ${formatDateTime(inventory.updated_at)} </td>
                <td> ${inventory.person_in_charge} </td>
                <td class="action-button">
                    <button class="edit" onclick="editEditModal(${inventory.inventory_id})">Edit</button>
                    <button class="delete" id="open-delete-modal" onclick="openDeleteModal(${inventory.inventory_id}, '${inventory.item_name}')">Delete</button>
                </td>
            `;

            tbody.appendChild(row);

        });

        document.querySelector(`tfoot span`).textContent = data.length;

    }catch(error){

        console.log(error);

    }   

}




// ----------------------------- ADD INVENTORIES -----------------------------



const open_add = document.querySelector(`#open-add-modal`);
const add_modal_container = document.querySelector(`#add-modal-container`);
const cancel_add = document.querySelector(`#cancel-add`);

const add_inventory = document.querySelector(`#add-inventory-form`);
const submitBtn = document.querySelector(`#submit-inventory-btn`);
const modalTitle = document.querySelector(`#modal-title`);

let currentMode = "add";
let currentEditId = null;

open_add.addEventListener('click', (e) => {

    e.preventDefault();

    currentMode = "add";
    currentEditId = null;
    modalTitle.innerHTML = `<span style="color:#EA4D2E;">Add</span> Inventories`;
    submitBtn.textContent = "Add Inventory";
    add_inventory.reset();
    add_modal_container.classList.add('show');

});

cancel_add.addEventListener('click', () => {

    add_modal_container.classList.remove('show');

});

document.addEventListener('keydown', (e) => {

    if (e.key === "Escape") add_modal_container.classList.remove('show');

});


add_inventory.addEventListener('submit', async (event) => {

  event.preventDefault();

  const formData = new FormData(event.target);

  const item_name = formData.get('item_name');
  const quantity = formData.get('quantity');

  const data = {

    item_name: item_name.trim(),
    quantity: quantity.trim() || null,

  };

  try {

    const token = localStorage.getItem('token');

    const url = currentMode === "add"
      ? `http://localhost:3000/add/inventory`
      : `http://localhost:3000/update/inventory/${currentEditId}`;

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
          ? "Successfully Added Inventory"
          : "Successfully Updated Inventory"

      );

      event.target.reset();
      
      add_modal_container.classList.remove('show');
      loadInventories();

    }else{

      showSnackbar(result.message || 'Operation Failed', 'error');
      console.error(`Error: `, result);

    }

  }catch(error){

    console.error(`Error while saving inventory:`, error);
    showSnackbar('Server Error', 'error');

  }finally{

    submitBtn.disabled = false;
    submitBtn.textContent = currentMode === "add" ? "Add Inventory" : "Save Changes";

  }
  
});





// ----------------------------- EDIT INVENTORIES -----------------------------



async function editEditModal(inventory_id) {

  try {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3000/view/inventory/${inventory_id}`, {

      headers: {

        'Content-Type'  : 'application/json',
        'Authorization': `Bearer ${token}`

      }

    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Failed to fetch inventory');

    document.querySelector('#item_name').value = result.item_name;
    document.querySelector('#quantity').value = result.quantity;

    currentMode = "edit";
    currentEditId = inventory_id;
    modalTitle.innerHTML = `<span style="color:#EA4D2E;">Update</span> Inventories`;
    submitBtn.textContent = "Save Changes";

    add_modal_container.classList.add('show');

  }catch(error){

    console.error('Error fetching inventory:', error);
    showSnackbar('Failed to load inventory data', 'error');

  }

}




// ----------------------------- DELETE INVENTORIES -----------------------------



let inventoryDelete = null;
function openDeleteModal(inventory_id, item_name) {

    inventoryDelete = inventory_id;
    document.querySelector('#delete-modal-title').textContent = item_name;
    document.querySelector('#delete-modal-container').classList.add('show');

}

function closeDeleteModal() {

    document.querySelector('#delete-modal-container').classList.remove('show');
    inventoryDelete = null;

}

document.querySelector('#confirm-delete').addEventListener('click', async () => {

    if(!inventoryDelete) return;

    try{

        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/delete/inventory/${inventoryDelete}`, {

            method: 'DELETE',
            headers: { 

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`

            }

        });

        const result = await response.json();

        if(response.ok){

            showSnackbar(`Successfully Deleted Inventory`);
            loadInventories();

        }else{

            showSnackbar(result.message || 'Failed to Delete Inventory', 'error');
            console.error(`Error deleting Inventory: `, result);

        }

    }catch(error){

        console.log(error);
        showSnackbar(`Failed to Delete Inventory`, 'error');

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
            loadInventories();

        }, 3000);

        closeBtn.onclick = () => {

            clearTimeout(timeout);
            snackbar.classList.remove('show');
            loadInventories();

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



document.addEventListener("DOMContentLoaded", loadInventories);