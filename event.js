const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const table = document.getElementById('eventsTable');
const rows = table.querySelectorAll('tbody tr');
const eventCount = document.getElementById('eventCount');

function filterEvents() {
    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    let count = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const category = row.getAttribute('data-category');

        const matchesSearch = text.includes(searchValue);
        const matchesCategory = categoryValue === 'all' || category === categoryValue;

        if (matchesSearch && matchesCategory) {
            row.style.display = '';
            count++;
        } else {
            row.style.display = 'none';
        }
    });

    eventCount.textContent = `Showing ${count} events`;
}

searchInput.addEventListener('keyup', filterEvents);
categoryFilter.addEventListener('change', filterEvents);
