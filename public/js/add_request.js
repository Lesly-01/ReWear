document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createRequestForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            try {
                const res = await fetch('../solicitudes/create.php', {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) {
                    throw new Error(`Error HTTP: ${res.status}`);
                }

                const data = await res.json();

                if (data.success) {
                    alert(data.message);
                    form.reset();
                    
                    // Cerrar el modal
                    const modalEl = document.getElementById('createRequestModal');
                    if (modalEl) {
                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.hide();
                    }

                    // Actualizar las tarjetas automáticamente en pantalla
                    if (typeof window.cargarSolicitudes === 'function') {
                        window.cargarSolicitudes();
                    }
                } else {
                    alert('Error en la BD: ' + data.message);
                }
            } catch (err) {
                console.error('Error al enviar la solicitud:', err);
                alert('Ocurrió un error al procesar el formulario: ' + err.message);
            }
        });
    }
});