document.addEventListener('DOMContentLoaded', () => {

  const cardDesigner = document.getElementById('cardDesigner');
  const cardUser = document.getElementById('cardUser');
  const btnEnter = document.getElementById('btnEnter');

  let selectedRole = null; 

  function selectCard(role) {
    selectedRole = role;

    if (role === 'designer') {
      cardDesigner.classList.add('selected');
      cardUser.classList.remove('selected');
      // Actualizamos el enlace apuntando al rol 'diseñador' que espera PHP/MySQL
      if (btnEnter) {
        btnEnter.href = "signup.html?role=disenador";
      }
    } else if (role === 'user') {
      cardUser.classList.add('selected');
      cardDesigner.classList.remove('selected');
      // Actualizamos el enlace apuntando al rol 'comprador' que espera PHP/MySQL
      if (btnEnter) {
        btnEnter.href = "signup.html?role=comprador";
      }
    }

    // Habilitar el botón Enter tras seleccionar una opción
    if (btnEnter) {
      btnEnter.style.opacity = '1';
      btnEnter.style.pointerEvents = 'auto';
      btnEnter.style.cursor = 'pointer';
    }
  }

  if (cardDesigner) {
    cardDesigner.addEventListener('click', () => selectCard('designer'));
  }

  if (cardUser) {
    cardUser.addEventListener('click', () => selectCard('user'));
  }

});