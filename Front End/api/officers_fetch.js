async function loadOfficers() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/viewAll/officers`, {

            headers: {

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`,

            },

        });

        const data = await response.json();

        const tbody = document.querySelector(`#officers`);
        tbody.innerHTML = "";

        data.forEach((officer) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td> ${officer.fullname} </td>
                <td> ${officer.admin_address} </td>
                <td> ${officer.admin_contact} </td>
                <td> ${officer.role} </td>
            `;

            tbody.appendChild(row);

        });

        document.querySelector(`tfoot span`).textContent = data.length;

    }catch(error){

        console.log(error);

    }

}


document.addEventListener("DOMContentLoaded", loadOfficers);