document.addEventListener('DOMContentLoaded', () => {
    const medicine_list = document.getElementById('list');
    const search_bar = document.getElementById('search-bar');
    const medicine_form = document.getElementById('medicine-form');
    const update_form = document.getElementById('update-form');
    const delete_form = document.getElementById('delete-form');
    const calculate_button = document.getElementById('calculate-average');

    // Function to search for a medicine
    async function search_medicine(event) {
        const name = event.target.value.trim();
        if (name === '') {
            display_medicines();
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/medicines/${name}`);
            if (!response.ok) throw new Error('Medicine not found');
            const data = await response.json();
            medicine_list.innerHTML = data.error 
                ? `<li class="error-message">${data.error}</li>` 
                : `<li><span class="medicine-name">${data.name || "Name Unavailable"}</span> 
                    <span class="medicine-price">£ ${data.price ? data.price.toFixed(2) : "Price Unavailable"}</span></li>`;
        } catch (error) {
            console.error('Error:', error);
            medicine_list.innerHTML = `<li class="error-message">Error: Medicine not found.</li>`;
        }
    }

    // Function to display the list of medicines
    async function display_medicines() {
        try {
            const response = await fetch('http://localhost:8000/medicines');
            if (!response.ok) throw new Error('Failed to fetch medicines');
            const data = await response.json();
            medicine_list.innerHTML = data.medicines.length 
                ? data.medicines.map(({ name = "", price = null }) => 
                    `<li><span class="medicine-name">${name || "Name Unavailable"}</span>
                        <span class="medicine-price">£ ${price ? price.toFixed(2) : "Price Unavailable"}</span></li>`).join('')
                : `<li>No medicines available.</li>`;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to add a new medicine
    async function add_medicine(event) {
        event.preventDefault();
        const name = document.getElementById('medicine-name').value;
        const price = parseFloat(document.getElementById('medicine-price').value);
        try {
            const response = await fetch('http://localhost:8000/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price })
            });
            if (!response.ok) throw new Error('Failed to add medicine');
            document.getElementById('medicine-name').value = '';
            document.getElementById('medicine-price').value = '';
            await display_medicines();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add medicine. Please try again.');
        }
    }

    // Function to update an existing medicine
    async function update_medicine(event) {
        event.preventDefault();
        const name = document.getElementById('update-name').value;
        const price = parseFloat(document.getElementById('update-price').value);
        try {
            const response = await fetch('http://localhost:8000/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price })
            });
            if (!response.ok) throw new Error('Failed to update medicine');
            document.getElementById('update-name').value = '';
            document.getElementById('update-price').value = '';
            await display_medicines();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update medicine. Please try again.');
        }
    }

    // Function to delete a medicine
    async function delete_medicine(event) {
        event.preventDefault();
        const name = document.getElementById('delete-name').value;
        try {
            const response = await fetch(`http://localhost:8000/delete/${name}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete medicine');
            document.getElementById('delete-name').value = '';
            await display_medicines();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete medicine. Please try again.');
        }
    }

    // Function to display the average price of all medicines
    async function average_price() {
        try {
            const response = await fetch('http://localhost:8000/average');
            if (!response.ok) throw new Error('Failed to fetch average price');
            const data = await response.json();
            document.getElementById('average-price-display').textContent = `Average Price: £${data.average_price.toFixed(2)}`;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('average-price-display').textContent = "Error fetching average price.";
        }
    }

    // Add event listeners
    search_bar.addEventListener('input', search_medicine);
    medicine_form.addEventListener('submit', add_medicine);
    update_form.addEventListener('submit', update_medicine);
    delete_form.addEventListener('submit', delete_medicine);
    
    // Check if calculate button exists before adding an event listener
    if (calculate_button) {
        calculate_button.addEventListener('click', average_price);
    } else {
        console.warn("Warning: 'calculate-average' button not found.");
    }

    // Display medicines on page load
    display_medicines();
});
