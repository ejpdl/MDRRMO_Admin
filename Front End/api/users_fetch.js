async function loadUsers() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/viewAll/users`, {

            headers: {

                'Content-Type'  : 'application/json',
                'Authorization' : `Bearer ${token}`,

            }

        });

        const data = await response.json();

        const tbody = document.querySelector(`#users`);
        tbody.innerHTML = "";

        data.forEach((user) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td> ${user.fullname} </td>
                <td> ${user.address} </td>
                <td> ${user.contact} </td>
                <td class="action-button">
                    <button class="edit" onclick="editOfficer(${user.id})">Edit</button>
                    <button class="delete" onclick="deleteOfficer(${user.id})">Delete</button>
                </td>

            `;

            tbody.appendChild(row);

        });

        document.querySelector(`tfoot span`).textContent = data.length;

    }catch(error){

        console.log(error);

    }

}

document.addEventListener("DOMContentLoaded", loadUsers);