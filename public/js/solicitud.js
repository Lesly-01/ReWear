document.addEventListener('DOMContentLoaded', function () {
  const acceptRequestForm = document.getElementById('acceptRequestForm');
  const acceptRequestModalElem = document.getElementById('acceptRequestModal');
  const alertContainer = document.getElementById('alertContainer');

 
  let currentActiveCard = null;


 
  const requestOrdersList = [
    {
      id: 'req-2',
      username: '@sofia_m',
      title: 'Patchwork Denim Jacket',
      tag: 'UPCYCLING',
      method: 'Light denim patchwork',
      garment: 'Vintage Blue Jacket',
      instructions: 'Looking to add light denim patchwork to the back and cuffs with an urban style.',
      priceRange: '$35.00 USD',
      imageSrc: '/public/IMG/jacket.png'
    },
    {
      id: 'req-3',
      username: '@carlos_dev',
      title: 'Vintage Denim Crop Top',
      tag: 'ALTERATION',
      method: 'Cropped fit & frayed hem',
      garment: 'Denim Shirt',
      instructions: 'Cropped fit and frayed hem alteration for a vintage style denim shirt.',
      priceRange: '$28.00 USD',
      imageSrc: '/public/IMG/chaqueta.jpg'
    },
    {
      id: 'req-4',
      username: '@ana_style',
      title: 'Floral Corset Embroidery',
      tag: 'EMBROIDERY',
      method: 'Hand floral stitching',
      garment: 'Upcycled Fabric Corset',
      instructions: 'Custom floral design made with sustainable threads on an upcycled fabric corset.',
      priceRange: '$45.00 USD',
      imageSrc: '/public/IMG/top.jpg'
    }
  ];

  const originalCard = document.getElementById('requestCardToClone');
  const container = document.getElementById('requestsContainer');

  if (originalCard && container) {
    requestOrdersList.forEach((req) => {
      const clone = originalCard.cloneNode(true);
      clone.removeAttribute('id');

      const img = clone.querySelector('.request-img');
      if (img) { img.src = req.imageSrc; img.alt = req.title; }

      const user = clone.querySelector('.request-user');
      if (user) user.innerHTML = `<i class="bi bi-person-circle me-1" style="color: #1b4332;"></i> ${req.username}`;

      const tag = clone.querySelector('.request-tag');
      if (tag) tag.textContent = req.tag;

      const title = clone.querySelector('.request-title');
      if (title) title.textContent = req.title;

      const method = clone.querySelector('.request-method');
      if (method) method.textContent = req.method;

      const garment = clone.querySelector('.request-garment');
      if (garment) garment.textContent = req.garment;

      const instructions = clone.querySelector('.request-instructions');
      if (instructions) instructions.textContent = req.instructions;

      const price = clone.querySelector('.request-price');
      if (price) price.textContent = req.priceRange;

      container.appendChild(clone);
    });
  }

  



  function showAlert(message, type = 'success') {
  if (!alertContainer) return;

  const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
  const alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm" role="alert">
      <i class="bi ${icon} fs-5"></i>
      <div>${message}</div>
      <button type="button" class="btn-close shadow-none" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  alertContainer.innerHTML = alertHTML;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

  




  function disableActionButtons(cardElement) {
    if (!cardElement) return;
    const actionButtons = cardElement.querySelectorAll('button');
    actionButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50');
    });
  }

  
  document.addEventListener('click', function (e) {
    const cardItem = e.target.closest('.request-card-item') || e.target.closest('.col-12');


    if (e.target.classList.contains('decline-btn') || e.target.id === 'declineBtn') {
      const confirmDecline = confirm('Are you sure you want to decline this request?');
      if (confirmDecline) {
        showAlert('The request has been rejected, a notification has been sent to the user.', 'danger');
        disableActionButtons(cardItem);
      }
    }

    
    if (e.target.classList.contains('accept-btn') || e.target.getAttribute('data-bs-target') === '#acceptRequestModal') {
      currentActiveCard = cardItem;
    }
  });





  if (acceptRequestForm) {
    acceptRequestForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const modalInstance = bootstrap.Modal.getInstance(acceptRequestModalElem);
      if (modalInstance) {
        modalInstance.hide();
      }

      showAlert('The request has been accepted, a notification has been sent to the user.', 'success');

      if (currentActiveCard) {
        disableActionButtons(currentActiveCard);
      }
    });
  }
});