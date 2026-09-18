
document.addEventListener('DOMContentLoaded', () => {
  console.log("1. DOM cargado correctamente");
  
  window.cargarSolicitudes = async function() {
    console.log("2. Iniciando función cargarSolicitudes");
    
    const container = document.getElementById('customization-requests-container');
    const template = document.getElementById('request-card-template');

    if (!container || !template) {
      console.error("ERROR: No se encontró el contenedor o la plantilla HTML.");
      return;
    }

    try {
      // Subimos un nivel '../' para salir de public/ e ingresar a solicitudes/
      const response = await fetch('../solicitudes/read.php'); 

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("3. Respuesta recibida de read.php:", result);

      if (result.success && result.data && result.data.length > 0) {
        renderizarConPlantilla(result.data, container, template);
      } else {
        container.innerHTML = '<p class="text-center text-muted">No hay solicitudes disponibles.</p>';
      }
    } catch (error) {
      console.error("Error en la petición fetch:", error);
    }
  };

  function renderizarConPlantilla(lista, container, template) {
    container.innerHTML = ''; 

    lista.forEach(item => {
      const clone = template.content.cloneNode(true);

      const imgEl = clone.querySelector('.card-img');
      if (imgEl) imgEl.src = item.foto_prenda ? `../public/${item.foto_prenda}` : 'IMG/default_request.jpg';

      const userEl = clone.querySelector('.card-user');
      if (userEl) userEl.textContent = `@${item.comprador || 'usuario'}`;

      const statusEl = clone.querySelector('.card-status');
      if (statusEl) statusEl.textContent = item.estado ? item.estado.toUpperCase() : 'ABIERTA';

      const categoryEl = clone.querySelector('.card-category');
      if (categoryEl) categoryEl.textContent = (item.metodo || item.tipo_prenda || 'CUSTOM').toUpperCase();

      const titleEl = clone.querySelector('.card-title');
      if (titleEl) titleEl.textContent = item.titulo;

      // ------------------------------------------------------------------
      // INDICADOR DE ORIGEN (NUEVO BLOQUE)
      // Revisa si la solicitud proviene de una publicación del catálogo
      const originBadge = clone.querySelector('.card-origin-badge');
      if (originBadge && item.titulo && item.titulo.includes('Solicitud basada en:')) {
        originBadge.classList.remove('d-none');
      }
      // ------------------------------------------------------------------

      const descEl = clone.querySelector('.card-description');
      if (descEl) descEl.textContent = item.instrucciones || item.descripcion || 'Sin descripción';

      const budgetEl = clone.querySelector('.card-budget');
      if (budgetEl) budgetEl.textContent = `$${parseFloat(item.presupuesto_max || 0).toFixed(2)} USD`;

      const linkEl = clone.querySelector('.card-link');
      if (linkEl) linkEl.href = `solicitudes.html?id=${item.id_solicitud}`;

      container.appendChild(clone);
    });

    console.log("¡Tarjetas renderizadas exitosamente!");
  }
  
  // 2. ACTIVE ORDERS
  
  const activeOrdersData = [
    {
      image: "IMG/denim corset.png",
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
      image: "IMG/crop top jacket.jpg",
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
      image: "IMG/reques",
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

  
  renderActiveOrders(activeOrdersData);

  window.cargarSolicitudes();



// actualización del estado de las ordenes 
document.addEventListener('DOMContentLoaded', () => {

  // 1. Datos con ID explícito
  const activeOrdersData = [
    {
      id: 1,
      image: "IMG/old jacket.jpg",
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
      image: "IMG/crop top jacket.jpg",
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
      image: "IMG/request-4.jpg",
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







document.addEventListener('DOMContentLoaded', () => {
  console.log("1. DOM cargado correctamente");

  // A. CARGA DE TARJETAS EN EL CONTENEDOR
  window.cargarSolicitudes = async function() {
    console.log("2. Iniciando función cargarSolicitudes");
    
    const container = document.getElementById('customization-requests-container');
    const template = document.getElementById('request-card-template');

    if (!container || !template) return;

    try {
      const response = await fetch('../solicitudes/read.php'); 
      if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        renderizarConPlantilla(result.data, container, template);
      } else {
        container.innerHTML = '<p class="text-center text-muted">No hay solicitudes disponibles.</p>';
      }
    } catch (error) {
      console.error("Error en la petición fetch:", error);
    }
  };

  function renderizarConPlantilla(lista, container, template) {
    container.innerHTML = ''; 

    lista.forEach(item => {
      const clone = template.content.cloneNode(true);

      const imgEl = clone.querySelector('.card-img');
      if (imgEl) imgEl.src = item.foto_prenda ? `../public/${item.foto_prenda}` : 'IMG/default_request.jpg';

      const userEl = clone.querySelector('.card-user');
      if (userEl) userEl.textContent = `@${item.comprador || 'usuario'}`;

      const statusEl = clone.querySelector('.card-status');
      if (statusEl) statusEl.textContent = item.estado ? item.estado.toUpperCase() : 'ABIERTA';

      const categoryEl = clone.querySelector('.card-category');
      if (categoryEl) categoryEl.textContent = (item.metodo || item.tipo_prenda || 'CUSTOM').toUpperCase();

      const titleEl = clone.querySelector('.card-title');
      if (titleEl) titleEl.textContent = item.titulo;

      const descEl = clone.querySelector('.card-description');
      if (descEl) descEl.textContent = item.instrucciones || item.descripcion || 'Sin descripción';

      const budgetEl = clone.querySelector('.card-budget');
      if (budgetEl) budgetEl.textContent = `$${parseFloat(item.presupuesto_max || 0).toFixed(2)} USD`;

      const linkEl = clone.querySelector('.card-link');
      if (linkEl) linkEl.href = `publicaciones.html?id=${item.id_solicitud}`;

      container.appendChild(clone);
    });
  }

  // B. AUTO-LLENADO DEL FORMULARIO SI VIENE DE "PLACE ORDER"
  function verificarPedidoDirecto() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const prendaId = urlParams.get('id');

    // Si la URL es: clothes.html?id=5&action=order
    if (action === 'order' && prendaId) {
      fetch(`../solicitudes/get_post.php?id=${prendaId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.post) {
            const post = data.post;
            
            // Llenar campos del modal #createRequestForm
            if (document.getElementById('request_title')) {
              document.getElementById('request_title').value = `Pedido de: ${post.titulo}`;
            }
            if (document.getElementById('garment_type')) {
              document.getElementById('garment_type').value = post.tipo_prenda || '';
            }
            if (document.getElementById('min_budget')) {
              document.getElementById('min_budget').value = post.presupuesto_min || 0;
            }
            if (document.getElementById('max_budget')) {
              document.getElementById('max_budget').value = post.presupuesto_max || 0;
            }

            // Abrir automáticamente el modal
            const modalEl = document.getElementById('createRequestModal');
            if (modalEl) {
              const modal = new bootstrap.Modal(modalEl);
              modal.show();
            }
          }
        })
        .catch(err => console.error("Error al obtener detalles de la prenda:", err));
    }
  }

  // Ejecución inicial
  window.cargarSolicitudes();
  verificarPedidoDirecto();
});
