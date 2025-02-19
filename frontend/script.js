document.addEventListener('DOMContentLoaded', () => {
    // Get references to the necessary HTML elements
    const medicine_list = document.getElementById('list');
    const search_bar = document.getElementById('search-bar');
    const medicine_form = document.getElementById('medicine-form');
    const update_form = document.getElementById('update-form');
    const delete_form = document.getElementById('delete-form');
    const calculate_button = document.getElementById('calculate-average');

    /**
     * Function to search for a specific medicine by name.
     * Fetches data from the `/medicines/{name}` endpoint and updates the medicine list.
     * If no input is provided, it displays all medicines.
     */
    async function search_medicine(event) {
        const name = event.target.value.trim();  // Get the search input and remove whitespace
        
        if (name === '') {
            display_medicines(); // If input is empty, display the full medicine list
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/medicines/${name}`);
            if (!response.ok) throw new Error('Medicine not found');
            const data = await response.json();

            // Update the medicine list with search results
            medicine_list.innerHTML = data.error 
                ? `<li class="error-message">${data.error}</li>` 
                : `<li><span class="medicine-name">${data.name || "Name Unavailable"}</span> 
                    <span class="medicine-price">£ ${data.price ? data.price.toFixed(2) : "Price Unavailable"}</span></li>`;
        } catch (error) {
            console.error('Error:', error);
            medicine_list.innerHTML = `<li class="error-message">Error: Medicine not found.</li>`;
        }
    }

    /**
     * Function to display all medicines in the database.
     * Fetches data from the `/medicines` endpoint and populates the list.
     */
    async function display_medicines() {
        try {
            const response = await fetch('http://localhost:8000/medicines');
            if (!response.ok) throw new Error('Failed to fetch medicines');
            const data = await response.json();

            // Populate the list with all available medicines
            medicine_list.innerHTML = data.medicines.length 
                ? data.medicines.map(({ name = "", price = null }) => 
                    `<li><span class="medicine-name">${name || "Name Unavailable"}</span>
                        <span class="medicine-price">£ ${price ? price.toFixed(2) : "Price Unavailable"}</span></li>`).join('')
                : `<li>No medicines available.</li>`;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Function to add a new medicine.
     * Sends a POST request to `/create` with the medicine's name and price.
     */
    async function add_medicine(event) {
        event.preventDefault();  // Prevent form submission from refreshing the page
        
        // Create a FormData object to send form data
        const formData = new FormData();
        formData.append('name', document.getElementById('medicine-name').value);
        formData.append('price', document.getElementById('medicine-price').value);
    
        try {
            const response = await fetch('http://localhost:8000/create', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to add medicine');
            
            // Clear form inputs after successful submission
            document.getElementById('medicine-form').reset();

            await display_medicines();  // Refresh medicine list
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add medicine. Please try again.');
        }
    }

    /**
     * Function to update an existing medicine.
     * Sends a PUT request to `/update` with the updated name and price.
     */
    async function update_medicine(event) {
        event.preventDefault();  // Prevent form submission from refreshing the page
        
        // Create a FormData object to send form data
        const formData = new FormData();
        formData.append('name', document.getElementById('update-name').value);
        formData.append('price', document.getElementById('update-price').value);
    
        try {
            const response = await fetch('http://localhost:8000/update', {
                method: 'PUT',
                body: formData  // Sending form data instead of JSON
            });

            if (!response.ok) throw new Error('Failed to update medicine');
            
            // Clear input fields after successful update
            document.getElementById('update-name').value = '';
            document.getElementById('update-price').value = '';

            await display_medicines();  // Refresh the medicine list
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update medicine. Please try again.');
        }
    }

    /**
     * Function to delete a medicine.
     * Sends a DELETE request to `/delete` with the medicine's name.
     */
    async function delete_medicine(event) {
        event.preventDefault();  // Prevent form submission from refreshing the page
        
        // Create a FormData object to send form data
        const formData = new FormData();
        formData.append('name', document.getElementById('delete-name').value);
    
        try {
            const response = await fetch('http://localhost:8000/delete', {
                method: 'DELETE',  // DELETE request with form data
                body: formData
            });

            if (!response.ok) throw new Error('Failed to delete medicine');
            
            // Clear input field after successful deletion
            document.getElementById('delete-name').value = '';

            await display_medicines();  // Refresh the medicine list
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete medicine. Please try again.');
        }
    }

    /**
     * Function to calculate the average price of all medicines.
     * Fetches data from the `/average` endpoint and displays the result.
     */
    async function average_price() {
        try {
            const response = await fetch('http://localhost:8000/average');
            if (!response.ok) throw new Error('Failed to fetch average price');
            const data = await response.json();

            // Display the average price in the UI
            document.getElementById('average-price-display').textContent = `Average Price: £${data.average_price.toFixed(2)}`;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('average-price-display').textContent = "Error fetching average price.";
        }
    }

    // Add event listeners for user interactions
    search_bar.addEventListener('input', search_medicine); // Trigger search when user types
    medicine_form.addEventListener('submit', add_medicine); // Add medicine on form submission
    update_form.addEventListener('submit', update_medicine); // Update medicine on form submission
    delete_form.addEventListener('submit', delete_medicine); // Delete medicine on form submission

    // Check if calculate button exists before adding an event listener
    if (calculate_button) {
        calculate_button.addEventListener('click', average_price);
    } else {
        console.warn("Warning: 'calculate-average' button not found.");
    }

    // Fetch and display medicines on page load
    display_medicines();
});
