document.addEventListener('DOMContentLoaded', function () {
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');

    // Elementos donde se muestra la información en pantalla
    const displayUsername = document.getElementById('displayUsername');
    const displayTagline = document.getElementById('displayTagline');
    const displayBio = document.getElementById('displayBio');

    // Campos de texto dentro del Modal
    const inputUsername = document.getElementById('inputUsername');
    const inputTagline = document.getElementById('inputTagline');
    const inputBio = document.getElementById('inputBio');

    // 1. CARGAR DATOS ACTUALES AL ABRIR EL MODAL
    if (editProfileModal) {
      editProfileModal.addEventListener('show.bs.modal', function () {
        inputUsername.value = displayUsername.textContent.trim();
        inputTagline.value = displayTagline.textContent.trim();
        inputBio.value = displayBio.textContent.trim();
      });
    }

    // 2. ACTUALIZAR EL PERFIL EN VIVO AL GUARDAR
    if (editProfileForm) {
      editProfileForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Previene recarga de página

        // Actualiza el DOM inmediatamente con los nuevos valores
        displayUsername.textContent = inputUsername.value.trim();
        displayTagline.textContent = inputTagline.value.trim();
        displayBio.textContent = inputBio.value.trim();

        // Oculta el Modal de Bootstrap
        const modalInstance = bootstrap.Modal.getInstance(editProfileModal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
    }
  });