document.addEventListener('DOMContentLoaded', () => {
  const editDesignerForm = document.getElementById('editDesignerForm');
  
  if (editDesignerForm) {
    editDesignerForm.addEventListener('submit', (e) => {
      e.preventDefault(); 

      const newName = document.getElementById('inputDesignerName').value;
      const newTag = document.getElementById('inputDesignerTag').value;
      const newBio = document.getElementById('inputDesignerBio').value;

      document.getElementById('displayDesignerName').textContent = newName;
      document.getElementById('displayDesignerTag').textContent = newTag;
      document.getElementById('displayDesignerBio').textContent = newBio;

    
      const modalElement = document.getElementById('editDesignerModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    });
  }
});