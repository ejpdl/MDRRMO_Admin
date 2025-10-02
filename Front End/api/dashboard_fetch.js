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
                    <button class="edit" onclick="editContact(${contact.contact_id})">Edit</button>
                    <button class="delete" onclick="deleteContact(${contact.contact_id})">Delete</button>
                </td>

            `;

            tbody.appendChild(row);

        });

    }catch(error){

        console.log(error);

    }

}



document.addEventListener("DOMContentLoaded", LoadDashboardInfo);
document.addEventListener("DOMContentLoaded", loadEmergencyContacts);


// setInterval(LoadDashboardInfo, 60000);