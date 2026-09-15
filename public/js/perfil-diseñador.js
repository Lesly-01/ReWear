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

  // 2. Editar perfil
  const editProfileForm = document.getElementById('editProfileForm');
  const editProfileModalElem = document.getElementById('editProfileModal');

  if (editProfileForm) {
    editProfileForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const newUsername = editProfileForm.querySelector('input[type="text"]')?.value || '';
      const newBio = editProfileForm.querySelector('textarea')?.value || '';
      const inputsText = editProfileForm.querySelectorAll('input[type="text"]');
      const newSpecialty = inputsText.length > 1 ? inputsText[1].value : '';

      const usernameHeader = document.getElementById('profileUsername') || document.querySelector('h5');
      const specialtyBadge = document.querySelector('.badge.rounded-pill.text-dark.border');
      const bioParagraph = document.querySelector('p.text-muted.extra-small');

      if (usernameHeader) usernameHeader.textContent = newUsername;
      if (specialtyBadge) specialtyBadge.textContent = newSpecialty;
      if (bioParagraph) bioParagraph.textContent = newBio;

      // Actualizar localStorage dinámicamente
      if (usuarioGuardado) {
        usuarioGuardado.username = newUsername;
        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioGuardado));
      }

      if (editProfileModalElem) {
        const modalInstance = bootstrap.Modal.getInstance(editProfileModalElem) || new bootstrap.Modal(editProfileModalElem);
        modalInstance.hide();
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