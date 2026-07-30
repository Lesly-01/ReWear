
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