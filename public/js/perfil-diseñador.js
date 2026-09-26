document.addEventListener('DOMContentLoaded', async function () {
  let usuarioSesion = null;

  try {
    // Soporte para ambas posibles claves de sesión
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

        // CONTROL DE VISIBILIDAD (Is Owner?)
        const sessionUserId = usuarioSesion ? usuarioSesion.id_usuario : null;
        const isOwner = (String(sessionUserId) === String(data.id_usuario));

        // 1. Actualizar Username
        const usernameHeader = document.getElementById('profileUsername');
        if (usernameHeader) {
          // Priorizar nombre de sesión si es el dueño
          const nameToDisplay = isOwner && usuarioSesion ? usuarioSesion.nombre : data.nombre;
          usernameHeader.textContent = nameToDisplay && nameToDisplay.startsWith('@') ? nameToDisplay : (nameToDisplay ? `@${nameToDisplay}` : '@Username');
        }

        // 2. Actualizar Foto de Perfil / Avatar de Iniciales
        // CORRECCIÓN: Usamos 'profileAvatar' que es el ID real en el HTML
        const profileImg = document.getElementById('profileAvatar');
        if (profileImg) {
          // Verificamos si existe la foto en los datos (aunque en la DB actual no exista, dejamos el código listo)
          if (data.foto_perfil && data.foto_perfil.trim() !== '') {
            const photoPath = data.foto_perfil.startsWith('uploads/')
                                ? `../${data.foto_perfil}`
                                : data.foto_perfil;
            profileImg.src = photoPath;
            profileImg.classList.remove('avatar-initials');
          } else {
            // Si no hay foto, generamos el avatar de iniciales
            const nameForInitials = isOwner && usuarioSesion ? usuarioSesion.nombre : data.nombre;
            profileImg.src = generateInitialsAvatar(nameForInitials || 'User');
            profileImg.classList.add('avatar-initials');
          }
        }

        // 3. Actualizar Bio y Especialidad
        const bioParagraph = document.querySelector('p.text-muted.extra-small');
        if (bioParagraph) bioParagraph.textContent = data.biografia || 'No bio provided.';

        const specialtyBadge = document.querySelector('.badge.rounded-pill.text-dark.border');
        if (specialtyBadge) specialtyBadge.textContent = data.biografia || 'Sustainable Fashion Designer';

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

  /**
   * Genera un avatar basado en iniciales usando un Canvas y lo convierte a Base64
   */
  function generateInitialsAvatar(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Colores sugeridos basados en el nombre para que sean consistentes
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFB833', '#33FFF3', '#1b4332'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    // Fondo
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.fill();

    // Texto (Iniciales)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    ctx.fillText(initials, 50, 50);

    return canvas.toDataURL();
  }

  // Mantener la lógica de cerrar sesión
  window.cerrarSesion = function() {
      localStorage.removeItem('usuarioSesion');
      localStorage.removeItem('usuariosesion');
      window.location.href = 'login.html';
  };
});