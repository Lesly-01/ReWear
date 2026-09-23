document.addEventListener('DOMContentLoaded', async function () {
  const acceptRequestForm = document.getElementById('acceptRequestForm');
  const acceptRequestModalElem = document.getElementById('acceptRequestModal');
  const alertContainer = document.getElementById('alertContainer');
  const container = document.getElementById('customization-requests-container');
  const template = document.getElementById('request-card-template');

  let currentActiveCard = null;

  // ==========================================
  // CARGA DINÁMICA DESDE BASE DE DATOS
  // ==========================================
  async function cargarSolicitudes() {
    const urlParams = new URLSearchParams(window.location.search);
    const solicitudId = urlParams.get('id');

    try {
      const url = solicitudId ? `../solicitudes/read.php?id=${solicitudId}` : `../solicitudes/read.php`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;

        if (solicitudId) {
          const item = Array.isArray(data)
            ? data.find(i => i.id_solicitud == solicitudId)
            : data;

          if (item) {
            renderizarTarjeta(item);
          } else {
            throw new Error("No se encontró la solicitud con ese ID.");
          }
        } else {
          if (Array.isArray(data) && data.length > 0) {
            container.innerHTML = '';
            data.forEach(item => renderizarTarjeta(item));
          } else {
            container.innerHTML = '<p class="text-center text-muted">No hay solicitudes disponibles en este momento.</p>';
          }
        }
      } else {
        throw new Error(result.message || "Error al cargar las solicitudes.");
      }
    } catch (error) {
      console.error("Error en cargarSolicitudes:", error);
      if (container) container.innerHTML = `<p class="text-center text-danger">Error: ${error.message}</p>`;
    }
  }

  function renderizarTarjeta(item) {
    if (!container || !template) return;

    const clone = template.content.cloneNode(true);
    const imgEl = clone.querySelector('.card-img');
    if (imgEl) imgEl.src = item.foto_prenda ? `../public/${item.foto_prenda}` : 'IMG/default_request.jpg';
    const userEl = clone.querySelector('.card-user');
    if (userEl) userEl.innerHTML = `<i class="bi bi-person-circle me-1" style="color: #1b4332;"></i> @${item.comprador || 'usuario'}`;
    const statusEl = clone.querySelector('.card-status');
    if (statusEl) statusEl.textContent = item.estado ? item.estado.toUpperCase() : 'OPEN';
    const categoryEl = clone.querySelector('.card-category');
    if (categoryEl) categoryEl.textContent = (item.metodo || item.tipo_prenda || 'CUSTOM').toUpperCase();
    const titleEl = clone.querySelector('.card-title');
    if (titleEl) titleEl.textContent = item.titulo;
    const methodEl = clone.querySelector('.card-method');
    if (methodEl) methodEl.textContent = item.metodo || 'Customization';
    const garmentEl = clone.querySelector('.card-garment');
    if (garmentEl) garmentEl.textContent = item.tipo_prenda || 'Garment not specified';
    const descEl = clone.querySelector('.card-description');
    if (descEl) descEl.textContent = item.instrucciones || item.descripcion || 'Sin instrucciones';
    const budgetEl = clone.querySelector('.card-budget');
    if (budgetEl) budgetEl.textContent = `$${parseFloat(item.presupuesto_max || 0).toFixed(2)} USD`;
    const cardDiv = clone.querySelector('.request-card-item');
    if (cardDiv) cardDiv.setAttribute('data-id', item.id_solicitud);
    container.appendChild(clone);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      if (cardItem) {
        const solicitudId = cardItem.getAttribute('data-id');
        const modal = document.getElementById('acceptRequestModal');
        if (modal) {
          modal.setAttribute('data-current-solicitud', solicitudId);
        }
        currentActiveCard = cardItem;
      }
    }
  });

  if (acceptRequestForm) {
    acceptRequestForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const modal = document.getElementById('acceptRequestModal');
      let solicitudId = modal ? modal.getAttribute('data-current-solicitud') : null;

      if (!solicitudId) {
        const urlParams = new URLSearchParams(window.location.search);
        solicitudId = urlParams.get('id');
      }

      if (!solicitudId && currentActiveCard) {
        solicitudId = currentActiveCard.getAttribute('data-id');
      }

      const finalPrice = document.getElementById('finalPriceInput').value;
      const deliveryTime = document.getElementById('deliveryTimeInput').value;
      const deliveryUnit = document.getElementById('deliveryUnitSelect').value;
      const note = document.getElementById('designerNoteInput').value;

      if (!solicitudId) {
        showAlert('Error: No se pudo determinar la solicitud seleccionada.', 'danger');
        return;
      }

      try {
        const response = await fetch('../solicitudes/aceptar_pedido.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_solicitud: solicitudId,
            precio_ofrecido: parseFloat(finalPrice) || 0,
            mensaje: `Tiempo estimado: ${deliveryTime} ${deliveryUnit}. Nota: ${note}`,
            estado: 'aceptada'
          })
        });

        // DEBUG: Capturamos la respuesta como texto primero para evitar el crash del JSON.parse
        const textResponse = await response.text();
        console.log("RAW RESPONSE FROM SERVER:", textResponse);

        if (!response.ok) {
          throw new Error(`Server error ${response.status}: ${textResponse}`);
        }

        const result = JSON.parse(textResponse);

        if (result.success) {
          const modalInstance = bootstrap.Modal.getInstance(acceptRequestModalElem);
          if (modalInstance) modalInstance.hide();
          showAlert('The request has been accepted and the offer has been sent to the user.', 'success');
          if (currentActiveCard) disableActionButtons(currentActiveCard);
        } else {
          showAlert('Error: ' + result.message, 'danger');
        }
      } catch (error) {
        console.error("Error al aceptar pedido:", error);
        showAlert('An unexpected error occurred. Check console for details.', 'danger');
      }
    });
  }

  cargarSolicitudes();
});