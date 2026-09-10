document.addEventListener('DOMContentLoaded', () => {

  // 1. CUSTOMIZATION REQUESTS 
  
  const requestsData = [
    {
      image: "/public/IMG/request-1.jpg",
      user: "@sofia_m",
      status: "Open",
      category: "UPCYCLING",
      timeLeft: "3 days left",
      title: "Patchwork Denim Jacket Customization",
      description: "Looking to add light denim patchwork to the back and cuffs with an urban style.",
      budget: "$35.00 USD",
      link: "/public/solicitudes.html?id=1"
      
      
    },
    {
      image: "/public/IMG/request-2.jpg",
      user: "@carlos_dev",
      status: "Open",
      category: "ALTERATION",
      timeLeft: "5 days left",
      title: "Vintage Denim Crop Top",
      description: "Cropped fit and frayed hem alteration for a vintage denim shirt.",
      budget: "$28.00 USD",
      link: "/public/solicitudes.html?id=1"

    },
    {
      image: "/public/IMG/request-3.jpg",
      user: "@ana_style",
      status: "Open",
      category: "EMBROIDERY",
      timeLeft: "1 day left",
      title: "Floral Corset Embroidery",
      description: "Custom floral design made with sustainable threads on an upcycled fabric corset.",
      budget: "$45.00 USD",
      link: "/public/solicitudes.html?id=1"
    },
    {
      image: "/public/IMG/request-4.jpg",
      user: "@luis_design",
      status: "Open",
      category: "CUSTOM FIT",
      timeLeft: "4 days left",
      title: "Punk Patchwork Pants Modification",
      description: "Adding metallic zippers, studs, and recycled fabric patches to black denim.",
      budget: "$40.00 USD",
      link: "/public/solicitudes.html?id=1"
    }
  ];

  function renderCustomizationCards(requests) {
    const container = document.getElementById("customization-requests-container");
    if (!container) return;

    container.innerHTML = requests.map(item => `
      <div class="col-12 col-md-6 col-lg-3 col-xl-3">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div class="position-relative" style="height: 190px;">
            <img src="${item.image}" class="w-100 h-100 object-fit-cover" alt="${item.title}">
            <span class="badge bg-white text-dark rounded-pill px-3 py-2 position-absolute top-0 start-0 m-3 shadow-sm d-flex align-items-center gap-1">
              <i class="bi bi-person-circle text-muted"></i> ${item.user}
            </span>
            <span class="badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm" style="background-color: #c6e876; color: #1b4332;">
              ${item.status}
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge rounded-pill px-2 py-1 fw-semibold" style="background-color: #e8f5e9; color: #1b4332;">
                ${item.category}
              </span>
              <small class="text-muted"><i class="bi bi-clock me-1"></i>${item.timeLeft}</small>
            </div>

            <h6 class="fw-bold mb-1 text-truncate" style="color: #022522;">${item.title}</h6>
            <p class="text-muted small mb-3 text-truncate-2" style="font-size: 0.85rem; line-height: 1.3;">
              ${item.description}
            </p>

            <div class="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
              <div>
                <span class="d-block text-muted text-uppercase fw-semibold" style="font-size: 0.65rem;">MAX BUDGET</span>
                <span class="fw-bold fs-6" style="color: #1b4332;">${item.budget}</span>
              </div>

              <a href="${item.link}" class="btn btn-sm px-3 py-2 rounded-3 fw-semibold text-white border-0 text-decoration-none" style="background-color: #1b4332; font-size: 0.8rem;">
                Apply / Review
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }


  
  // 2. ACTIVE ORDERS
  
  const activeOrdersData = [
    {
      image: "/public/IMG/denim corset.png",
      status: "In Progress",
      statusBg: "#c6e876",
      statusColor: "#1b4332",
      date: "Due: Oct 12",
      username: "@sofia_m",
      title: "Patchwork Customization",
      description: "Denim jacket - Sleeve adjustments & back patchwork inserts.",
      priceLabel: "Agreed Price:",
      price: "$40.00 USD"
    },
    {
      image: "/public/IMG/request-3.jpg",
      status: "In Review",
      statusClass: "bg-info-subtle text-info-emphasis",
      date: "Due: Oct 15",
      username: "@ana_style",
      title: "Floral Corset Embroidery",
      description: "Final fitting pictures sent to client for approval.",
      priceLabel: "Agreed Price:",
      price: "$45.00 USD"
    },
    {
      image: "/public/IMG/request-4.jpg",
      status: "Completed",
      statusClass: "bg-success-subtle text-success-emphasis",
      date: "Oct 01",
      username: "@luis_design",
      title: "Punk Pants Modification",
      description: "Order delivered successfully. Payment released.",
      priceLabel: "Total Earned:",
      price: "$40.00 USD"
    }
  ];

  function renderActiveOrders(orders) {
    const container = document.getElementById('orders-container');
    if (!container) return;

    container.innerHTML = orders.map(order => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div class="position-relative" style="height: 190px;">
            <img src="${order.image}" class="w-100 h-100 object-fit-cover" alt="${order.title}">
            
            ${order.statusBg 
              ? `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style="background-color: ${order.statusBg}; color: ${order.statusColor};">${order.status}</span>`
              : `<span class="badge ${order.statusClass} position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">${order.status}</span>`}
            
            <span class="badge bg-white text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill shadow-sm small">
              ${order.date}
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-person-circle text-muted"></i>
              <span class="fw-semibold text-dark small">${order.username}</span>
            </div>

            <h6 class="fw-bold mb-1 text-truncate" style="color: #022522;">${order.title}</h6>
            <p class="text-muted small mb-3 text-truncate-2" style="font-size: 0.82rem; line-height: 1.3;">
              ${order.description}
            </p>

            <div class="p-2 rounded-3 mb-3 bg-light d-flex justify-content-between align-items-center">
              <span class="text-muted" style="font-size: 0.75rem;">${order.priceLabel}</span>
              <span class="fw-bold" style="color: #1b4332; font-size: 0.9rem;">${order.price}</span>
            </div>

              <button class="btn btn-sm flex-fill rounded-3 fw-semibold text-white px-1 btn-update-status" data-id="${order.id}" style="background-color: #1b4332; font-size: 0.78rem;">
              Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  
  renderCustomizationCards(requestsData);
  renderActiveOrders(activeOrdersData);

});



// actualización del estado de las ordenes 
document.addEventListener('DOMContentLoaded', () => {

  // 1. Datos con ID explícito
  const activeOrdersData = [
    {
      id: 1,
      image: "/public/IMG/denim corset.png",
      status: "In Progress",
      statusBg: "#c6e876",
      statusColor: "#1b4332",
      date: "Due: Oct 12",
      username: "@sofia_m",
      title: "Patchwork Customization",
      description: "Denim jacket - Sleeve adjustments & back patchwork inserts.",
      priceLabel: "Agreed Price:",
      price: "$40.00 USD"
    },
    {
      id: 2,
      image: "/public/IMG/request-3.jpg",
      status: "In Review",
      statusClass: "bg-info-subtle text-info-emphasis",
      date: "Due: Oct 15",
      username: "@ana_style",
      title: "Floral Corset Embroidery",
      description: "Final fitting pictures sent to client for approval.",
      priceLabel: "Agreed Price:",
      price: "$45.00 USD"
    },
    {
      id: 3,
      image: "/public/IMG/request-4.jpg",
      status: "Completed",
      statusClass: "bg-success-subtle text-success-emphasis",
      date: "Oct 01",
      username: "@luis_design",
      title: "Punk Pants Modification",
      description: "Order delivered successfully. Payment released.",
      priceLabel: "Total Earned:",
      price: "$40.00 USD"
    }
  ];

  // 2. Función de renderizado de tarjetas
  function renderActiveOrders(orders) {
    const container = document.getElementById('orders-container');
    if (!container) return;

    container.innerHTML = orders.map(order => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div class="position-relative" style="height: 190px;">
            <img src="${order.image}" class="w-100 h-100 object-fit-cover" alt="${order.title}">
            
            ${order.statusBg 
              ? `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style="background-color: ${order.statusBg}; color: ${order.statusColor};">${order.status}</span>`
              : `<span class="badge ${order.statusClass} position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">${order.status}</span>`}
            
            <span class="badge bg-white text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill shadow-sm small">
              ${order.date}
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-person-circle text-muted"></i>
              <span class="fw-semibold text-dark small">${order.username}</span>
            </div>

            <h6 class="fw-bold mb-1 text-truncate" style="color: #022522;">${order.title}</h6>
            <p class="text-muted small mb-3 text-truncate-2" style="font-size: 0.82rem; line-height: 1.3;">
              ${order.description}
            </p>

            <div class="p-2 rounded-3 mb-3 bg-light d-flex justify-content-between align-items-center">
              <span class="text-muted" style="font-size: 0.75rem;">${order.priceLabel}</span>
              <span class="fw-bold" style="color: #1b4332; font-size: 0.9rem;">${order.price}</span>
            </div>

            <div class="mt-auto pt-2">
              
              <button class="btn btn-sm flex-fill rounded-3 fw-semibold text-white px-1 btn-update-status" data-id="${order.id}" data-bs-toggle="modal" data-bs-target="#updateStatusModal"style="background-color: #1b4332; font-size: 0.78rem;">
                Update Status
              </button>

            </div>
          </div>
        </div>
      </div>
    `).join('');


    document.querySelectorAll('.btn-update-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-id');
        const selectedOrder = activeOrdersData.find(o => o.id == orderId);
        
        if (selectedOrder) {
          // Actualiza el texto de usuario en la descripción del modal
          const userElement = document.getElementById('modalTargetUser');
          if (userElement) userElement.textContent = selectedOrder.username;
        }
      });
    });
  }

  
  // 1. Función de renderizado con los listeners integrados
function renderActiveOrders(orders) {
  const container = document.getElementById('orders-container');
  if (!container) return;

  container.innerHTML = orders.map(order => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div class="position-relative" style="height: 190px;">
          <img src="${order.image}" class="w-100 h-100 object-fit-cover" alt="${order.title}">
          
          ${order.statusBg 
            ? `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style="background-color: ${order.statusBg}; color: ${order.statusColor};">${order.status}</span>`
            : `<span class="badge ${order.statusClass} position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">${order.status}</span>`}
          
          <span class="badge bg-white text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill shadow-sm small">
            ${order.date}
          </span>
        </div>

        <div class="card-body p-3 d-flex flex-column">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-person-circle text-muted"></i>
            <span class="fw-semibold text-dark small">${order.username}</span>
          </div>

          <h6 class="fw-bold mb-1 text-truncate" style="color: #022522;">${order.title}</h6>
          <p class="text-muted small mb-3 text-truncate-2" style="font-size: 0.82rem; line-height: 1.3;">
            ${order.description}
          </p>

          <div class="p-2 rounded-3 mb-3 bg-light d-flex justify-content-between align-items-center">
            <span class="text-muted" style="font-size: 0.75rem;">${order.priceLabel}</span>
            <span class="fw-bold" style="color: #1b4332; font-size: 0.9rem;">${order.price}</span>
          </div>

          <button type="button" 
                  class="btn btn-sm flex-fill rounded-3 fw-semibold text-white px-1 btn-update-status" 
                  data-id="${order.id}" 
                  data-bs-toggle="modal" 
                  data-bs-target="#updateStatusModal" 
                  style="background-color: #1b4332; font-size: 0.78rem;">
            Update Status
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // editar el estado
  container.querySelectorAll('.btn-update-status').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = e.currentTarget.getAttribute('data-id');
      const selectedOrder = activeOrdersData.find(o => o.id == orderId);

      if (selectedOrder) {
        document.getElementById('orderIdInput').value = selectedOrder.id;
        document.getElementById('modalTargetUser').textContent = selectedOrder.username;
        document.getElementById('modalOrderTitle').textContent = selectedOrder.title;
        document.getElementById('statusSelect').value = selectedOrder.status;
      }
    });
  });
}


const updateStatusForm = document.getElementById('updateStatusForm');

if (updateStatusForm) {
  updateStatusForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const orderId = document.getElementById('orderIdInput').value;
    const newStatus = document.getElementById('statusSelect').value;

    const order = activeOrdersData.find(o => o.id == orderId);

    if (order) {
      order.status = newStatus;

      
      if (newStatus === 'Completed') {
        order.statusClass = 'bg-success-subtle text-success-emphasis';
        delete order.statusBg;
      } else if (newStatus === 'In Review') {
        order.statusClass = 'bg-info-subtle text-info-emphasis';
        delete order.statusBg;
      } else if (newStatus === 'In Progress') {
        order.statusBg = '#c6e876';
        order.statusColor = '#1b4332';
      }

      
      renderActiveOrders(activeOrdersData);

     
      const modalElement = document.getElementById('updateStatusModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();

      
      const commentInput = document.getElementById('statusCommentInput');
      if (commentInput) commentInput.value = '';
    }
  });
}


renderActiveOrders(activeOrdersData);
})
