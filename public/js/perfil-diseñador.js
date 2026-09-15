document.addEventListener('DOMContentLoaded', function () {

  // 1. Ocultar notificación solo al interactuar con el menú de notificaciones
  const notificationItems = document.querySelectorAll('#notificationsDropdown + .dropdown-menu .dropdown-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', function () {
      const badge = document.querySelector('#notificationsDropdown .bg-danger');
      if (badge) {
        badge.classList.add('d-none');
      }
    });
  });

  // 2. Lógica para editar el perfil del diseñador (Username, Bio, Specialty)
  const editProfileForm = document.getElementById('editProfileForm');
  const editProfileModalElem = document.getElementById('editProfileModal');

  if (editProfileForm) {
    editProfileForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Capturar los valores del formulario
      const newUsername = editProfileForm.querySelector('input[type="text"]').value;
      const newBio = editProfileForm.querySelector('textarea').value;
      const newSpecialty = editProfileForm.querySelectorAll('input[type="text"]')[1].value;

      // Actualizar el DOM en la tarjeta principal
      const usernameHeader = document.querySelector('h5.fw-bold.text-dark');
      const specialtyBadge = document.querySelector('.badge.rounded-pill.text-dark.border');
      const bioParagraph = document.querySelector('p.text-muted.extra-small');

      if (usernameHeader) usernameHeader.textContent = newUsername;
      if (specialtyBadge) specialtyBadge.textContent = newSpecialty;
      if (bioParagraph) bioParagraph.textContent = newBio;

      // Cerrar el modal de bootstrap dinámicamente
      if (editProfileModalElem) {
        const modalInstance = bootstrap.Modal.getInstance(editProfileModalElem) || new bootstrap.Modal(editProfileModalElem);
        modalInstance.hide();
      }
    });
  }

  // 3. Crear nueva publicación en el portafolio
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