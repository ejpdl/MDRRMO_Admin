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
                    <button class="edit" onclick="editInventory(${inventory.inventory_id})">Edit</button>
                    <button class="delete" onclick="deleteInventory(${inventory.inventory_id})">Delete</button>
                </td>
            `;

            tbody.appendChild(row);

        });

        document.querySelector(`tfoot span`).textContent = data.length;

    }catch(error){

        console.log(error);

    }   

}


document.addEventListener("DOMContentLoaded", loadInventories);