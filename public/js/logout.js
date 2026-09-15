function cerrarSesion() {
  // 1. Eliminar la clave exacta donde guardamos la sesión en el login
  localStorage.removeItem('usuarioSesion');
  localStorage.removeItem('user'); // Mantenemos por seguridad
  localStorage.removeItem('token');
  sessionStorage.clear();

  // 2. Notificar al servidor para destruir la sesión PHP
  fetch('../auth/logout.php', {
    method: 'POST'
  })
  .then(() => {
    // 3. Redirigir a homepage.html
    window.location.href = 'homepage.html';
  })
  .catch(err => {
    console.error('Error al cerrar sesión en el servidor:', err);
    // Redirigir de todos modos para asegurar que el usuario salga
    window.location.href = 'homepage.html';
  });
}