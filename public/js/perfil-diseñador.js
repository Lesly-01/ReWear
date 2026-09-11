document.addEventListener('DOMContentLoaded', function () {

 
  const notificationItems = document.querySelectorAll('.dropdown-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', function () {
      const badge = document.querySelector('#notificationsDropdown .bg-danger');
      if (badge) {
        badge.classList.add('d-none');
      }
    });
  });

  
  const createPostForm = document.getElementById('createPostForm');
  const portfolioContainer = document.getElementById('portfolioShowcaseContainer');
  const newPostModalElem = document.getElementById('newPostModal');

  if (createPostForm && portfolioContainer) {
    createPostForm.addEventListener('submit', function (e) {
      e.preventDefault();

      
      const imgPath = document.getElementById('postImg')?.value || '/public/IMG/denim corset.png';
      const title = document.getElementById('postTitle')?.value || 'New Design';
      const minPrice = document.getElementById('postMinPrice')?.value || '0';

      
      const newDesignCol = document.createElement('div');
      newDesignCol.className = 'col-6 col-sm-3';
      newDesignCol.innerHTML = `
        <div class="rounded-3 bg-light p-2 text-center h-100 d-flex flex-column justify-content-between">
          <img src="${imgPath}" class="img-fluid rounded-3 mb-2" style="height: 80px; width: 100%; object-fit: cover;" alt="${title}">
          <div>
            <span class="d-block text-truncate extra-small fw-semibold text-dark">${title}</span>
            <span class="text-success extra-small fw-bold">$${minPrice}</span>
          </div>
        </div>
      `;

    
      portfolioContainer.prepend(newDesignCol);

      if (newPostModalElem) {
        const dismissBtn = newPostModalElem.querySelector('[data-bs-dismiss="modal"]');
        if (dismissBtn) {
          dismissBtn.click();
        }
      }

      
      createPostForm.reset();
    });
  }

});