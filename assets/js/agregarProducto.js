// agregarProducto.js - Validaciones para el formulario de agregar producto

// Expresiones regulares para validación
var expreNombre = /^[a-zA-ZÀ-ÿ0-9\s]{3,50}$/; // Nombres de productos con números permitidos
var expreCantidad = /^\d+$/; // Solo números enteros positivos
var exprePrecio = /^\d+(\.\d{1,2})?$/; // Números con hasta 2 decimales

function validacion() {
    // Validación del nombre
    if(document.getElementById("name").value.trim().length <= 2 || 
        !expreNombre.test(document.getElementById("name").value.trim())) { 
        document.getElementById("name").focus(); 
        nom.style.display = "";
        return false;
    }
    nom.style.display = "none";
    
    // Validación de categoría
    if(document.getElementById("category").value.trim() == "") {  
        document.getElementById("category").focus();
        cat.style.display = "";
        return false;
    }
    cat.style.display = "none";
    
    // Validación de cantidad
    var cantidad = document.getElementById("quantity").value.trim();
    if(cantidad == "" || !expreCantidad.test(cantidad) || parseInt(cantidad) < 0) { 
        document.getElementById("quantity").focus(); 
        cant.style.display = "";
        return false;
    }
    cant.style.display = "none";
    
    // Validación de precio
    var precio = document.getElementById("price").value.trim();
    if(precio == "" || !exprePrecio.test(precio) || parseFloat(precio) <= 0) { 
        document.getElementById("price").focus(); 
        prec.style.display = "";
        return false;
    }
    prec.style.display = "none";
    
    return true;
}

function enviarFormulario() {
    if(validacion()) {
        // Mostrar mensaje de éxito
        btn.style.display = "";
        
        // Simular guardado y redirigir después de 2 segundos
        setTimeout(function() {
            // Enviar el formulario
            document.getElementById('productForm').submit();
        }, 2000);
    }
}

// Agregar eventos cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Evento para el botón de enviar
    document.getElementById('btnEnviar').addEventListener('click', function(e) {
        e.preventDefault(); // Evita el envío automático del formulario
        enviarFormulario();
    });
    
    // Ocultar mensajes de error cuando el usuario empiece a escribir
    document.getElementById('name').addEventListener('input', function() {
        nom.style.display = "none";
    });
    
    document.getElementById('category').addEventListener('change', function() {
        cat.style.display = "none";
    });
    
    document.getElementById('quantity').addEventListener('input', function() {
        cant.style.display = "none";
    });
    
    document.getElementById('price').addEventListener('input', function() {
        prec.style.display = "none";
    });
});