document.addEventListener('DOMContentLoaded', () => {
    loadMedicines();
});

async function loadMedicines() {
    try {
        const response = await fetch('http://localhost:8000/medicines');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        populateDropdowns(data.medicines);
        displayMedicines(data.medicines);
    } catch (error) {
        showNotification('Error loading medicines: ' + error.message, 'error');
    }
}

function populateDropdowns(medicines) {
    const updateSelect = document.getElementById('updateName');
    const deleteSelect = document.getElementById('deleteName');
    
    [updateSelect, deleteSelect].forEach(select => {
        select.innerHTML = medicines.map(med => 
            `<option value="${med.name}">${med.name}</option>`
        ).join('');
    });
}

function displayMedicines(medicines) {
    const container = document.querySelector('.medicine-grid');
    container.innerHTML = medicines.map(med => `
        <div class="medicine-card">
            <h3>${med.name || 'Unknown Medicine'}</h3>
            <p>Price: ${med.price ? '$'+med.price.toFixed(2) : 'N/A'}</p>
        </div>
    `).join('') || '<p>No medicines found</p>';
}

async function handleCreate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name').trim(),
        price: parseFloat(formData.get('price'))
    };

    if (!data.name || isNaN(data.price)) {
        return showNotification('Invalid input values', 'error');
    }

    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data)
        });
        
        if (!response.ok) throw new Error('Create failed');
        showNotification('Medicine created successfully!', 'success');
        event.target.reset();
        await loadMedicines();
    } catch (error) {
        showNotification('Create error: ' + error.message, 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}