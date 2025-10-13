async function loadAccidents() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/viewAll/accidents`, {

            headers: {

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`

            }

        });

        const data = await response.json();

        const tbody = document.querySelector(`#accidents`);
        tbody.innerHTML = "";

        data.forEach((accident) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td> ${accident.full_name} </td>
                <td> ${accident.contact} </td>
                <td> ${accident.accident_address} </td>
                <td>${new Date(accident.created_at).toLocaleDateString()}</td>
                <td>${new Date(accident.created_at).toLocaleTimeString()}</td>
                <td><img src="${accident.photo_url}" alt="Accident Photo" width="80" height="80"></td>
                <td> ${accident.type_of_accident} </td>
                <td class="action-button">
                    <button class="approved">Approved</button>
                    <button class="denied">Denied</button>
                </td>
            `;

            tbody.appendChild(row);

        });

        document.querySelector(`tfoot span`).textContent = data.length;


    }catch(error){

        console.log(error);

    }

}

document.addEventListener("DOMContentLoaded", loadAccidents);