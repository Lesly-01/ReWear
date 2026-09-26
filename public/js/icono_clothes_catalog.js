/**
 * Gestión de Catálogo de Ropa y Diseñadores
 */

document.addEventListener('DOMContentLoaded', () => {
    // Gestión de favoritos
    const favButtons = document.querySelectorAll('.btn-fav');
    favButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');
        const isFav = localStorage.getItem(`fav_${productId}`) === 'true';
        const icon = button.querySelector('i');

        if (isFav) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
        }

        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const currentlyFav = icon.classList.contains('bi-heart-fill');
            if (currentlyFav) {
                icon.classList.remove('bi-heart-fill', 'text-danger');
                icon.classList.add('bi-heart');
                localStorage.setItem(`fav_${productId}`, 'false');
            } else {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill', 'text-danger');
                localStorage.setItem(`fav_${productId}`, 'true');
            }
        });
    });

    // Cargar diseñadores desde la base de datos
    loadTailorsFromDatabase();

    // Gestión del formulario de solicitudes
    const createRequestForm = document.getElementById('createRequestForm');
    const createRequestModalElem = document.getElementById('createRequestModal');

    if (createRequestForm) {
        createRequestForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const modalInstance = bootstrap.Modal.getInstance(createRequestModalElem);
            if (modalInstance) modalInstance.hide();
            alert('Your customization request has been published successfully!');
            createRequestForm.reset();
        });
    }
});

async function loadTailorsFromDatabase() {
    const tailorsContainer = document.getElementById('tailorsContainer');
    const template = document.getElementById('tailorCardTemplate');

    if (!tailorsContainer || !template) return;

    try {
        const response = await fetch('../backend/get_designers.php');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            tailorsContainer.innerHTML = '';

            result.data.forEach(tailor => {
                const clone = template.content.cloneNode(true);

                const img = clone.querySelector('.tailor-img');
                if (img) {
                    // USO DEL AVATAR MANAGER UNIFICADO
                    img.src = AvatarManager.getProfileImage(tailor.nombre, tailor.foto_perfil);
                    img.alt = `Foto de ${tailor.nombre}`;
                }

                const locationBadge = clone.querySelector('.tailor-location');
                if (locationBadge) locationBadge.textContent = 'El Salvador';

                const ratingBadge = clone.querySelector('.tailor-rating');
                if (ratingBadge) {
                    const promedio = parseFloat(tailor.promedio_calificacion || 0).toFixed(1);
                    ratingBadge.textContent = tailor.total_resenas > 0
                        ? `★ ${promedio} (${tailor.total_resenas})`
                        : '★ Nuevo';
                }

                const nameEl = clone.querySelector('.tailor-name');
                if (nameEl) nameEl.textContent = tailor.nombre;

                const titleEl = clone.querySelector('.tailor-title');
                if (titleEl) {
                    titleEl.textContent = tailor.biografia ? tailor.biografia : 'Diseñador Textil y Upcycling';
                }

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

                const profileLink = clone.querySelector('.tailor-link');
                if (profileLink) {
                    profileLink.href = `perfildiseñador.html?id=${tailor.id_usuario}`;
                }

                tailorsContainer.appendChild(clone);
            });
        } else {
            tailorsContainer.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No se encontraron diseñadores registrados aún.</p></div>`;
        }
    } catch (error) {
        console.error('Error cargando los diseñadores:', error);
        tailorsContainer.innerHTML = `<div class="col-12 text-center py-4"><p class="text-danger small">No se pudieron cargar los diseñadores.</p></div>`;
    }
}
