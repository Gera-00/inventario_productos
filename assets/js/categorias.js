document.addEventListener('DOMContentLoaded', function() {
    const buscarInput = document.getElementById('buscarCategoria');
    const filtroProductos = document.getElementById('filtroProductos');
    const filtroStock = document.getElementById('filtroStock');
    const tablaBody = document.querySelector('#tablaCategorias tbody');
    const contadorResultados = document.getElementById('contadorResultadosCategorias');
    const limpiarBtn = document.getElementById('limpiarFiltrosCategorias');
    const todasLasFilas = Array.from(tablaBody.querySelectorAll('tr'));
    
    // Función para filtrar tabla
    function filtrarTabla() {
        const textoBusqueda = buscarInput.value.toLowerCase().trim();
        const productosSeleccionado = filtroProductos.value;
        const stockSeleccionado = filtroStock.value;
        let filasVisibles = 0;
        
        todasLasFilas.forEach(fila => {
            const nombreCategoria = fila.cells[1].textContent.toLowerCase();
            const totalProductos = parseInt(fila.getAttribute('data-productos'));
            const totalStock = parseInt(fila.getAttribute('data-stock'));
            
            // Determinar nivel de productos
            let nivelProductos = '';
            if(totalProductos === 0) nivelProductos = 'sin-productos';
            else if(totalProductos <= 3) nivelProductos = 'pocos';
            else if(totalProductos <= 7) nivelProductos = 'moderado';
            else nivelProductos = 'muchos';
            
            // Determinar estado de stock
            let estadoStock = totalStock > 0 ? 'con-stock' : 'sin-stock';
            
            // Aplicar filtros
            const cumpleTexto = textoBusqueda === '' || nombreCategoria.includes(textoBusqueda);
            const cumpleProductos = productosSeleccionado === '' || nivelProductos === productosSeleccionado;
            const cumpleStock = stockSeleccionado === '' || estadoStock === stockSeleccionado;
            
            if(cumpleTexto && cumpleProductos && cumpleStock) {
                fila.style.display = '';
                filasVisibles++;
            } else {
                fila.style.display = 'none';
            }
        });
        
        // Actualizar contador
        if(textoBusqueda === '' && productosSeleccionado === '' && stockSeleccionado === '') {
            contadorResultados.textContent = `Mostrando todas las categorías (${todasLasFilas.length})`;
        } else {
            contadorResultados.textContent = `Mostrando ${filasVisibles} de ${todasLasFilas.length} categorías`;
        }
        
        // Mostrar mensaje si no hay resultados
        if(filasVisibles === 0 && todasLasFilas.length > 0) {
            if(!document.getElementById('sinResultadosCategorias')) {
                const mensajeSinResultados = document.createElement('tr');
                mensajeSinResultados.id = 'sinResultadosCategorias';
                mensajeSinResultados.innerHTML = `
                    <td colspan="6" class="text-center py-4 text-muted">
                        <i class="bi bi-search fs-1 d-block mb-2"></i>
                        <h5>No se encontraron categorías</h5>
                        <p class="mb-0">Intenta con otros términos de búsqueda o filtros</p>
                    </td>
                `;
                tablaBody.appendChild(mensajeSinResultados);
            }
        } else {
            const sinResultados = document.getElementById('sinResultadosCategorias');
            if(sinResultados) sinResultados.remove();
        }
    }
    
    // Event listeners
    buscarInput.addEventListener('input', filtrarTabla);
    filtroProductos.addEventListener('change', filtrarTabla);
    filtroStock.addEventListener('change', filtrarTabla);
    
    // Limpiar todos los filtros
    limpiarBtn.addEventListener('click', function() {
        buscarInput.value = '';
        filtroProductos.value = '';
        filtroStock.value = '';
        filtrarTabla();
    });
    
    // Contador inicial
    contadorResultados.textContent = `Mostrando todas las categorías (${todasLasFilas.length})`;
});

// === VALIDACIONES PARA AGREGAR CATEGORÍA ===

// Expresión regular para validar nombres de categoría
var expreCategoria = /^[a-zA-ZÀ-ÿ0-9\s]{2,50}$/; // Nombres con mínimo 2 caracteres

function validacionCategoria() {
    // Validación del nombre de categoría
    const nombreCategoria = document.getElementById("nombreCategoria").value.trim();
    const nomCat = document.getElementById("nomCat");
    
    console.log('Validando categoría:', nombreCategoria); // Debug
    
    if(nombreCategoria.length <= 1 || !expreCategoria.test(nombreCategoria)) { 
        console.log('Validación falló - nombre inválido'); // Debug
        document.getElementById("nombreCategoria").focus(); 
        if (nomCat) {
            nomCat.style.display = "";
        }
        return false;
    }
    
    console.log('Validación exitosa'); // Debug
    if (nomCat) {
        nomCat.style.display = "none";
    }
    
    return true;
}

function enviarFormularioCategoria() {
    console.log('Función enviarFormularioCategoria ejecutada'); // Debug
    
    if(validacionCategoria()) {
        console.log('Validación pasó correctamente'); // Debug
        
        // Mostrar mensaje de éxito
        const btnCat = document.getElementById("btnCat");
        if (btnCat) {
            btnCat.style.display = "";
            console.log('Mensaje de éxito mostrado'); // Debug
        }
        
        // Simular guardado y redirigir después de 2 segundos
        setTimeout(function() {
            console.log('Enviando formulario...'); // Debug
            // Enviar el formulario
            const form = document.getElementById('formAgregarCategoria');
            if (form) {
                form.submit();
            }
        }, 2000);
    } else {
        console.log('Validación falló'); // Debug
    }
}

// Inicializar validaciones del modal cuando el DOM esté listo
function inicializarModalCategoria() {
    // Evento para el botón de guardar categoría
    const btnGuardar = document.getElementById('btnGuardarCategoria');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón guardar categoría clickeado'); // Debug
            enviarFormularioCategoria();
        });
        console.log('Event listener del botón agregado'); // Debug
    } else {
        console.log('No se encontró el botón btnGuardarCategoria'); // Debug
    }
    
    // Prevenir envío del formulario con Enter y manejarlo manualmente
    const formulario = document.getElementById('formAgregarCategoria');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario enviado con Enter'); // Debug
            enviarFormularioCategoria();
        });
    }
    
    // Ocultar mensaje de error cuando el usuario empiece a escribir
    const inputCategoria = document.getElementById('nombreCategoria');
    if (inputCategoria) {
        inputCategoria.addEventListener('input', function() {
            const nomCat = document.getElementById("nomCat");
            if (nomCat) {
                nomCat.style.display = "none";
            }
        });
    }
    
    // Limpiar formulario cuando se abre el modal
    const modal = document.getElementById('modalAgregarCategoria');
    if (modal) {
        modal.addEventListener('show.bs.modal', function() {
            // Limpiar campos
            const inputNombre = document.getElementById('nombreCategoria');
            if (inputNombre) {
                inputNombre.value = '';
            }
            // Ocultar mensajes
            const nomCat = document.getElementById("nomCat");
            const btnCat = document.getElementById("btnCat");
            if (nomCat) nomCat.style.display = "none";
            if (btnCat) btnCat.style.display = "none";
        });
    }
}

// Llamar la inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarModalCategoria);
} else {
    // DOM ya está listo
    inicializarModalCategoria();
}

// ===== FUNCIONALIDAD DE EDICIÓN Y ELIMINACIÓN DE CATEGORÍAS =====

// Funcionalidad de edición de categorías
function manejarEdicionCategorias() {
    const botonesEditar = document.querySelectorAll('.btn-editar-categoria');
    
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', function() {
            const categoriaId = this.getAttribute('data-id');
            abrirModalEdicionCategoria(categoriaId);
        });
    });
}

// Función para abrir modal de edición de categoría
function abrirModalEdicionCategoria(categoriaId) {
    // Mostrar loading mientras se cargan los datos
    const loadingModal = crearModalLoadingCategoria();
    const modalLoading = new bootstrap.Modal(loadingModal);
    modalLoading.show();
    
    // Obtener datos de la categoría
    fetch(`../php/obtenerCategoria.php?id=${categoriaId}`)
    .then(response => response.json())
    .then(data => {
        modalLoading.hide();
        document.body.removeChild(loadingModal);
        
        if (data.success) {
            crearModalEdicionCategoria(data.categoria, data.productos_asociados);
        } else {
            mostrarNotificacionCategoria(data.message, 'error');
        }
    })
    .catch(error => {
        modalLoading.hide();
        document.body.removeChild(loadingModal);
        console.error('Error:', error);
        mostrarNotificacionCategoria('Error al cargar los datos de la categoría', 'error');
    });
}

// Crear modal de loading para categorías
function crearModalLoadingCategoria() {
    const modalLoading = document.createElement('div');
    modalLoading.className = 'modal fade';
    modalLoading.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center py-4">
                    <div class="spinner-border text-warning mb-3" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <h5>Cargando datos de la categoría...</h5>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalLoading);
    return modalLoading;
}

// Crear modal de edición de categoría
function crearModalEdicionCategoria(categoria, productosAsociados) {
    const modalEdicion = document.createElement('div');
    modalEdicion.className = 'modal fade';
    modalEdicion.id = 'modalEdicionCategoria';
    modalEdicion.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title">
                        <i class="bi bi-pencil-square me-2"></i>
                        Editar Categoría
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formEditarCategoria" novalidate>
                        <input type="hidden" id="editCategoriaId" value="${categoria.id}">
                        
                        <!-- Información de la categoría -->
                        <div class="alert alert-light border mb-4">
                            <h6 class="mb-2"><i class="bi bi-tag me-2"></i>Información actual:</h6>
                            <p class="mb-1">ID: <strong>#${categoria.id}</strong></p>
                            <p class="mb-0">Productos asociados: <span class="badge bg-info">${productosAsociados} producto(s)</span></p>
                        </div>
                        
                        <!-- Nombre de la categoría -->
                        <div class="mb-3">
                            <label for="editNombreCategoria" class="form-label fw-bold">
                                <i class="bi bi-tag-fill me-2"></i>Nombre de la Categoría
                            </label>
                            <input type="text" class="form-control" id="editNombreCategoria" value="${categoria.nombre}" required>
                            <div class="invalid-feedback" id="errorEditNombreCategoria">
                                El nombre debe tener al menos 2 caracteres
                            </div>
                        </div>
                        
                        <!-- Nota informativa -->
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Nota:</strong> Este cambio afectará todos los productos asociados a esta categoría.
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-1"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-warning" id="guardarEdicionCategoria">
                        <i class="bi bi-check-circle me-1"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al documento
    document.body.appendChild(modalEdicion);
    
    // Inicializar modal de Bootstrap
    const modal = new bootstrap.Modal(modalEdicion);
    
    // Referencias a elementos del formulario
    const form = modalEdicion.querySelector('#formEditarCategoria');
    const nombreInput = modalEdicion.querySelector('#editNombreCategoria');
    const botonGuardar = modalEdicion.querySelector('#guardarEdicionCategoria');
    
    // Función de validación
    function validarFormularioEdicionCategoria() {
        const nombre = nombreInput.value.trim();
        
        // Limpiar validaciones previas
        nombreInput.classList.remove('is-invalid');
        
        if (nombre.length < 2) {
            nombreInput.classList.add('is-invalid');
            return false;
        }
        
        return true;
    }
    
    // Event listener para validación en tiempo real
    nombreInput.addEventListener('input', validarFormularioEdicionCategoria);
    
    // Manejar guardado
    botonGuardar.addEventListener('click', function() {
        if (validarFormularioEdicionCategoria()) {
            guardarEdicionCategoria(categoria.id, modal, modalEdicion);
        }
    });
    
    // Permitir guardar con Enter
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (validarFormularioEdicionCategoria()) {
                guardarEdicionCategoria(categoria.id, modal, modalEdicion);
            }
        }
    });
    
    // Limpiar modal cuando se cierre
    modalEdicion.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalEdicion);
    });
    
    // Mostrar modal y enfocar primer campo
    modal.show();
    setTimeout(() => {
        nombreInput.focus();
        nombreInput.select();
    }, 300);
}

// Función para guardar edición de categoría
function guardarEdicionCategoria(id, modal, modalElement) {
    const botonGuardar = modalElement.querySelector('#guardarEdicionCategoria');
    const textoOriginal = botonGuardar.innerHTML;
    
    // Obtener datos del formulario
    const nombre = modalElement.querySelector('#editNombreCategoria').value.trim();
    
    // Mostrar loading
    botonGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    botonGuardar.disabled = true;
    
    // Crear FormData
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    
    // Enviar petición AJAX
    fetch('../php/editarCategoria.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Cerrar modal
            modal.hide();
            
            // Mostrar mensaje de éxito
            mostrarNotificacionCategoria(data.message, 'success');
            
            // Recargar página después de un breve delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            // Mostrar error
            mostrarNotificacionCategoria(data.message, 'error');
            
            // Restaurar botón
            botonGuardar.innerHTML = textoOriginal;
            botonGuardar.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarNotificacionCategoria('Error de conexión. Inténtalo de nuevo.', 'error');
        
        // Restaurar botón
        botonGuardar.innerHTML = textoOriginal;
        botonGuardar.disabled = false;
    });
}

// Funcionalidad de eliminación de categorías
function manejarEliminacionCategorias() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar-categoria');
    
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function() {
            const categoriaId = this.getAttribute('data-id');
            const categoriaNombre = this.getAttribute('data-nombre');
            const productosAsociados = parseInt(this.getAttribute('data-productos'));
            
            // Crear modal de confirmación personalizado
            const modalConfirmacion = document.createElement('div');
            modalConfirmacion.className = 'modal fade';
            modalConfirmacion.id = 'modalEliminarCategoria';
            modalConfirmacion.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                Confirmar Eliminación
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <i class="bi bi-trash text-danger" style="font-size: 3rem;"></i>
                            <h4 class="mt-3 mb-3">¿Estás seguro?</h4>
                            <p class="mb-0">Esta acción eliminará permanentemente la categoría:</p>
                            <strong class="text-danger">${categoriaNombre}</strong>
                            
                            ${productosAsociados > 0 ? `
                                <div class="alert alert-warning mt-3">
                                    <i class="bi bi-exclamation-circle me-2"></i>
                                    <strong>Advertencia:</strong> Esta categoría tiene <strong>${productosAsociados} producto(s)</strong> asociado(s).
                                    No podrás eliminarla hasta que reasignes o elimines estos productos.
                                </div>
                            ` : `
                                <p class="text-muted mt-2 mb-0">Esta acción no se puede deshacer.</p>
                            `}
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> Cancelar
                            </button>
                            ${productosAsociados === 0 ? `
                                <button type="button" class="btn btn-danger" id="confirmarEliminarCategoria">
                                    <i class="bi bi-trash me-1"></i> Sí, Eliminar
                                </button>
                            ` : `
                                <button type="button" class="btn btn-outline-danger" disabled>
                                    <i class="bi bi-shield-x me-1"></i> No se puede eliminar
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
            
            // Agregar modal al documento
            document.body.appendChild(modalConfirmacion);
            
            // Inicializar modal de Bootstrap
            const modal = new bootstrap.Modal(modalConfirmacion);
            
            // Manejar confirmación solo si no hay productos asociados
            if (productosAsociados === 0) {
                const botonConfirmar = modalConfirmacion.querySelector('#confirmarEliminarCategoria');
                botonConfirmar.addEventListener('click', function() {
                    eliminarCategoria(categoriaId, categoriaNombre, modal, modalConfirmacion);
                });
            }
            
            // Limpiar modal cuando se cierre
            modalConfirmacion.addEventListener('hidden.bs.modal', function() {
                document.body.removeChild(modalConfirmacion);
            });
            
            // Mostrar modal
            modal.show();
        });
    });
}

// Función para eliminar categoría via AJAX
function eliminarCategoria(id, nombre, modal, modalElement) {
    const botonConfirmar = modalElement.querySelector('#confirmarEliminarCategoria');
    const textoOriginal = botonConfirmar.innerHTML;
    
    // Mostrar loading
    botonConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Eliminando...';
    botonConfirmar.disabled = true;
    
    // Crear FormData
    const formData = new FormData();
    formData.append('id', id);
    
    // Enviar petición AJAX
    fetch('../php/eliminarCategoria.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Cerrar modal
            modal.hide();
            
            // Mostrar mensaje de éxito
            mostrarNotificacionCategoria(data.message, 'success');
            
            // Recargar página después de un breve delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            // Mostrar error
            mostrarNotificacionCategoria(data.message, 'error');
            
            // Restaurar botón
            botonConfirmar.innerHTML = textoOriginal;
            botonConfirmar.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarNotificacionCategoria('Error de conexión. Inténtalo de nuevo.', 'error');
        
        // Restaurar botón
        botonConfirmar.innerHTML = textoOriginal;
        botonConfirmar.disabled = false;
    });
}

// Función para mostrar notificaciones específicas para categorías
function mostrarNotificacionCategoria(mensaje, tipo = 'info') {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notificacion-temp-categoria');
    notificacionesExistentes.forEach(n => n.remove());
    
    const colores = {
        success: 'alert-success',
        error: 'alert-danger',
        info: 'alert-info',
        warning: 'alert-warning'
    };
    
    const iconos = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-circle-fill',
        info: 'bi-info-circle-fill',
        warning: 'bi-exclamation-triangle-fill'
    };
    
    const notificacion = document.createElement('div');
    notificacion.className = `alert ${colores[tipo]} alert-dismissible fade show notificacion-temp-categoria`;
    notificacion.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = `
        <i class="bi ${iconos[tipo]} me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notificacion && notificacion.parentNode) {
            notificacion.remove();
        }
    }, 5000);
}

// Funcionalidad para ver productos de una categoría
function manejarVerProductos() {
    const botonesVer = document.querySelectorAll('.btn-ver-productos');
    
    botonesVer.forEach(boton => {
        boton.addEventListener('click', function() {
            const categoriaId = this.getAttribute('data-id');
            const categoriaNombre = this.getAttribute('data-nombre');
            abrirModalVerProductos(categoriaId, categoriaNombre);
        });
    });
}

// Función para abrir modal de ver productos
function abrirModalVerProductos(categoriaId, categoriaNombre) {
    // Mostrar loading mientras se cargan los datos
    const loadingModal = crearModalLoadingProductos();
    const modalLoading = new bootstrap.Modal(loadingModal);
    modalLoading.show();
    
    // Obtener productos de la categoría
    fetch(`../php/obtenerProductosCategoria.php?id=${categoriaId}`)
    .then(response => response.json())
    .then(data => {
        modalLoading.hide();
        document.body.removeChild(loadingModal);
        
        if (data.success) {
            crearModalVerProductos(data.categoria, data.productos, data.estadisticas);
        } else {
            mostrarNotificacionCategoria(data.message, 'error');
        }
    })
    .catch(error => {
        modalLoading.hide();
        document.body.removeChild(loadingModal);
        console.error('Error:', error);
        mostrarNotificacionCategoria('Error al cargar los productos de la categoría', 'error');
    });
}

// Crear modal de loading para productos
function crearModalLoadingProductos() {
    const modalLoading = document.createElement('div');
    modalLoading.className = 'modal fade';
    modalLoading.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center py-4">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <h5>Cargando productos de la categoría...</h5>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalLoading);
    return modalLoading;
}

// Crear modal para ver productos de una categoría
function crearModalVerProductos(categoria, productos, estadisticas) {
    const modalVerProductos = document.createElement('div');
    modalVerProductos.className = 'modal fade';
    modalVerProductos.id = 'modalVerProductos';
    modalVerProductos.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="bi bi-eye me-2"></i>
                        Productos de la Categoría: ${categoria.nombre}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Estadísticas de la categoría -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card bg-light border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-box-seam text-primary fs-2"></i>
                                    <h4 class="mt-2 mb-1">${estadisticas.total_productos}</h4>
                                    <p class="text-muted mb-0">Total Productos</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-light border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-boxes text-success fs-2"></i>
                                    <h4 class="mt-2 mb-1">${estadisticas.total_stock}</h4>
                                    <p class="text-muted mb-0">Stock Total</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-light border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-currency-dollar text-warning fs-2"></i>
                                    <h4 class="mt-2 mb-1">$${estadisticas.valor_total.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
                                    <p class="text-muted mb-0">Valor Total</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-light border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-graph-up text-info fs-2"></i>
                                    <h4 class="mt-2 mb-1">$${estadisticas.precio_promedio.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
                                    <p class="text-muted mb-0">Precio Promedio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${productos.length > 0 ? `
                        <!-- Filtro de búsqueda -->
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" id="buscarProductoCategoria" placeholder="Buscar producto en esta categoría...">
                                    <button class="btn btn-outline-secondary" type="button" id="limpiarBusquedaProducto">
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tabla de productos -->
                        <div class="table-responsive">
                            <table class="table table-hover align-middle" id="tablaProductosCategoria">
                                <thead class="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre del Producto</th>
                                        <th>Stock</th>
                                        <th>Precio Unitario</th>
                                        <th>Valor Total</th>
                                        <th>Estado Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productos.map(producto => {
                                        const valorTotal = producto.stock * producto.precio;
                                        let estadoStock = '';
                                        let claseStock = '';
                                        if(producto.stock <= 5){
                                            estadoStock = 'Crítico';
                                            claseStock = 'bg-danger';
                                        } else if(producto.stock <= 15){
                                            estadoStock = 'Bajo';
                                            claseStock = 'bg-warning text-dark';
                                        } else {
                                            estadoStock = 'Normal';
                                            claseStock = 'bg-success';
                                        }
                                        
                                        return `
                                            <tr class="fila-producto" data-nombre="${producto.nombre.toLowerCase()}">
                                                <td><span class="badge bg-secondary">#${producto.id}</span></td>
                                                <td>
                                                    <strong>${producto.nombre}</strong>
                                                </td>
                                                <td>
                                                    <span class="${producto.stock <= 10 ? 'text-danger fw-bold' : 'text-success fw-bold'}">
                                                        ${producto.stock} unidades
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="text-primary fw-bold">$${parseFloat(producto.precio).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                                </td>
                                                <td>
                                                    <span class="text-success fw-bold">$${valorTotal.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                                </td>
                                                <td>
                                                    <span class="badge ${claseStock}">${estadoStock}</span>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Contador de resultados -->
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted" id="contadorProductosCategoria">
                                Mostrando ${productos.length} producto(s)
                            </small>
                            <a href="productos.php" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-arrow-right me-1"></i> Ver todos los productos
                            </a>
                        </div>
                    ` : `
                        <!-- Estado vacío -->
                        <div class="text-center py-5">
                            <i class="bi bi-inbox text-muted" style="font-size: 4rem;"></i>
                            <h4 class="mt-3 text-muted">Esta categoría no tiene productos</h4>
                            <p class="text-muted mb-4">Aún no se han agregado productos a la categoría "${categoria.nombre}"</p>
                            <a href="agregarProducto.php" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-2"></i> Agregar Primer Producto
                            </a>
                        </div>
                    `}
                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-1"></i> Cerrar
                    </button>
                    ${productos.length > 0 ? `
                        <a href="agregarProducto.php" class="btn btn-primary">
                            <i class="bi bi-plus-circle me-1"></i> Agregar Nuevo Producto
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al documento
    document.body.appendChild(modalVerProductos);
    
    // Inicializar modal de Bootstrap
    const modal = new bootstrap.Modal(modalVerProductos);
    
    // Configurar funcionalidad de búsqueda si hay productos
    if (productos.length > 0) {
        const buscarInput = modalVerProductos.querySelector('#buscarProductoCategoria');
        const limpiarBtn = modalVerProductos.querySelector('#limpiarBusquedaProducto');
        const filasProductos = modalVerProductos.querySelectorAll('.fila-producto');
        const contador = modalVerProductos.querySelector('#contadorProductosCategoria');
        
        // Función de búsqueda
        function filtrarProductosCategoria() {
            const textoBusqueda = buscarInput.value.toLowerCase().trim();
            let productosVisibles = 0;
            
            filasProductos.forEach(fila => {
                const nombreProducto = fila.getAttribute('data-nombre');
                
                if (textoBusqueda === '' || nombreProducto.includes(textoBusqueda)) {
                    fila.style.display = '';
                    productosVisibles++;
                } else {
                    fila.style.display = 'none';
                }
            });
            
            // Actualizar contador
            if (textoBusqueda === '') {
                contador.textContent = `Mostrando ${productos.length} producto(s)`;
            } else {
                contador.textContent = `Mostrando ${productosVisibles} de ${productos.length} producto(s)`;
            }
            
            // Mostrar mensaje si no hay resultados
            const tablaBody = modalVerProductos.querySelector('#tablaProductosCategoria tbody');
            const mensajeExistente = modalVerProductos.querySelector('#sinResultadosProductos');
            
            if (productosVisibles === 0 && textoBusqueda !== '') {
                if (!mensajeExistente) {
                    const mensajeSinResultados = document.createElement('tr');
                    mensajeSinResultados.id = 'sinResultadosProductos';
                    mensajeSinResultados.innerHTML = `
                        <td colspan="6" class="text-center py-4 text-muted">
                            <i class="bi bi-search fs-1 d-block mb-2"></i>
                            <h5>No se encontraron productos</h5>
                            <p class="mb-0">No hay productos que coincidan con "${textoBusqueda}"</p>
                        </td>
                    `;
                    tablaBody.appendChild(mensajeSinResultados);
                }
            } else if (mensajeExistente) {
                mensajeExistente.remove();
            }
        }
        
        // Event listeners para búsqueda
        buscarInput.addEventListener('input', filtrarProductosCategoria);
        
        limpiarBtn.addEventListener('click', function() {
            buscarInput.value = '';
            filtrarProductosCategoria();
            buscarInput.focus();
        });
    }
    
    // Limpiar modal cuando se cierre
    modalVerProductos.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalVerProductos);
    });
    
    // Mostrar modal
    modal.show();
    
    // Enfocar búsqueda si hay productos
    if (productos.length > 0) {
        setTimeout(() => {
            const buscarInput = modalVerProductos.querySelector('#buscarProductoCategoria');
            if (buscarInput) {
                buscarInput.focus();
            }
        }, 300);
    }
}

// Inicializar eventos de edición y eliminación de categorías cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    manejarEdicionCategorias();
    manejarEliminacionCategorias();
    manejarVerProductos();
});