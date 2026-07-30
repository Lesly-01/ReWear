
const textarea = document.getElementById('reviewTextarea');
const charCount = document.getElementById('charCount');


textarea.addEventListener('input', () => {
  // Obtenemos la cantidad actual de caracteres
  const currentLength = textarea.value.length;
  

  charCount.textContent = `${currentLength}/500`;
});