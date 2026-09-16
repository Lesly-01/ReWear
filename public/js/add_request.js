document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createRequestForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            try {
                const res = await fetch('solicitudes/create.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.success) {
                    alert(data.message);
                    form.reset();
                    const modalEl = document.getElementById('createRequestModal');
                    if (modalEl) {
                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.hide();
                    }
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                console.error('Error enviando solicitud:', err);
            }
        });
    }
});