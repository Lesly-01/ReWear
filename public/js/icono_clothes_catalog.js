async function loadTailorsFromDatabase() {
  console.log("--> Iniciando carga de artesanos...");
  // ... resto del código ...
}

document.addEventListener('DOMContentLoaded', () => {
  // Cargar diseñadores desde la base de datos
  loadTailorsFromDatabase();

  // Gestión del formulario de solicitudes
const createRequestForm = document.getElementById('createRequestForm');
const createRequestModalElem = document.getElementById('createRequestModal');

if (createRequestForm) {
  createRequestForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Crear objeto FormData para incluir los archivos e inputs del formulario
    const formData = new FormData(createRequestForm);

    try {
      // Ajusta la ruta si tu archivo PHP se encuentra en 'solicitudes/solicitudes.php' o similar
      const response = await fetch('../solicitudes/create.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Cerrar el modal de Bootstrap si la inserción fue exitosa
        const modalInstance = bootstrap.Modal.getInstance(createRequestModalElem);
        if (modalInstance) {
          modalInstance.hide();
        }

        alert('Your customization request has been published successfully!');
        createRequestForm.reset();
      } else {
        alert('Error publishing request: ' + result.message);
      }
    } catch (error) {
      console.error('Error enviando la solicitud:', error);
      alert('An error occurred while sending your request. Please try again.');
    }
  });
}
});

/**
 * Función para consultar la base de datos e inyectar las tarjetas
 */
async function loadTailorsFromDatabase() {
  const tailorsContainer = document.getElementById('tailorsContainer');
  const template = document.getElementById('tailorCardTemplate');

  if (!tailorsContainer || !template) return;

  try {
    // Petición al backend PHP
    const response = await fetch('../backend/get_designers.php'); // Ajusta esta ruta si tu PHP está en otra carpeta
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      tailorsContainer.innerHTML = ''; // Limpiar contenedor por seguridad

      result.data.forEach(tailor => {
        const clone = template.content.cloneNode(true);

        
        // 1. Imagen de Perfil
           const img = clone.querySelector('.tailor-img');
  if (img) {
      if (tailor.foto_perfil && tailor.foto_perfil.trim() !== '') {
          const photoPath = tailor.foto_perfil.startsWith('uploads/')
                            ? `../${tailor.foto_perfil}`
                            : tailor.foto_perfil;
          img.src = photoPath;
      } else {
          img.src = AvatarManager.getProfileImage(tailor.nombre, null);
      }
      img.alt = `Foto de ${tailor.nombre}`;
  }

          
        // 2. Ubicación (San Salvador como valor por defecto si no está en BD)
        const locationBadge = clone.querySelector('.tailor-location');
        if (locationBadge) {
          locationBadge.textContent = 'El Salvador';
        }

        // 3. Calificación y promedio
        const ratingBadge = clone.querySelector('.tailor-rating');
        if (ratingBadge) {
          const promedio = parseFloat(tailor.promedio_calificacion).toFixed(1);
          ratingBadge.textContent = tailor.total_resenas > 0 
            ? `★ ${promedio} (${tailor.total_resenas})` 
            : '★ New';
        }

        // 4. Nombre
        const nameEl = clone.querySelector('.tailor-name');
        if (nameEl) nameEl.textContent = tailor.nombre;

        // 5. Especialidad / Biografía
        const titleEl = clone.querySelector('.tailor-title');
        if (titleEl) {
          titleEl.textContent = tailor.biografia ? tailor.biografia : 'Upcycling and textil designer';
        }

        // 6. Etiquetas de Técnicas
        const tagsContainer = clone.querySelector('.tailor-tags');
        if (tagsContainer) {
          tagsContainer.innerHTML = '';
          if (tailor.tecnicas) {
            const listaTecnicas = tailor.tecnicas.split(',');
            listaTecnicas.forEach(tecnica => {
              const span = document.createElement('span');
              span.className = 'badge bg-light text-secondary border extra-small font-normal';
              span.textContent = tecnica.trim();
              tagsContainer.appendChild(span);
            });
          } else {
            tagsContainer.innerHTML = '<span class="badge bg-light text-secondary border extra-small font-normal">Upcycling</span>';
          }
        }

        // 7. Enlace hacia el perfil con ID del diseñador
        const profileLink = clone.querySelector('.tailor-link');
        if (profileLink) {
          profileLink.href = `perfildiseñador.html?id=${tailor.id_usuario}`;
        }

        tailorsContainer.appendChild(clone);
      });
    } else {
      tailorsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted">No se encontraron diseñadores registrados aún.</p>
        </div>`;
    }
  } catch (error) {
    console.error('Error cargando los diseñadores:', error);
    tailorsContainer.innerHTML = `
      <div class="col-12 text-center py-4">
        <p class="text-danger small">No se pudieron cargar los diseñadores.</p>
      </div>`;
  }
}

// Carga inmediata al iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadTailorsFromDatabase();

  // Escuchar el clic directamente en el botón de la pestaña
  const tailorsTabBtn = document.querySelector('button[data-bs-target="#tailors-content"], [href="#tailors-content"]');
  if (tailorsTabBtn) {
    tailorsTabBtn.addEventListener('click', () => {
      loadTailorsFromDatabase();
    });
  }
});

