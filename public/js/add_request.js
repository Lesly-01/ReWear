document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createRequestForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const formData = new FormData(form);

            try {
                // Subimos un nivel con ../ para salir de /public/ y encontrar /solicitudes/
                const res = await fetch('../solicitudes/create.php', {
                    method: 'POST',
                    body: formData
                });

                // Si la ruta está mal o el servidor da error (404, 500, etc.)
                if (!res.ok) {
                    throw new Error(`Error HTTP: ${res.status} - No se encontró el archivo PHP en la ruta especificada.`);
                }

                const data = await res.json();

                if (data.success) {
                    alert(data.message);
                    form.reset();
                    
                    // Cerrar el modal de Bootstrap
                    const modalEl = document.getElementById('createRequestModal');
                    if (modalEl) {
                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.hide();
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