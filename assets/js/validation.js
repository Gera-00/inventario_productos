// validation.js - validaciones básicas del formulario de producto

document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('productForm');
  if(!form) return;

  form.addEventListener('submit', function(e){
    // Prevent submission if invalid
    var name = document.getElementById('name');
    var category = document.getElementById('category');
    var quantity = document.getElementById('quantity');
    var price = document.getElementById('price');

    var valid = true;

    // name
    if(!name.value.trim()){
      valid = false;
      name.classList.add('is-invalid');
    } else {
      name.classList.remove('is-invalid');
      name.classList.add('is-valid');
    }

    // category
    if(!category.value){
      valid = false;
      category.classList.add('is-invalid');
    } else {
      category.classList.remove('is-invalid');
      category.classList.add('is-valid');
    }

    // quantity
    var q = Number(quantity.value);
    if(Number.isNaN(q) || q < 0){
      valid = false;
      quantity.classList.add('is-invalid');
    } else {
      quantity.classList.remove('is-invalid');
      quantity.classList.add('is-valid');
    }

    // price
    var p = Number(price.value);
    if(Number.isNaN(p) || p < 0){
      valid = false;
      price.classList.add('is-invalid');
    } else {
      price.classList.remove('is-invalid');
      price.classList.add('is-valid');
    }

    if(!valid){
      e.preventDefault();
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      // Aquí normalmente se enviaría el formulario al backend (PHP)
      // Por ahora solo prevenimos el envío real y mostramos mensaje simulado
      e.preventDefault();
      alert('Validación OK - formulario listo para enviar (simulado)');
      // form.submit(); // descomentar cuando haya backend
    }
  });
});
