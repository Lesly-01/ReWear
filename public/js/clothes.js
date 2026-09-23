document.addEventListener('DOMContentLoaded', () => {
  console.log("1. DOM cargado correctamente");

  // ==========================================
  // A. CARGA DE SOLICITUDES DESDE EL BACKEND
  // ==========================================
  window.cargarSolicitudes = async function() {
    console.log("2. Iniciando función cargarSolicitudes");

    const container = document.getElementById('customization-requests-container');
    const template = document.getElementById('request-card-template');

    if (!container || !template) {
      console.error("ERROR: No se encontró el contenedor o la plantilla HTML.");
      return;
    }

    try {
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

      const originBadge = clone.querySelector('.card-origin-badge');
      if (originBadge && item.titulo && item.titulo.includes('Solicitud basada en:')) {
        originBadge.classList.remove('d-none');
      }

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

  // ==========================================
  // B. GESTIÓN DE ÓRDENES ACTIVAS (DINÁMICO)
  // ==========================================
  async function cargarOrdenesActivas() {
    console.log("Iniciando carga de órdenes activas...");
    const container = document.getElementById('orders-container');
    if (!container) return;

    try {
      // Endpoint hipotético que devuelve las postulaciones 'aceptada' del diseñador actual
      const response = await fetch('../solicitudes/get_active_orders.php');

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        renderActiveOrders(result.data);
      } else {
        container.innerHTML = '<p class="text-center text-muted">No tienes órdenes activas en este momento.</p>';
      }
    } catch (error) {
      console.error("Error al cargar órdenes activas:", error);
      container.innerHTML = '<p class="text-center text-danger">Error al cargar tus órdenes activas.</p>';
    }
  }

  function renderActiveOrders(orders) {
    const container = document.getElementById('orders-container');
    if (!container) return;

    container.innerHTML = orders.map(order => {
      // Mapeo de estados a estilos
      let statusStyle = { bg: '#c6e876', color: '#1b4332', text: order.estado || 'In Progress' };
      if (order.estado === 'En Review') statusStyle = { bg: '#BEE3F8', color: '#2B6CB0', text: 'In Review' };
      if (order.estado === 'Completed') statusStyle = { bg: '#C6F6D5', color: '#2F855A', text: 'Completed' };

      return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div class="position-relative" style="height: 190px;">
            <img src="${order.foto_prenda ? '../public/' + order.foto_prenda : 'IMG/default_request.jpg'}" class="w-100 h-100 object-fit-cover" alt="${order.titulo}">

            <span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style="background-color: ${statusStyle.bg}; color: ${statusStyle.color};">${statusStyle.text}</span>

            <span class="badge bg-white text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill shadow-sm small">
              ${order.fecha_postulacion || 'Active'}
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-person-circle text-muted"></i>
              <span class="fw-semibold text-dark small">@${order.comprador || 'usuario'}</span>
            </div>

            <h6 class="fw-bold mb-1 text-truncate" style="color: #022522;">${order.titulo}</h6>
            <p class="text-muted small mb-3 text-truncate-2" style="font-size: 0.82rem; line-height: 1.3;">
              ${order.instrucciones || order.descripcion || 'Sin descripción'}
            </p>

            <div class="p-2 rounded-3 mb-3 bg-light d-flex justify-content-between align-items-center">
              <span class="text-muted" style="font-size: 0.75rem;">Agreed Price:</span>
              <span class="fw-bold" style="color: #1b4332; font-size: 0.9rem;">$${parseFloat(order.presupuesto_max || 0).toFixed(2)} USD</span>
            </div>

            <button type="button"
                    class="btn btn-sm flex-fill rounded-3 fw-semibold text-white px-1 btn-update-status"
                    data-id="${order.id_postulacion}"
                    data-bs-toggle="modal"
                    data-bs-target="#updateStatusModal"
                    style="background-color: #1b4332; font-size: 0.78rem;">
              Update Status
            </button>
          </div>
        </div>
      </div>
    `}).join('');

    container.querySelectorAll('.btn-update-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-id');
        // En una implementación real, buscaríamos los datos del objeto order.
        // Para simplicidad, podemos hacer un fetch rápido o pasar los datos al render.
        console.log("Actualizando orden:", orderId);
        if (document.getElementById('orderIdInput')) document.getElementById('orderIdInput').value = orderId;
      });
    });
  }

  // Evento de envío del formulario del modal
  const updateStatusForm = document.getElementById('updateStatusForm');
  if (updateStatusForm) {
    updateStatusForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const orderId = document.getElementById('orderIdInput').value;
      const newStatus = document.getElementById('statusSelect').value;
      const comment = document.getElementById('statusCommentInput').value;

      if (!orderId) {
        alert('Error: No se encontró el ID de la orden.');
        return;
      }

      try {
        const response = await fetch('../solicitudes/aceptar_pedido.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_postulacion: orderId,
            estado: newStatus,
            comentario: comment
          })
        });

        const result = await response.json();

        if (result.success) {
          const modalElement = document.getElementById('updateStatusModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }

          const commentInput = document.getElementById('statusCommentInput');
          if (commentInput) commentInput.value = '';

          // Recargar la lista para ver cambios
          await cargarOrdenesActivas();
          // También recargamos las solicitudes generales para que desaparezca de la otra lista
          await cargarSolicitudes();
        } else {
          alert('Error al actualizar: ' + result.message);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
        alert('Ocurrió un error al conectar con el servidor.');
      }
    });
  }

  // ==========================================
  // C. AUTO-LLENADO DESDE PARÁMETROS URL
  // ==========================================
  function verificarPedidoDirecto() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const prendaId = urlParams.get('id');

    if (action === 'order' && prendaId) {
      fetch(`../solicitudes/get_post.php?id=${prendaId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.post) {
            const post = data.post;

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

  // ==========================================
  // EJECUCIÓN INICIAL
  // ==========================================
  window.cargarSolicitudes();
  cargarOrdenesActivas();
  verificarPedidoDirecto();
});
