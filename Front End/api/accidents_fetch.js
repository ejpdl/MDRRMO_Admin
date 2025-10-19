let allAccidents = [];

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
        allAccidents = data;

        renderAccidents(allAccidents);

    }catch(error){

        console.log(error);

    }

}


function renderAccidents(data) {

    const tbody = document.querySelector(`#accidents`);
    tbody.innerHTML = "";

    data.forEach((accident) => {

        const row = document.createElement("tr");

        let statusClass = "";
        if(accident.status === 'pending') statusClass = 'status-pending';
        else if(accident.status === 'accepted') statusClass = 'status-accepted';
        else if(accident.status === 'denied') statusClass = 'status-denied';


        let actionHTML = "";
        if(accident.status === 'pending'){
            actionHTML = `
            <button class="approved">Approve</button>
            <button class="denied">Deny</button>
            `;
        }else{

            actionHTML = `<span class="${statusClass}">${accident.status}</span>`;

        }

        row.innerHTML = `
            <td> ${accident.full_name} </td>
            <td> ${accident.contact} </td>
            <td> ${accident.accident_address} </td>
            <td>${new Date(accident.created_at).toLocaleDateString()}</td>
            <td>${new Date(accident.created_at).toLocaleTimeString()}</td>
            <td><img src="${accident.photo_url}" alt="Accident Photo" width="80" height="80"></td>
            <td> ${accident.type_of_accident} </td>
            <td class="action-button"> ${actionHTML} </td>
        `;

        tbody.appendChild(row);

        if(accident.status === 'pending') {

            const approveButton = row.querySelector('.approved');
            const denyButton = row.querySelector('.denied');

            approveButton.addEventListener('click', () => updateAccidentStatus(accident.id, 'accepted'));

            denyButton.addEventListener('click', () => updateAccidentStatus(accident.id, 'denied'));

        }            

    });

    document.querySelector(`tfoot span`).textContent = data.length;

}

const filterButtons = document.querySelectorAll(`.filter-container button`);

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        filterButtons.forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');

        const filter = button.dataset.name;

        if(filter === 'all'){

            renderAccidents(allAccidents);

        }else{

            const filtered = allAccidents.filter(acc => acc.status === filter);
            renderAccidents(filtered);

        }

    });

});

async function updateAccidentStatus(id, action) {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/update/accident/status/${id}`, {

            method: "PUT",
            headers: {

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`

            },
            body: JSON.stringify({ action })

        });

        const result = await response.json();

        if(response.ok) {

            showSnackbar(result.message, 'success');
            loadAccidents(); 

        }else{

            showSnackbar(result.message || 'Action failed', 'error');

        }

    }catch(error){

        console.log(error);

    }

}








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
            loadAccidents();

        }, 3000);

        closeBtn.onclick = () => {

            clearTimeout(timeout);
            snackbar.classList.remove('show');
            loadAccidents();

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




document.addEventListener("DOMContentLoaded", loadAccidents);