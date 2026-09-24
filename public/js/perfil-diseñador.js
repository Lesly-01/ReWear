document.addEventListener('DOMContentLoaded', async function () {
  let usuarioSesion = null;

  try {
    usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion')) || JSON.parse(localStorage.getItem('usuariosesion'));
  } catch (e) {
    console.error("Error loading session:", e);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get('id');

  async function loadProfile() {
    try {
      // Si hay un ID en la URL, cargamos ese perfil. Si no, cargamos el de la sesión.
      const targetId = profileId || (usuarioSesion ? usuarioSesion.id_usuario : null);

      if (!targetId) {
        console.warn("No profile ID found");
        return;
      }

      const response = await fetch(`../auth/get_profile.php?id=${targetId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;

        // 1. Actualizar Username (SÓLO desde la DB, evita sobreescribir con la sesión)
        const usernameHeader = document.getElementById('profileUsername');
        if (usernameHeader) {
          usernameHeader.textContent = data.nombre.startsWith('@') ? data.nombre : `@${data.nombre}`;
        }

        // 2. Actualizar Bio y Especialidad
        const bioParagraph = document.querySelector('p.text-muted.extra-small');
        if (bioParagraph) bioParagraph.textContent = data.biografia || 'No bio provided.';

        const specialtyBadge = document.querySelector('.badge.rounded-pill.text-dark.border');
        if (specialtyBadge) specialtyBadge.textContent = data.biografia || 'Sustainable Fashion Designer';

        // 3. CONTROL DE VISIBILIDAD (Is Owner?)
        const sessionUserId = usuarioSesion ? usuarioSesion.id_usuario : null;
        const isOwner = (String(sessionUserId) === String(data.id_usuario));

        if (!isOwner) {
          // Ocultar elementos privados si NO es el dueño
          const editSection = document.getElementById('editProfileSection');
          if (editSection) editSection.style.display = 'none';

          const notifySection = document.getElementById('notificationsSection');
          if (notifySection) notifySection.style.display = 'none';

          const addPostBtn = document.getElementById('btn-add-post');
          if (addPostBtn) addPostBtn.style.display = 'none';

          // Ocultar solo el badge de notificación de órdenes, mantener la sección visible
          const ordersSection = document.getElementById('recent-orders-section');
          if (ordersSection) {
            const pendingBadge = ordersSection.querySelector('.badge.bg-danger');
            if (pendingBadge) pendingBadge.style.display = 'none';
          }
        }

      } else {
        console.error("Error loading profile:", result.message);
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }

  // Ejecutar carga
  loadProfile();

  // Mantener la lógica de cerrar sesión
  window.cerrarSesion = function() {
      localStorage.removeItem('usuarioSesion');
      window.location.href = 'login.html';
  };
});