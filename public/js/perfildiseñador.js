document.addEventListener('DOMContentLoaded', function () {

  // Declara la variable en el scope principal de DOMContentLoaded
  let usuarioGuardado = null;

  try {
    usuarioGuardado = JSON.parse(localStorage.getItem('usuarioSesion')) || JSON.parse(localStorage.getItem('usuariosesion'));
    console.log("Datos de sesión recuperados:", usuarioGuardado);
  } catch (e) {
    console.error("Error al parsear localStorage:", e);
  }

  // 0. Actualizar el elemento de la interfaz con el username
  if (usuarioGuardado && usuarioGuardado.username) {
    let nombreMostrar = usuarioGuardado.username;
    
    // Si inicia sesión con email, toma lo que está antes del @
    if (nombreMostrar.includes('@') && !nombreMostrar.startsWith('@')) {
      nombreMostrar = nombreMostrar.split('@')[0];
    }

    const usernameFormateado = nombreMostrar.startsWith('@') 
      ? nombreMostrar 
      : `@${nombreMostrar}`;

    const usernameHeader = document.getElementById('profileUsername') || document.querySelector('h5');
    
    if (usernameHeader) {
      usernameHeader.textContent = usernameFormateado;
      console.log("Nombre actualizado con éxito en el DOM a:", usernameFormateado);
    } else {
      console.warn("No se encontró el elemento con id='profileUsername' o ningún <h5> en el HTML.");
    }
  } else {
    console.warn("No hay datos de 'usuarioSesion' en el localStorage.");
  }

  // 1. Ocultar notificación
  const notificationItems = document.querySelectorAll('#notificationsDropdown + .dropdown-menu .dropdown-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', function () {
      const badge = document.querySelector('#notificationsDropdown .bg-danger');
      if (badge) {
        badge.classList.add('d-none');
      }
    });
  });

  // 2. Editar perfil (MODIFICADO PARA ENVIAR IMAGEN Y DATOS AL BACKEND)
  const editProfileForm = document.getElementById('editProfileForm');
  const editProfileModalElem = document.getElementById('editProfileModal');

  // Llenar los campos del modal al abrirlo con la información actual de la vista
  if (editProfileModalElem) {
    editProfileModalElem.addEventListener('show.bs.modal', function () {
      const usernameHeader = document.getElementById('profileUsername') || document.querySelector('h5');
      const bioParagraph = document.querySelector('p.text-muted.extra-small');
      const specialtyBadge = document.querySelector('.badge.rounded-pill.text-dark.border');

      const inputUser = document.getElementById('editUsername');
      const inputBio = document.getElementById('editBio');
      const inputSpec = document.getElementById('editSpecialty');
      const inputFoto = document.getElementById('editFoto');

      if (inputUser && usernameHeader) inputUser.value = usernameHeader.textContent.trim();
      if (inputBio && bioParagraph) inputBio.value = bioParagraph.textContent.trim();
      if (inputSpec && specialtyBadge) inputSpec.value = specialtyBadge.textContent.trim();
      if (inputFoto) inputFoto.value = ''; // Limpiar la selección de foto previa
    });
  }

  if (editProfileForm) {
    editProfileForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const inputUser = document.getElementById('editUsername');
      const inputBio = document.getElementById('editBio');
      const inputSpec = document.getElementById('editSpecialty');
      const inputFoto = document.getElementById('editFoto');

      const newUsername = inputUser ? inputUser.value.trim() : '';
      const newBio = inputBio ? inputBio.value.trim() : '';
      const newSpecialty = inputSpec ? inputSpec.value.trim() : '';

      // Crear el objeto FormData para enviar texto y archivo al backend PHP
      const formData = new FormData();
      formData.append('username', newUsername);
      formData.append('biografia', newBio);
      formData.append('especialidad', newSpecialty);

      if (inputFoto && inputFoto.files[0]) {
        formData.append('foto', inputFoto.files[0]);
      }

      try {
        // Enviar la petición al servidor backend
        const response = await fetch('../backend/update_profile.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          // Actualizar elementos en el DOM
          const usernameHeader = document.getElementById('profileUsername') || document.querySelector('h5');
          const specialtyBadge = document.querySelector('.badge.rounded-pill.text-dark.border');
          const bioParagraph = document.querySelector('p.text-muted.extra-small');
          const profileAvatarImg = document.getElementById('profileAvatar');

          if (usernameHeader) usernameHeader.textContent = newUsername;
          if (specialtyBadge) specialtyBadge.textContent = newSpecialty;
          if (bioParagraph) bioParagraph.textContent = newBio;

          // Si el PHP devolvió la nueva ruta de la imagen, actualizar el avatar en el DOM
          if (result.ruta_foto && profileAvatarImg) {
            profileAvatarImg.src = `../${result.ruta_foto}?t=${new Date().getTime()}`;
          }

          // Actualizar localStorage dinámicamente
          if (usuarioGuardado) {
            usuarioGuardado.username = newUsername;
            localStorage.setItem('usuarioSesion', JSON.stringify(usuarioGuardado));
          }

          // Cerrar el Modal de Bootstrap
          if (editProfileModalElem) {
            const modalInstance = bootstrap.Modal.getInstance(editProfileModalElem) || new bootstrap.Modal(editProfileModalElem);
            modalInstance.hide();
          }

        } else {
          alert('Error al actualizar el perfil: ' + result.message);
        }
      } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Ocurrió un problema de conexión al guardar el perfil.');
      }
    });
  }

  // 3. Crear nueva publicación
  const createPostForm = document.getElementById('createPostForm');
  const portfolioContainer = document.getElementById('portfolioShowcaseContainer');
  const newPostModalElem = document.getElementById('newPostModal');

  if (createPostForm && portfolioContainer) {
    createPostForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const imgPath = document.getElementById('postImg')?.value || 'IMG/denim corset.png';
      const title = document.getElementById('postTitle')?.value || 'New Design';
      const minPrice = document.getElementById('postMinPrice')?.value || '0';

      const newDesignCol = document.createElement('div');
      newDesignCol.className = 'col-6 col-sm-3';
      newDesignCol.innerHTML = `
        <div class="rounded-3 bg-light p-2 text-center h-100 d-flex flex-column justify-content-between">
          <img src="${imgPath}" class="img-fluid rounded-3 mb-2" style="height: 80px; width: 100%; object-fit: cover;" alt="${title}">
          <div>
            <span class="d-block text-truncate extra-small fw-semibold text-dark">${title}</span>
            <span class="text-success extra-small fw-bold">$${minPrice}</span>
          </div>
        </div>
      `;

      portfolioContainer.prepend(newDesignCol);

      if (newPostModalElem) {
        const modalInstance = bootstrap.Modal.getInstance(newPostModalElem) || new bootstrap.Modal(newPostModalElem);
        modalInstance.hide();
      }

      createPostForm.reset();
    });
  }

});