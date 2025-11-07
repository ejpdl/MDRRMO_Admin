async function loadNotifications() {

    const token = localStorage.getItem('token');

    try{

        const response = await fetch(`http://localhost:3000/notifications/count`, {

            headers: {

                'Content-Type'  :   'application/json',
                'Authorization' :   `Bearer ${token}`

            }

        });

        const data = await response.json();

        const badge = document.querySelector(`#notifBadge`);

        if(response.ok){

            if(data.count > 0){

                badge.textContent = data.count;
                badge.style.display = 'inline-block';
            
            }else{

                badge.style.display = 'none';

            }

        }else{

            console.error(`Error loading notifications: `, data.message);

        }


    }catch(error){

        console.log(error);

    }

}

loadNotifications();

// setInterval(loadNotifications, 5000);

document.querySelector(`#notifLink`).addEventListener('click', () => {

    const badge = document.querySelector(`#notifBadge`);
    badge.style.display = 'none';

})