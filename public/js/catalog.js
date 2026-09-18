// este es solo de las tarjetas clonadas de clothes_catalog.html que llena el diseñador en add portfolio project

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

async function cargarDatos() {
    try {
        const response = await fetch('../prendas/read.php');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            renderizarTarjetas(result.data);
        } else {
            console.error('Error desde el servidor:', result.message);
        }
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
    }
}

function renderizarTarjetas(productos) {
    const cardsContainer = document.getElementById('cardsContainer');
    const originalCard = document.getElementById('cardToClone');

    if (!cardsContainer || !originalCard) return;

    cardsContainer.innerHTML = '';

    if (productos.length === 0) {
        cardsContainer.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No hay publicaciones disponibles por el momento.</p></div>`;
        return;
    }

    productos.forEach(product => {
        const clone = originalCard.cloneNode(true);
        clone.removeAttribute('id');
        clone.classList.remove('d-none'); 

        const img = clone.querySelector('.product-img');
        if (img) {
            img.src = product.imagen_url;
            img.alt = product.titulo;
        }

        const badge = clone.querySelector('.badge');
        if (badge) badge.textContent = `@${product.disenador}`;

        const favBtn = clone.querySelector('.btn-fav');
        if (favBtn) favBtn.setAttribute('data-product-id', `product-${product.id_prenda}`);

        const title = clone.querySelector('.card-title');
        if (title) title.textContent = product.titulo;

        const priceTag = clone.querySelector('strong');
        if (priceTag) priceTag.textContent = `$${parseFloat(product.precio_minimo).toFixed(2)}`;

        const actionLink = clone.querySelector('.btn-rewear-action');
        if (actionLink) actionLink.href = `publicaciones.html?id=${product.id_prenda}`;

        cardsContainer.appendChild(clone);
    });

    inicializarFavoritos();
}

function inicializarFavoritos() {
    const favButtons = document.querySelectorAll('.btn-fav');

    favButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');
        const isFav = localStorage.getItem(`fav_${productId}`) === 'true';
        const icon = button.querySelector('i');

        if (isFav && icon) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
        }

        button.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!icon) return;

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
}