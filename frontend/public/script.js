document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const itemForm = document.getElementById('item-form');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const itemsContainer = document.getElementById('items-container');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    // State
    let editingItemId = null;
    
    // Base URL API backend
    const API_BASE_URL = 'http://localhost:3000/api';
    
    // Inisialisasi aplikasi
    fetchItems();
    
    // Event Listeners
    itemForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    
    // Fungsi-fungsi
    async function fetchItems() {
        showLoading(true);
        hideError();
        
        try {
            const response = await fetch(`${API_BASE_URL}/items`);
            if (!response.ok) throw new Error('Gagal mengambil data');
            
            const items = await response.json();
            renderItems(items);
        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    }
    
    function renderItems(items) {
        itemsContainer.innerHTML = '';
        
        if (items.length === 0) {
            itemsContainer.innerHTML = '<p>Belum ada item. Tambah item pertama!</p>';
            return;
        }
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <div class="item-header">
                    <div class="item-name">${escapeHtml(item.name)}</div>
                </div>
                <div class="item-description">${escapeHtml(item.description || 'Tidak ada deskripsi')}</div>
                <div class="item-actions">
                    <button class="edit" data-id="${item.id}">Edit</button>
                    <button class="delete" data-id="${item.id}">Hapus</button>
                </div>
            `;
            
            // Tambahkan event listener ke tombol
            itemElement.querySelector('.edit').addEventListener('click', () => startEdit(item));
            itemElement.querySelector('.delete').addEventListener('click', () => deleteItem(item.id));
            
            itemsContainer.appendChild(itemElement);
        });
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        
        if (!name) {
            showError('Nama item wajib diisi.');
            return;
        }
        
        showLoading(true);
        hideError();
        
        try {
            const url = editingItemId ? `${API_BASE_URL}/items/${editingItemId}` : `${API_BASE_URL}/items`;
            const method = editingItemId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            
            if (!response.ok) throw new Error('Gagal menyimpan item');
            
            resetForm();
            fetchItems();
        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    }
    
    async function deleteItem(id) {
        if (!confirm('Yakin ingin menghapus item ini?')) return;
        
        showLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/items/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Gagal menghapus item');
            
            fetchItems();
        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    }
    
    function startEdit(item) {
        nameInput.value = item.name;
        descriptionInput.value = item.description || '';
        submitBtn.textContent = 'Update Item';
        cancelBtn.classList.remove('hidden');
        editingItemId = item.id;
        itemForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    function cancelEdit() {
        resetForm();
    }
    
    function resetForm() {
        itemForm.reset();
        submitBtn.textContent = 'Tambah Item';
        cancelBtn.classList.add('hidden');
        editingItemId = null;
    }
    
    function showLoading(show) {
        loadingElement.classList.toggle('hidden', !show);
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    function hideError() {
        errorMessage.classList.add('hidden');
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
