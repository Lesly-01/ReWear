document.addEventListener('DOMContentLoaded', function () {
  const acceptRequestForm = document.getElementById('acceptRequestForm');
  const acceptRequestModalElem = document.getElementById('acceptRequestModal');
  const alertContainer = document.getElementById('alertContainer');
  const declineBtn = document.getElementById('declineBtn'); // Botón de rechazar

  // Función auxiliar para mostrar la alerta en pantalla
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
  }

  // 1. LÓGICA AL ACEPTAR LA SOLICITUD (Desde el Modal)
  if (acceptRequestForm) {
    acceptRequestForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Cerrar el modal de Bootstrap
      const modalInstance = bootstrap.Modal.getInstance(acceptRequestModalElem);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Mostrar el mensaje de éxito requerido
      showAlert('The request has been accepted, a notification has been sent to the user.', 'success');

      // Opcional: Cambiar el estado visual de los botones
      disableActionButtons();
    });
  }

  // 2. LÓGICA AL RECHAZAR LA SOLICITUD
  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      const confirmDecline = confirm('Are you sure you want to decline this request?');
      if (confirmDecline) {
        // Mostrar el mensaje de rechazo requerido
        showAlert('The request has been rejected, a notification has been sent to the user.', 'danger');

        // Deshabilitar botones para evitar múltiples acciones
        disableActionButtons();
      }
    });
  }

  // Función para deshabilitar botones tras responder la solicitud
  function disableActionButtons() {
    const actionButtons = document.querySelectorAll('#requestCard button');
    actionButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50');
    });
  }
});