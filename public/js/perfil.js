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
      const targetId = profileId || (usuarioSesion ? usuarioSesion.id_usuario : null);

      if (!targetId) {
        console.warn("No profile ID found");
        return;
      }

      const response = await fetch(`../auth/get_profile.php?id=${targetId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        const sessionUserId = usuarioSesion ? usuarioSesion.id_usuario : null;
        const isOwner = (String(sessionUserId) === String(data.id_usuario));

        // 1. Actualizar Username
        const usernameHeader = document.getElementById('profileUsername');
        if (usernameHeader) {
          const nameToDisplay = isOwner && usuarioSesion ? usuarioSesion.nombre : data.nombre;
          usernameHeader.textContent = nameToDisplay && nameToDisplay.startsWith('@') ? nameToDisplay : (nameToDisplay ? `@${nameToDisplay}` : '@Username');
        }

        // 2. Actualizar Foto de Perfil / Avatar de Iniciales
        const profileImg = document.getElementById('profileAvatar');
        if (profileImg) {
          const nameForInitials = isOwner && usuarioSesion ? usuarioSesion.nombre : data.nombre;
          profileImg.src = AvatarManager.getProfileImage(nameForInitials || 'User', data.foto_perfil);
        }

        // 3. Actualizar Bio
        const bioParagraph = document.getElementById('profileBio') || document.querySelector('p.text-muted.extra-small');
        if (bioParagraph) bioParagraph.textContent = data.biografia || 'Looking for unique styles to give clothes a second chance.';
      } else {
        console.error("Error loading profile:", result.message);
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }

  loadProfile();
});