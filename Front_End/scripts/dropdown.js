function toggleSortMenu() {

    document.getElementById("sortMenu").classList.toggle("show");

}

window.onclick = function(event) {

    if (!event.target.closest('.sort-container')) {
    
        document.getElementById("sortMenu").classList.remove("show");

    }
};