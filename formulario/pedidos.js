document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('garmentPhoto');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const successBadge = document.getElementById('successBadge');
  const uploadIcon = document.getElementById('uploadIcon');

  fileInput.addEventListener('change', function() {
    if (fileInput.files && fileInput.files.length > 0) {
    
      const fileName = fileInput.files[0].name;

    
      fileNameDisplay.innerHTML = `
        <span class="text-success fw-semibold">
          <i class="bi bi-check-circle-fill me-1"></i>${fileName}
        </span>
      `;


      successBadge.classList.remove('d-none');

      
      uploadIcon.className = "bi bi-file-earmark-image text-success fs-3 mb-1 d-block";
    } else {
      
      fileNameDisplay.textContent = "Upload a photo of your garment (PNG, PDF, AI, EPS)";
      successBadge.classList.add('d-none');
      uploadIcon.className = "bi bi-cloud-arrow-up text-success fs-3 mb-1 d-block";
    }
  });
});