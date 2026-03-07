document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api/notes';
    const noteForm = document.getElementById('note-form');
    const formTitle = document.getElementById('form-title');
    const noteIdInput = document.getElementById('note-id');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const notesContainer = document.getElementById('notes-container');

    let isEditing = false;

    // Fungsi untuk fetch dan render notes
    const fetchAndRenderNotes = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Gagal mengambil notes');
            const notes = await response.json();
            renderNotes(notes);
        } catch (error) {
            console.error(error);
            notesContainer.innerHTML = '<p>Gagal memuat data.</p>';
        }
    };

    const renderNotes = (notes) => {
        notesContainer.innerHTML = '';
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>Belum ada note. Buat yang pertama!</p>';
            return;
        }
        notes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'note-item';
            noteEl.innerHTML = `
                <div class="note-header">
                    <div class="note-title">${escapeHtml(note.title)}</div>
                    <div class="note-actions">
                        <button class="edit-btn" data-id="${note.id}">Edit</button>
                        <button class="delete-btn" data-id="${note.id}">Hapus</button>
                    </div>
                </div>
                <div class="note-content">${escapeHtml(note.content || '')}</div>
            `;
            notesContainer.appendChild(noteEl);
        });
    };

    // Event listener untuk form submit
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const id = noteIdInput.value;

        if (!title) return;

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) throw new Error('Gagal menyimpan note');
            
            resetForm();
            fetchAndRenderNotes();

        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan note. Coba lagi.');
        }
    });

    // Event delegation untuk tombol edit dan hapus
    notesContainer.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('edit-btn')) {
            startEdit(id);
        } else if (target.classList.contains('delete-btn')) {
            deleteNote(id);
        }
    });
    
    cancelBtn.addEventListener('click', resetForm);

    const startEdit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil note');
            const note = await response.json();
            
            isEditing = true;
            noteIdInput.value = note.id;
            titleInput.value = note.title;
            contentInput.value = note.content || '';
            formTitle.textContent = 'Edit Note';
            submitBtn.textContent = 'Update';
            cancelBtn.classList.remove('hidden');
            titleInput.focus();
        } catch (error) {
            console.error(error);
            alert('Gagal memuat note untuk diedit.');
        }
    };

    const deleteNote = async (id) => {
        if (!confirm('Yakin ingin menghapus note ini?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Gagal menghapus note');
            fetchAndRenderNotes();
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus note.');
        }
    };

    const resetForm = () => {
        noteForm.reset();
        noteIdInput.value = '';
        isEditing = false;
        formTitle.textContent = 'Buat Note Baru';
        submitBtn.textContent = 'Simpan';
        cancelBtn.classList.add('hidden');
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Initial load
    fetchAndRenderNotes();
});
