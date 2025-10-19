const search_icon = document.querySelector(`#search-icon`);
const search_bar = document.querySelector(`#search-bar`);

async function search(query, scope = '') {

  const token = localStorage.getItem('token');

  try{

    const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}&scope=${scope}`, {

        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
    });

    const data = await response.json();

    if(response.ok){

      showSearchResults(data);

    }else{

      throw new Error(data.message || 'Failed to search');

    }

  }catch (error){

    console.log('Search failed:', error);

  }

}


function showSearchResults(results) {

  const modal = document.querySelector('#search-modal');
  const container = document.querySelector('#search-results-container');
  const closeBtn = document.querySelector('#close-modal');

  container.innerHTML = ''; // clear previous results

  if (!results.length) {
    container.innerHTML = `<p style="text-align:center; color:#888;">No results found.</p>`;
  } else {
    results.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('search-result-item');

      div.innerHTML = `

        <div class="search-result-source">📁 ${item.source || 'Unknown Source'}</div>

        <div class="search-result-title">${item.item_name || item.full_name || item.officer_name || 'Unnamed'}</div>

        <div class="search-result-detail">

            ${item.detail ? `<p>${item.detail}</p>` : ''}
            ${item.home_address ? `<p><strong> Home Address:</strong> ${item.home_address}</p>` : ''}
            ${item.accident_address ? `<p><strong> Accident Address:</strong> ${item.accident_address}</p>` : ''}
            ${item.contact ? `<p><strong>Contact:</strong> ${item.contact}</p>` : ''}
            ${item.quantity ? `<p><strong>Quantity:</strong> ${item.quantity}</p>` : ''}
            ${item.accident ? `<p><strong>Type of Accident:</strong> ${item.accident}</p>` : ''}
            ${item.role ? `<p><strong>Role:</strong> ${item.role}</p>` : ''}
            ${item.status ? `<p><strong>Status:</strong> ${item.status}</p>` : ''}
            ${item.person_in_charge ? `<p><strong>Person In Charge:</strong> ${item.person_in_charge}</p>` : ''}
    

        </div>
      `;

      container.appendChild(div);
    });
  }

  modal.style.display = 'block';

  closeBtn.onclick = () => (modal.style.display = 'none');

  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
  };
}


search_bar.addEventListener('keydown', (e) => {

    if(e.key === "Enter"){

        const query = e.target.value.trim();
        if(query) search(query);

    }

});

search_icon.addEventListener('click', () => {

    const query = search_bar.value.trim();
    if(query) search(query);
    
});

