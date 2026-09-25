
// document.addEventListener('DOMContentLoaded', () => {

//     const favButtons = document.querySelectorAll('.btn-fav');
//     favButtons.forEach(button => {

//       const productId = button.getAttribute('data-product-id');
//       const isFav = localStorage.getItem(`fav_${productId}`) === 'true';
//       const icon = button.querySelector('i');

//       if (isFav) {
//         icon.classList.remove('bi-heart');
//         icon.classList.add('bi-heart-fill', 'text-danger');
//       }
//       button.addEventListener('click', function (e) {
//         e.stopPropagation();
//         const currentlyFav = icon.classList.contains('bi-heart-fill');

//         if (currentlyFav) {
//           icon.classList.remove('bi-heart-fill', 'text-danger');
//           icon.classList.add('bi-heart');
//           localStorage.setItem(`fav_${productId}`, 'false');

//         } else {
//           icon.classList.remove('bi-heart');
//           icon.classList.add('bi-heart-fill', 'text-danger');
//           localStorage.setItem(`fav_${productId}`, 'true');
//         }
//       });
//     });
//   });



// const originalCard = document.getElementById('cardToClone');
// const cardsContainer = document.getElementById('cardsContainer');
// const newProducts = [

//   {
//     id: 'product-2',
//     title: 'Embroidered mesh back denim jacket',
//     price: '$25.00',
//     seller: '@ana_dev',
//     imageSrc: 'IMG/jacket.png',
//     link: 'publicaciones.html'
//   },

//   {
//     id: 'product-3',
//     title: 'Punk patchwork pants',
//     price: '$30.00',
//     seller: '@carlos_m',
//     imageSrc: 'IMG/cargo jeans.jpg',
//     link: 'publicaciones.html'
//   },

//   {
//     id: 'product-4',
//     title: 'Custom Mall Goth Grid Shirt with Patchwork',
//     price: '$22.50',
//     seller: '@sofia_trend',
//     imageSrc: 'IMG/graphic tee.jpg',
//     link: 'publicaciones.html'
//   },

//   {
//     id: 'product-5',
//     title: 'High waist skirt',
//     price: '$18.00',
//     seller: '@lucia_style',
//     imageSrc: 'IMG/hih waist skirt.jpg',
//     link: 'publicaciones.html'
//   },

// {
//     id: 'product-6',
//     title: 'Upcycled Sashiko Boro Patchwork Denim Jeans.',
//     price: '$15.00',
//     seller: '@Camila_style',
//     imageSrc: 'IMG/jeans.jpg',
//     link: 'publicaciones.html'
//   },

//   {
//     id: 'product-7',
//     title: 'Vintage style jacket',
//     price: '$18.00',
//     seller: '@lucia_style',
//     imageSrc: 'IMG/hoodie.jpg',
//     link: 'publicaciones.html'

//   },

//   {
//     id: 'product-8',
//     title: 'Falda Jean Tiro Alto',
//     price: '$18.00',
//     seller: '@lucia_style',
//     imageSrc: 'IMG/top.jpg',
//     link: 'publicaciones.html'
//   },
// ];

// newProducts.forEach((product) => {

//   const clone = originalCard.cloneNode(true);
//   clone.removeAttribute('id');
//   clone.querySelector('.product-img').src = product.imageSrc;
//   clone.querySelector('.product-img').alt = product.title;
//   clone.querySelector('.badge').textContent = product.seller;
//   clone.querySelector('.btn-fav').setAttribute('data-product-id', product.id);
//   clone.querySelector('.card-title').textContent = product.title;
//   clone.querySelector('strong').textContent = product.price;
//   clone.querySelector('.btn-rewear-action').href = product.link;
//   cardsContainer.appendChild(clone);
// });


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
    createRequestForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const modalInstance = bootstrap.Modal.getInstance(createRequestModalElem);
      if (modalInstance) {
        modalInstance.hide();
      }

      alert('Your customization request has been published successfully!');
      createRequestForm.reset();
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
              // Ajustamos la ruta según el origen para que sea accesible desde public/clothes_catalog.html
              const photoPath = tailor.foto_perfil.startsWith('uploads/')
                                ? `../${tailor.foto_perfil}`
                                : tailor.foto_perfil;
              img.src = photoPath;
            } else {
              img.src = 'IMG/default_avatar.jpg';
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
            : '★ Nuevo';
        }

        // 4. Nombre
        const nameEl = clone.querySelector('.tailor-name');
        if (nameEl) nameEl.textContent = tailor.nombre;

        // 5. Especialidad / Biografía
        const titleEl = clone.querySelector('.tailor-title');
        if (titleEl) {
          titleEl.textContent = tailor.biografia ? tailor.biografia : 'Diseñador Textil y Upcycling';
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