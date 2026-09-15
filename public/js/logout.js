function cerrarSesion() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  sessionStorage.clear();


  fetch('backend/logout.php', {
    method: 'POST'
  })
  .then(() => {
    
    window.location.href = 'login.html';
  })
  .catch(err => {
    console.error('Error al cerrar sesión:', err);
    
    window.location.href = 'login.html';
  });
}