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

    // Fungsi fetch data dengan penanganan error yang aman
    const fetchAndRenderNotes = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const notes = await response.json();
            renderNotes(notes);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            if (notesContainer) notesContainer.innerHTML = '<p>Gagal memuat data.</p>';
        }
    };

    const renderNotes = (notes) => {
        if (!notesContainer) return;
        notesContainer.innerHTML = '';
        if (!notes || notes.length === 0) {
            notesContainer.innerHTML = '<p>Belum ada note.</p>';
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

    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const id = noteIdInput.value;

        if (!title) return alert("Judul harus diisi!");

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            // Jika response.ok adalah true (200-299), kita anggap sukses
            if (response.ok) {
                resetForm();
                await fetchAndRenderNotes();
            } else {
                // Jika server merespons error (4xx/5xx)
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Server error');
            }
        } catch (error) {
            console.error("Error pada form submit:", error);
            alert('Gagal menyimpan: ' + error.message);
        }
    });

    // Helper untuk edit/hapus
    notesContainer.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('delete-btn')) {
            if (!confirm('Hapus note ini?')) return;
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchAndRenderNotes();
        } else if (e.target.classList.contains('edit-btn')) {
            const res = await fetch(`${API_URL}/${id}`);
            const note = await res.json();
            isEditing = true;
            noteIdInput.value = note.id;
            titleInput.value = note.title;
            contentInput.value = note.content;
            formTitle.textContent = 'Edit Note';
            submitBtn.textContent = 'Update';
            cancelBtn.classList.remove('hidden');
        }
    });

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

    fetchAndRenderNotes();
});
