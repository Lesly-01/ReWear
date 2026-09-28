document.addEventListener('DOMContentLoaded', async () => {
  // 1. Obtener los parámetros de la URL (ej: ?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get('id');

  if (!requestId) {
    console.error('No ID provided in URL');
    return;
  }

  try {
    // 2. Hacer la petición a tu API/backend filtrando por ID
    const response = await fetch(`/api/requests/${requestId}`); // Ajusta a tu endpoint real
    const data = await response.json();

    // 3. Ocultar el spinner y mostrar el contenido
    document.getElementById('loading-spinner').classList.add('d-none');
    document.getElementById('order-content').classList.remove('d-none');

    // 4. Inyectar los datos recibidos de la base de datos
    document.getElementById('order-designer').textContent = `@${data.designer_username || 'unassigned'}`;
    document.getElementById('order-status').textContent = data.status || 'In review';
    document.getElementById('order-img').src = data.image_path || 'img/placeholder.jpg';
    document.getElementById('order-method').textContent = data.method || 'Not specified';
    document.getElementById('order-instructions').textContent = data.instructions || 'No details provided.';

  } catch (error) {
    console.error('Error fetching request data:', error);
    document.getElementById('loading-spinner').innerHTML = '<p class="text-danger extra-small mb-0">Failed to load request details.</p>';
  }
});