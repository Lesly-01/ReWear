document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('reviewTextarea');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');
  const alertContainer = document.getElementById('alertContainer');

  
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const currentLength = textarea.value.length;
      charCount.textContent = `${currentLength}/500`;

      if (currentLength >= 450) {
        charCount.classList.add('text-danger', 'fw-bold');
        charCount.classList.remove('text-muted');
      } else {
        charCount.classList.add('text-muted');
        charCount.classList.remove('text-danger', 'fw-bold');
      }
    });
  }

  
  function showAlert(message, type) {
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show border-0 shadow-sm mb-4" role="alert" style="border-radius: 12px; background-color: #2d6a4f; color: #f7f4ea;">
        <i class="bi bi-check-circle-fill me-2"></i> ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const content = textarea.value.trim();

      if (content === '') {
        
        alertContainer.innerHTML = `
          <div class="alert alert-warning alert-dismissible fade show border-0 shadow-sm mb-4" role="alert" style="border-radius: 12px;">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> Please write a comment before sending!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        return;
      }

      
      showAlert('Thank you! Your review has been submitted successfully.', 'success');

      
      textarea.value = '';
      charCount.textContent = '0/500';
      charCount.classList.add('text-muted');
      charCount.classList.remove('text-danger', 'fw-bold');
    });
  }
});