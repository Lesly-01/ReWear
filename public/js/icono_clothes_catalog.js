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



const originalCard = document.getElementById('cardToClone');

const cardsContainer = document.getElementById('cardsContainer');

const newProducts = [

  {
    id: 'product-2',

    title: 'Embroidered mesh back denim jacket',

    price: '$25.00',

    seller: '@ana_dev',

    imageSrc: '/public/img/jacket.png',

    link: '/public/publicaciones.html'

  },

  {
    id: 'product-3',

    title: 'Punk patchwork pants',

    price: '$30.00',

    seller: '@carlos_m',

    imageSrc: '/public/img/cargo jeans.jpg',

    link: '/public/publicaciones.html'

  },

  {
    id: 'product-4',

    title: 'Custom Mall Goth Grid Shirt with Patchwork',

    price: '$22.50',

    seller: '@sofia_trend',

    imageSrc: '/public/img/graphic tee.jpg',

    link: '/public/publicaciones.html'

  },

  {
    id: 'product-5',

    title: 'High waist skirt',

    price: '$18.00',

    seller: '@lucia_style',

    imageSrc: '/public/img/hih waist skirt.jpg',

    link: '/public/publicaciones.html'

  },

{
    id: 'product-6',

    title: 'Upcycled Sashiko Boro Patchwork Denim Jeans.',

    price: '$15.00',

    seller: '@Camila_style',

    imageSrc: '/public/img/jeans.jpg',

    link: '/public/publicaciones.html'
  },

  {
    id: 'product-7',

    title: 'Vintage style jacket',

    price: '$18.00',

    seller: '@lucia_style',

    imageSrc: '/public/img/hoodie.jpg',

    link: '/public/publicaciones.html'

  },

  {
    id: 'product-8',

    title: 'Falda Jean Tiro Alto',

    price: '$18.00',

    seller: '@lucia_style',

    imageSrc: '/public/img/top.jpg',

    link: '/public/publicaciones.html'

  },
];

newProducts.forEach((product) => {

  const clone = originalCard.cloneNode(true);

  clone.removeAttribute('id');


  clone.querySelector('.product-img').src = product.imageSrc;

  clone.querySelector('.product-img').alt = product.title;

  clone.querySelector('.badge').textContent = product.seller;

  clone.querySelector('.btn-fav').setAttribute('data-product-id', product.id);

  clone.querySelector('.card-title').textContent = product.title;

  clone.querySelector('strong').textContent = product.price;

  clone.querySelector('.btn-rewear-action').href = product.link;

  cardsContainer.appendChild(clone);

});


// tarjetas de tailors
const originalTailorCard = document.getElementById('tailorCardToClone');
const tailorsContainer = document.getElementById('tailorsContainer');


const tailorsList = [
  {
    id: 'tailor-2',
    name: 'Carlos Mendoza',
    title: 'Streetwear & Denim Specialist',
    location: 'Santa Ana',
    rating: '★ 4.8 (15)',
    responseTime: '< 2 hours',
    specialties: ['Streetwear', 'Parches', 'Chaquetas'],
    imageSrc: '/public/IMG/chaqueta.jpg',
    profileLink: '/public/perfildiseñador.html'
  },
  {
    id: 'tailor-3',
    name: 'Sofía Trenes',
    title: 'Goth & Alternative Fashion',
    location: 'San Salvador',
    rating: '★ 5.0 (42)',
    responseTime: '< 30 mins',
    specialties: ['Goth', 'Pantalones', 'Custom'],
    imageSrc: '/public/IMG/cargo jeans.jpg',
    profileLink: '/public/perfildiseñador.html'
  },
  {
    id: 'tailor-4',
    name: 'Lucía Fernández',
    title: 'Formal Upcycling & Alterations',
    location: 'La Libertad',
    rating: '★ 4.7 (19)',
    responseTime: '< 4 hours',
    specialties: ['Vestidos', 'Faldas', 'Ajustes'],
    imageSrc: '/public/IMG/graphic tee.jpg',
    profileLink: '/public/perfildiseñador.html'
  }
];

if (originalTailorCard && tailorsContainer) {
  tailorsList.forEach((tailor) => {
    
    const clone = originalTailorCard.cloneNode(true);
    clone.removeAttribute('id');

    
    const img = clone.querySelector('.tailor-img');
    if (img) {
      img.src = tailor.imageSrc;
      img.alt = `${tailor.name} Tailor`;
    }

    const loc = clone.querySelector('.tailor-location');
    if (loc) loc.textContent = tailor.location;

    const rate = clone.querySelector('.tailor-rating');
    if (rate) rate.textContent = tailor.rating;

    const name = clone.querySelector('.tailor-name');
    if (name) name.textContent = tailor.name;

    const title = clone.querySelector('.tailor-title');
    if (title) title.textContent = tailor.title;

    const time = clone.querySelector('.tailor-time');
    if (time) time.textContent = tailor.responseTime;

    const link = clone.querySelector('.tailor-link');
    if (link) link.href = tailor.profileLink;

  
    const tagsContainer = clone.querySelector('.tailor-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = tailor.specialties
        .map(tag => `<span class="badge bg-light text-secondary border extra-small font-normal">${tag}</span>`)
        .join('');
    }

    
    tailorsContainer.appendChild(clone);
  });
}


// =========================================================
// ARRAY DE DATOS: LOCAL TAILORS & ARTISANS
// =========================================================
const newTailors = [
  {
    id: 'tailor-2',
    name: 'Carlos Mendoza',
    title: 'Streetwear & Denim Specialist',
    location: 'Santa Ana',
    rating: '★ 4.8 (15)',
    responseTime: '< 2 hours',
    specialties: ['Streetwear', 'Parches', 'Chaquetas'],
    imageSrc: '/public/IMG/diseñador foto perfil.jpg', // Ajusta según tu ruta de imágenes
    link: '/public/perfildiseñador.html'
  },
  {
    id: 'tailor-3',
    name: 'Sofía Trenes',
    title: 'Goth & Alternative Fashion',
    location: 'San Salvador',
    rating: '★ 5.0 (42)',
    responseTime: '< 30 mins',
    specialties: ['Goth', 'Pantalones', 'Custom'],
    imageSrc: '/public/IMG/diseñador foto perfil.jpg',
    link: '/public/perfildiseñador.html'
  },
  {
    id: 'tailor-4',
    name: 'Lucía Fernández',
    title: 'Formal Upcycling & Alterations',
    location: 'La Libertad',
    rating: '★ 4.7 (19)',
    responseTime: '< 4 hours',
    specialties: ['Vestidos', 'Faldas', 'Ajustes'],
    imageSrc: '/public/IMG/diseñador foto perfil.jpg',
    link: '/public/perfildiseñador.html'
  }
];




document.addEventListener('DOMContentLoaded', () => {
  const tailorCardToClone = document.getElementById('tailorCardToClone');
  const tailorsContainer = document.getElementById('tailorsContainer');

  if (tailorCardToClone && tailorsContainer) {
    newTailors.forEach((tailor) => {
      
      const clone = tailorCardToClone.cloneNode(true);
      
      clone.removeAttribute('id');

      
      const img = clone.querySelector('.card-img-top, img');
      if (img) {
        img.src = tailor.imageSrc;
        img.alt = `${tailor.name} Tailor`;
      }

      
      const locationBadge = clone.querySelector('.tailor-location');
      if (locationBadge) locationBadge.textContent = tailor.location;

      const ratingBadge = clone.querySelector('.tailor-rating');
      if (ratingBadge) ratingBadge.textContent = tailor.rating;

      const nameEl = clone.querySelector('.card-title, .tailor-name');
      if (nameEl) nameEl.textContent = tailor.name;

      const titleEl = clone.querySelector('.tailor-title');
      if (titleEl) titleEl.textContent = tailor.title;

     
      const tagsContainer = clone.querySelector('.tailor-tags');
      if (tagsContainer) {
        tagsContainer.innerHTML = tailor.specialties
          .map(tag => `<span class="badge bg-light text-secondary border extra-small font-normal">${tag}</span>`)
          .join(' ');
      }

      
      const timeEl = clone.querySelector('.tailor-time');
      if (timeEl) timeEl.textContent = tailor.responseTime;

      const profileLink = clone.querySelector('a.stretched-link, .tailor-link');
      if (profileLink) profileLink.href = tailor.link;

      
      tailorsContainer.appendChild(clone);
    });
  }
});

const createRequestForm = document.getElementById('createRequestForm');
  const createRequestModalElem = document.getElementById('createRequestModal');

  if (createRequestForm) {
    createRequestForm.addEventListener('submit', function (e) {
      e.preventDefault();

      
      const modalInstance = bootstrap.Modal.getInstance(createRequestModalElem);
      if (modalInstance) {
        modalInstance.hide();
      }

      
      showAlert('Your customization request has been published successfully!', 'success');

      createRequestForm.reset();
    });
  }