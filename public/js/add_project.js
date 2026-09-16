document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', guardarProyecto);
    }
});

async function guardarProyecto(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('../prendas/create.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            form.reset();

            // Cerrar el modal de Bootstrap
            const modalElement = document.getElementById('newPostModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            }
        } else {
            alert('Atención: ' + result.message);
        }
    } catch (error) {
        console.error('Error al guardar el proyecto:', error);
        alert('Ocurrió un problema de conexión al guardar el proyecto.');
    }
}