document.addEventListener('DOMContentLoaded', function () {
  const customOrderForm = document.getElementById('customOrderForm');
  const fileInput = document.getElementById('fileUpload');
  const fileDropzone = document.getElementById('fileDropzone');
  const fileError = document.getElementById('fileError');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const alertContainer = document.getElementById('alertContainer');

  if (!customOrderForm) return;

  const formInputs = customOrderForm.querySelectorAll('.form-control, .form-select');


  formInputs.forEach(input => {
    ['input', 'change', 'blur'].forEach(eventName => {
      input.addEventListener(eventName, function () {
        validateSingleInput(this);
      });
    });
  });

  function validateSingleInput(input) {
    if (input.type === 'file') {
      validateFileInput();
      return;
    }

    const val = input.value.trim();
    if (val !== '') {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      if (input.hasAttribute('required')) {
        input.classList.add('is-invalid');
      }
    }
  }

  function validateFileInput() {
    if (!fileInput || !fileDropzone) return true;

    if (fileInput.files && fileInput.files.length > 0) {
      fileDropzone.style.borderColor = '#198754';
      fileDropzone.style.backgroundColor = '#f8fff9';
      if (fileError) fileError.classList.add('d-none');
      if (fileNameDisplay) {
        fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
        fileNameDisplay.className = 'text-success fw-semibold extra-small mb-0';
      }
      return true;
    } else {
      fileDropzone.style.borderColor = '#dc3545';
      fileDropzone.style.backgroundColor = '#fff8f8';
      if (fileError) fileError.classList.remove('d-none');
      if (fileNameDisplay) {
        fileNameDisplay.textContent = 'Upload a photo of your garment (PNG, PDF, AI, EPS)';
        fileNameDisplay.className = 'text-muted extra-small mb-0';
      }
      return false;
    }
  }

  
  customOrderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let isFormValid = true;

    
    if (fileInput && fileInput.hasAttribute('required')) {
      if (!validateFileInput()) {
        isFormValid = false;
      }
    }

    
    formInputs.forEach(input => {
      if (input.type !== 'file') {
        validateSingleInput(input);
        if (input.hasAttribute('required') && input.value.trim() === '') {
          input.classList.add('is-invalid');
          isFormValid = false;
        }
      }
    });

    if (isFormValid) {
      if (alertContainer) {
        alertContainer.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm" role="alert">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <div><strong>Success!</strong> Order submitted successfully!</div>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      } else {
        alert('Order submitted successfully!');
      }

      
      customOrderForm.reset();
      formInputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
      if (fileDropzone) {
        fileDropzone.style.borderColor = '#1b4332';
        fileDropzone.style.backgroundColor = '#f8f9fa';
      }
      if (fileNameDisplay) {
        fileNameDisplay.textContent = 'Upload a photo of your garment (PNG, PDF, AI, EPS)';
        fileNameDisplay.className = 'text-muted extra-small mb-0';
      }
    }
    

    if (isFormValid) {
  if (alertContainer) {
    alertContainer.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm mb-4" role="alert">
        <i class="bi bi-check-circle-fill fs-5"></i>
        <div><strong>Success!</strong> Order submitted successfully!</div>
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  
  customOrderForm.reset();
}






  });
});

