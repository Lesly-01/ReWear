
  document.addEventListener('DOMContentLoaded', function () {
    
    
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

  
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', function () {
        
        const editModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
        editModal.show();
        
        // Opción B: Si prefieres redirigir a una página de configuración, descommenta la siguiente línea:
        // window.location.href = 'edit_profile.html';
      });
    }

    
    const notificationItems = document.querySelectorAll('.dropdown-item');
    notificationItems.forEach(item => {
      item.addEventListener('click', function () {
        // Opcional: remover la insignia roja al interactuar
        const badge = document.querySelector('#notificationsDropdown .bg-danger');
        if (badge) {
          badge.classList.add('d-none');
        }
      });
    });

  });
