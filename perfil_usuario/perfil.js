document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('editProfileForm');
  
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault(); 

      
      const newUsername = document.getElementById('inputUsername').value;
      const newTagline = document.getElementById('inputTagline').value;
      const newBio = document.getElementById('inputBio').value;


      document.getElementById('displayUsername').textContent = newUsername;
      document.getElementById('displayTagline').textContent = newTagline;
      document.getElementById('displayBio').textContent = newBio;

      
      const modalElement = document.getElementById('editProfileModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    });
  }
});