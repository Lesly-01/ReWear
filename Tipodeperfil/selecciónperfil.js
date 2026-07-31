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
      console.log('Perfil seleccionado: Designer');
    } else if (role === 'user') {
    
      cardUser.classList.add('selected');
      cardDesigner.classList.remove('selected');
      console.log('Perfil seleccionado: User');
    }


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

  // 4. Acción del botón Enter
  if (btnEnter) {
    btnEnter.addEventListener('click', () => {
      if (selectedRole === 'designer') {
        alert('Redirigiendo a perfil de Diseñador...');
        // window.location.href = 'designer-profile.html'; 
      } else if (selectedRole === 'user') {
        alert('Redirigiendo a perfil de Usuario...');
        // window.location.href = 'user-profile.html';
      }
    });
  }

});