const tbody = document.querySelector(`#logs-table-body`);
const footerLeft = document.querySelector(`.footer-left`);
const footerRight = document.querySelector(`.footer-right`);

let currentPage = 1;
const limit = 10;

async function loadLogs(page = 1) {

    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3000/viewAll/logs?page=${page}&limit=${limit}`, {

        headers: {

            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'

        }

    });

    const result = await response.json();
    const { logs, total, totalPages, currentPage } = result;

    tbody.innerHTML = "";

    logs.forEach(log => {

        const tr = document.createElement("tr");

        const actionClass = log.action.toLowerCase();

        tr.innerHTML = `
        <td>${log.fullname}</td>
        <td class="action-log ${actionClass}">${log.action}</td>
        <td>${log.description}</td>
        <td>${new Date(log.created_at).toLocaleString()}</td>
        `

        tbody.appendChild(tr);

    });

    footerLeft.textContent = `${logs.length} of ${total} row(s) shown.`;

    footerRight.innerHTML = "";

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.classList.add('page-btn');
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => loadLogs(currentPage - 1);
    footerRight.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => loadLogs(i);
        footerRight.appendChild(btn);

    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.classList.add('page-btn');
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => loadLogs(currentPage + 1);
    footerRight.appendChild(nextBtn);

}
        


loadLogs();