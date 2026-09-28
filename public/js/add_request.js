document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', guardarProyecto);
    }
});

async function guardarProyecto(event) {
    // Evita la recarga automática de la página
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        // Asegúrate de que la ruta apunte al directorio correcto de tu backend
        const response = await fetch('../prendas/create.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            form.reset();

            // Cierra el modal de Bootstrap tras guardar
            const modalElement = document.getElementById('newPostModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            }
        } else {
            alert('Attention: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving project:', error);
        alert('A connection error occurred while saving the project.');
    }
}