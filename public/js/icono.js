
document.addEventListener('DOMContentLoaded', () => {
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
  });

// 1. Seleccionar la tarjeta base y el contenedor
const originalCard = document.getElementById('cardToClone');
const cardsContainer = document.getElementById('cardsContainer');

// 2. Arreglo con los datos para las 4 tarjetas nuevas
const newProducts = [
  {
    id: 'product-2',
    title: 'Chaqueta Denim Vintage',
    price: '$35.00',
    seller: '@ana_dev',
    imageSrc: '/img/denim corset.png',
    link: '/publicaciones/publicaciones.html'
  },
  {
    id: 'product-3',
    title: 'Pantalón Cargo Casual',
    price: '$28.00',
    seller: '@carlos_m',
    imageSrc: '/img/denim corset.png',
    link: '/publicaciones/publicaciones.html'
  },
  {
    id: 'product-4',
    title: 'Top Corset Patchwork',
    price: '$22.50',
    seller: '@sofia_trend',
    imageSrc: '/img/denim corset.png',
    link: '/publicaciones/publicaciones.html'
  },
  {
    id: 'product-5',
    title: 'Falda Jean Tiro Alto',
    price: '$18.00',
    seller: '@lucia_style',
    imageSrc: '/img/denim corset.png',
    link: '/publicaciones/publicaciones.html'
  }
];

// 3. Recorrer el arreglo y clonar la tarjeta por cada producto
newProducts.forEach((product) => {
  // Clonar la tarjeta original (con todos sus nodos hijos)
  const clone = originalCard.cloneNode(true);

  // Remover el ID para evitar elementos duplicados con el mismo ID en el DOM
  clone.removeAttribute('id');

  // Actualizar los datos respetando la estructura interna
  clone.querySelector('.product-img').src = product.imageSrc;
  clone.querySelector('.product-img').alt = product.title;
  clone.querySelector('.badge').textContent = product.seller;
  clone.querySelector('.btn-fav').setAttribute('data-product-id', product.id);
  clone.querySelector('.card-title').textContent = product.title;
  clone.querySelector('strong').textContent = product.price;
  clone.querySelector('.btn-rewear-action').href = product.link;

  // Insertar la nueva tarjeta en el contenedor
  cardsContainer.appendChild(clone);
});
  
