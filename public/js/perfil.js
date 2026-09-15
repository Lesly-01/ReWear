document.addEventListener('DOMContentLoaded', function () {
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');

    // Elementos del DOM donde se muestra la información
    const profileUsername = document.getElementById('profileUsername');
    const profileBio = document.getElementById('profileBio');

    // Campos del formulario modal
    const inputUsername = document.getElementById('inputUsername');
    const inputBio = document.getElementById('inputBio');

    // 1. CARGAR EL NOMBRE AL INICIAR SESIÓN / CARGAR LA PÁGINA
    let usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion')) || {};

    if (profileUsername) {
        // Busca el nombre de usuario de la sesión o 'user', si no existe usa el predeterminado
        const nombreGuardado = usuarioSesion.username || usuarioSesion.nombre || usuarioSesion.user;
        
        if (nombreGuardado) {
            profileUsername.textContent = nombreGuardado.startsWith('@') 
                ? nombreGuardado 
                : `@${nombreGuardado}`;
        }
    }

    // 2. LLENAR LOS CAMPOS DEL MODAL AL ABRIRLO
    if (editProfileModal) {
      editProfileModal.addEventListener('show.bs.modal', function () {
        if (profileUsername && inputUsername) {
          inputUsername.value = profileUsername.textContent.trim();
        }
        if (profileBio && inputBio) {
          inputBio.value = profileBio.textContent.trim();
        }
      });
    }

    // 3. GUARDAR LOS CAMBIOS Y ACTUALIZAR LOCALSTORAGE
    if (editProfileForm) {
      editProfileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nuevoNombre = inputUsername.value.trim();
        const nuevaBio = inputBio.value.trim();

        // Actualizar visualmente la página
        if (profileUsername) profileUsername.textContent = nuevoNombre;
        if (profileBio) profileBio.textContent = nuevaBio;

        // Guardar el nuevo nombre en la sesión local
        usuarioSesion.username = nuevoNombre;
        usuarioSesion.nombre = nuevoNombre;
        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioSesion));

        // Cerrar el Modal
        const modalInstance = bootstrap.Modal.getInstance(editProfileModal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
    }
});