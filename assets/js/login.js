// login.js - Validaciones y funcionalidades para la página de login

document.addEventListener('DOMContentLoaded', function(){
  // Mostrar mensaje de logout exitoso si viene de logout
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('logout') === 'success') {
    const logoutMessage = document.getElementById('logoutMessage');
    logoutMessage.classList.remove('d-none');
    
    // Limpiar la URL sin recargar la página
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // Validación del formulario de login
  var form = document.getElementById('loginForm');
  form.addEventListener('submit', function(e){
    if(!form.checkValidity()){
      e.preventDefault();
      e.stopPropagation();
    }
    form.classList.add('was-validated');
  });
});