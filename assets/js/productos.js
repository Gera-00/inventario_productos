document.addEventListener('DOMContentLoaded', function() {
    const buscarInput = document.getElementById('buscarProducto');
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroEstado = document.getElementById('filtroEstado');
    const tablaBody = document.querySelector('#tablaProductos tbody');
    const contadorResultados = document.getElementById('contadorResultados');
    const limpiarBtn = document.getElementById('limpiarFiltros');
    const todasLasFilas = Array.from(tablaBody.querySelectorAll('tr'));
    
    // Función para filtrar tabla
    function filtrarTabla() {
        const textoBusqueda = buscarInput.value.toLowerCase().trim();
        const categoriaSeleccionada = filtroCategoria.value;
        const estadoSeleccionado = filtroEstado.value;
        let filasVisibles = 0;
        
        todasLasFilas.forEach(fila => {
            const nombre = fila.cells[1].textContent.toLowerCase();
            const categoriaId = fila.getAttribute('data-categoria-id');
            const stock = parseInt(fila.cells[3].textContent);
            
            // Determinar estado del producto
            let estadoProducto = '';
            if(stock <= 5) estadoProducto = 'critico';
            else if(stock <= 15) estadoProducto = 'bajo';
            else estadoProducto = 'normal';
            
            // Aplicar filtros
            const cumpleTexto = textoBusqueda === '' || nombre.includes(textoBusqueda);
            const cumpleCategoria = categoriaSeleccionada === '' || categoriaId === categoriaSeleccionada;
            const cumpleEstado = estadoSeleccionado === '' || estadoProducto === estadoSeleccionado;
            
            if(cumpleTexto && cumpleCategoria && cumpleEstado) {
                fila.style.display = '';
                filasVisibles++;
            } else {
                fila.style.display = 'none';
            }
        });
        
        // Actualizar contador
        if(textoBusqueda === '' && categoriaSeleccionada === '' && estadoSeleccionado === '') {
            contadorResultados.textContent = `Mostrando todos los productos (${todasLasFilas.length})`;
        } else {
            contadorResultados.textContent = `Mostrando ${filasVisibles} de ${todasLasFilas.length} productos`;
        }
        
        // Mostrar mensaje si no hay resultados
        if(filasVisibles === 0 && todasLasFilas.length > 0) {
            if(!document.getElementById('sinResultados')) {
                const mensajeSinResultados = document.createElement('tr');
                mensajeSinResultados.id = 'sinResultados';
                mensajeSinResultados.innerHTML = `
                    <td colspan="6" class="text-center py-4 text-muted">
                        <i class="bi bi-search fs-1 d-block mb-2"></i>
                        <h5>No se encontraron productos</h5>
                        <p class="mb-0">Intenta con otros términos de búsqueda o filtros</p>
                    </td>
                `;
                tablaBody.appendChild(mensajeSinResultados);
            }
        } else {
            const sinResultados = document.getElementById('sinResultados');
            if(sinResultados) sinResultados.remove();
        }
    }
    
    // Event listeners
    buscarInput.addEventListener('input', filtrarTabla);
    filtroCategoria.addEventListener('change', filtrarTabla);
    filtroEstado.addEventListener('change', filtrarTabla);
    
    // Limpiar todos los filtros
    limpiarBtn.addEventListener('click', function() {
        buscarInput.value = '';
        filtroCategoria.value = '';
        filtroEstado.value = '';
        filtrarTabla();
    });
    
    // Contador inicial
    contadorResultados.textContent = `Mostrando todos los productos (${todasLasFilas.length})`;
    
    // Funcionalidad de eliminación de productos
    function manejarEliminacion() {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                const productoNombre = this.getAttribute('data-nombre');
                
                // Crear modal de confirmación personalizado
                const modalConfirmacion = document.createElement('div');
                modalConfirmacion.className = 'modal fade';
                modalConfirmacion.id = 'modalEliminarProducto';
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
                                <p class="mb-0">Esta acción eliminará permanentemente el producto:</p>
                                <strong class="text-danger">${productoNombre}</strong>
                                <p class="text-muted mt-2 mb-0">Esta acción no se puede deshacer.</p>
                            </div>
                            <div class="modal-footer justify-content-center">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i> Cancelar
                                </button>
                                <button type="button" class="btn btn-danger" id="confirmarEliminar">
                                    <i class="bi bi-trash me-1"></i> Sí, Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Agregar modal al documento
                document.body.appendChild(modalConfirmacion);
                
                // Inicializar modal de Bootstrap
                const modal = new bootstrap.Modal(modalConfirmacion);
                
                // Manejar confirmación
                const botonConfirmar = modalConfirmacion.querySelector('#confirmarEliminar');
                botonConfirmar.addEventListener('click', function() {
                    eliminarProducto(productoId, productoNombre, modal, modalConfirmacion);
                });
                
                // Limpiar modal cuando se cierre
                modalConfirmacion.addEventListener('hidden.bs.modal', function() {
                    document.body.removeChild(modalConfirmacion);
                });
                
                // Mostrar modal
                modal.show();
            });
        });
    }
    
    // Función para eliminar producto via AJAX
    function eliminarProducto(id, nombre, modal, modalElement) {
        const botonConfirmar = modalElement.querySelector('#confirmarEliminar');
        const textoOriginal = botonConfirmar.innerHTML;
        
        // Mostrar loading
        botonConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Eliminando...';
        botonConfirmar.disabled = true;
        
        // Crear FormData
        const formData = new FormData();
        formData.append('id', id);
        
        // Enviar petición AJAX
        fetch('../php/delete.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cerrar modal
                modal.hide();
                
                // Mostrar mensaje de éxito
                mostrarNotificacion(data.message, 'success');
                
                // Recargar página después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Mostrar error
                mostrarNotificacion(data.message, 'error');
                
                // Restaurar botón
                botonConfirmar.innerHTML = textoOriginal;
                botonConfirmar.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión. Inténtalo de nuevo.', 'error');
            
            // Restaurar botón
            botonConfirmar.innerHTML = textoOriginal;
            botonConfirmar.disabled = false;
        });
    }
    
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Remover notificaciones existentes
        const notificacionesExistentes = document.querySelectorAll('.notificacion-temp');
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
        notificacion.className = `alert ${colores[tipo]} alert-dismissible fade show notificacion-temp`;
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
    
    // Inicializar eventos de eliminación
    manejarEliminacion();
    
    // Funcionalidad de entradas y salidas
    function manejarMovimientos() {
        const botonesMovimientos = document.querySelectorAll('.btn-movimientos');
        
        botonesMovimientos.forEach(boton => {
            boton.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                const productoNombre = this.getAttribute('data-nombre');
                const stockActual = this.getAttribute('data-stock');
                
                // Crear modal de movimientos
                const modalMovimientos = document.createElement('div');
                modalMovimientos.className = 'modal fade';
                modalMovimientos.id = 'modalMovimientos';
                modalMovimientos.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-info text-white">
                                <h5 class="modal-title">
                                    <i class="bi bi-arrow-left-right me-2"></i>
                                    Entradas y Salidas
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <!-- Información del producto -->
                                <div class="alert alert-light border mb-4">
                                    <h6 class="mb-2"><i class="bi bi-box me-2"></i>Producto:</h6>
                                    <p class="mb-1"><strong>${productoNombre}</strong></p>
                                    <p class="mb-0 text-muted">Stock actual: <span class="badge bg-primary">${stockActual} unidades</span></p>
                                </div>
                                
                                <!-- Formulario -->
                                <form id="formMovimientos">
                                    <input type="hidden" id="movProductoId" value="${productoId}">
                                    
                                    <!-- Tipo de movimiento -->
                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Tipo de Movimiento:</label>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <input type="radio" class="btn-check" name="tipoMovimiento" id="entrada" value="entrada" autocomplete="off">
                                                <label class="btn btn-outline-success w-100 d-flex align-items-center justify-content-center" for="entrada">
                                                    <i class="bi bi-plus-circle me-2"></i>
                                                    <div>
                                                        <div class="fw-bold">Entrada</div>
                                                        <small class="text-muted">Agregar stock</small>
                                                    </div>
                                                </label>
                                            </div>
                                            <div class="col-6">
                                                <input type="radio" class="btn-check" name="tipoMovimiento" id="salida" value="salida" autocomplete="off">
                                                <label class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center" for="salida">
                                                    <i class="bi bi-dash-circle me-2"></i>
                                                    <div>
                                                        <div class="fw-bold">Salida</div>
                                                        <small class="text-muted">Retirar stock</small>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="invalid-feedback d-none" id="errorTipo">
                                            Debe seleccionar el tipo de movimiento
                                        </div>
                                    </div>
                                    
                                    <!-- Cantidad -->
                                    <div class="mb-4">
                                        <label for="cantidadMovimiento" class="form-label fw-bold">Cantidad:</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-123"></i></span>
                                            <input type="number" class="form-control" id="cantidadMovimiento" min="1" placeholder="Ingrese la cantidad">
                                            <span class="input-group-text">unidades</span>
                                        </div>
                                        <div class="invalid-feedback" id="errorCantidad">
                                            La cantidad debe ser un número mayor a 0
                                        </div>
                                        <!-- Ayuda contextual para salidas -->
                                        <div class="form-text text-warning d-none" id="ayudaSalida">
                                            <i class="bi bi-exclamation-triangle me-1"></i>
                                            Máximo disponible: <span id="maxDisponible">${stockActual}</span> unidades
                                        </div>
                                    </div>
                                </form>
                                
                                <!-- Resumen -->
                                <div class="alert alert-secondary d-none" id="resumenMovimiento">
                                    <h6><i class="bi bi-calculator me-2"></i>Resumen:</h6>
                                    <div id="detalleResumen"></div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i> Cancelar
                                </button>
                                <button type="button" class="btn btn-primary" id="confirmarMovimiento" disabled>
                                    <i class="bi bi-check-circle me-1"></i> Confirmar Movimiento
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Agregar modal al documento
                document.body.appendChild(modalMovimientos);
                
                // Inicializar modal de Bootstrap
                const modal = new bootstrap.Modal(modalMovimientos);
                
                // Referencias a elementos
                const tipoRadios = modalMovimientos.querySelectorAll('input[name="tipoMovimiento"]');
                const cantidadInput = modalMovimientos.querySelector('#cantidadMovimiento');
                const botonConfirmar = modalMovimientos.querySelector('#confirmarMovimiento');
                const resumenDiv = modalMovimientos.querySelector('#resumenMovimiento');
                const detalleResumen = modalMovimientos.querySelector('#detalleResumen');
                const ayudaSalida = modalMovimientos.querySelector('#ayudaSalida');
                const maxDisponible = modalMovimientos.querySelector('#maxDisponible');
                const errorTipo = modalMovimientos.querySelector('#errorTipo');
                const errorCantidad = modalMovimientos.querySelector('#errorCantidad');
                
                // Función para validar y actualizar interfaz
                function validarFormulario() {
                    const tipoSeleccionado = modalMovimientos.querySelector('input[name="tipoMovimiento"]:checked');
                    const cantidad = parseInt(cantidadInput.value);
                    
                    // Limpiar errores previos
                    errorTipo.classList.add('d-none');
                    cantidadInput.classList.remove('is-invalid');
                    
                    let esValido = true;
                    
                    // Validar tipo
                    if (!tipoSeleccionado) {
                        errorTipo.classList.remove('d-none');
                        esValido = false;
                    }
                    
                    // Validar cantidad
                    if (!cantidad || cantidad <= 0) {
                        cantidadInput.classList.add('is-invalid');
                        errorCantidad.textContent = 'La cantidad debe ser un número mayor a 0';
                        esValido = false;
                    } else if (tipoSeleccionado && tipoSeleccionado.value === 'salida' && cantidad > parseInt(stockActual)) {
                        cantidadInput.classList.add('is-invalid');
                        errorCantidad.textContent = `Cantidad insuficiente. Stock disponible: ${stockActual}`;
                        esValido = false;
                    }
                    
                    // Mostrar/ocultar ayuda para salidas
                    if (tipoSeleccionado && tipoSeleccionado.value === 'salida') {
                        ayudaSalida.classList.remove('d-none');
                        maxDisponible.textContent = stockActual;
                    } else {
                        ayudaSalida.classList.add('d-none');
                    }
                    
                    // Mostrar resumen si es válido
                    if (esValido && tipoSeleccionado && cantidad > 0) {
                        const nuevoStock = tipoSeleccionado.value === 'entrada' 
                            ? parseInt(stockActual) + cantidad 
                            : parseInt(stockActual) - cantidad;
                        
                        const accion = tipoSeleccionado.value === 'entrada' ? 'agregará' : 'retirará';
                        const colorBadge = tipoSeleccionado.value === 'entrada' ? 'success' : 'danger';
                        
                        detalleResumen.innerHTML = `
                            <p class="mb-1">Se ${accion} <strong>${cantidad} unidades</strong></p>
                            <p class="mb-0">Stock resultante: <span class="badge bg-${colorBadge}">${nuevoStock} unidades</span></p>
                        `;
                        resumenDiv.classList.remove('d-none');
                    } else {
                        resumenDiv.classList.add('d-none');
                    }
                    
                    // Habilitar/deshabilitar botón
                    botonConfirmar.disabled = !esValido;
                }
                
                // Event listeners para validación en tiempo real
                tipoRadios.forEach(radio => {
                    radio.addEventListener('change', validarFormulario);
                });
                
                cantidadInput.addEventListener('input', validarFormulario);
                
                // Manejar confirmación
                botonConfirmar.addEventListener('click', function() {
                    const tipoSeleccionado = modalMovimientos.querySelector('input[name="tipoMovimiento"]:checked');
                    const cantidad = parseInt(cantidadInput.value);
                    
                    if (tipoSeleccionado && cantidad > 0) {
                        procesarMovimiento(productoId, tipoSeleccionado.value, cantidad, modal, modalMovimientos);
                    }
                });
                
                // Limpiar modal cuando se cierre
                modalMovimientos.addEventListener('hidden.bs.modal', function() {
                    document.body.removeChild(modalMovimientos);
                });
                
                // Mostrar modal
                modal.show();
                
                // Focus en primer radio button
                setTimeout(() => {
                    modalMovimientos.querySelector('#entrada').focus();
                }, 300);
            });
        });
    }
    
    // Función para procesar movimiento via AJAX
    function procesarMovimiento(id, tipo, cantidad, modal, modalElement) {
        const botonConfirmar = modalElement.querySelector('#confirmarMovimiento');
        const textoOriginal = botonConfirmar.innerHTML;
        
        // Mostrar loading
        botonConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
        botonConfirmar.disabled = true;
        
        // Crear FormData
        const formData = new FormData();
        formData.append('id', id);
        formData.append('tipo', tipo);
        formData.append('cantidad', cantidad);
        
        // Enviar petición AJAX
        fetch('../php/movimientos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cerrar modal
                modal.hide();
                
                // Mostrar mensaje de éxito
                mostrarNotificacion(data.message, 'success');
                
                // Recargar página después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Mostrar error
                mostrarNotificacion(data.message, 'error');
                
                // Restaurar botón
                botonConfirmar.innerHTML = textoOriginal;
                botonConfirmar.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión. Inténtalo de nuevo.', 'error');
            
            // Restaurar botón
            botonConfirmar.innerHTML = textoOriginal;
            botonConfirmar.disabled = false;
        });
    }
    
    // Inicializar eventos de movimientos
    manejarMovimientos();
    
    // Funcionalidad de edición de productos
    function manejarEdicion() {
        const botonesEditar = document.querySelectorAll('.btn-editar');
        
        botonesEditar.forEach(boton => {
            boton.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                abrirModalEdicion(productoId);
            });
        });
    }
    
    // Función para abrir modal de edición
    function abrirModalEdicion(productoId) {
        // Mostrar loading mientras se cargan los datos
        const loadingModal = crearModalLoading();
        const modalLoading = new bootstrap.Modal(loadingModal);
        modalLoading.show();
        
        // Obtener datos del producto
        fetch(`../php/obtenerProducto.php?id=${productoId}`)
        .then(response => response.json())
        .then(data => {
            modalLoading.hide();
            document.body.removeChild(loadingModal);
            
            if (data.success) {
                crearModalEdicion(data.producto, data.categorias);
            } else {
                mostrarNotificacion(data.message, 'error');
            }
        })
        .catch(error => {
            modalLoading.hide();
            document.body.removeChild(loadingModal);
            console.error('Error:', error);
            mostrarNotificacion('Error al cargar los datos del producto', 'error');
        });
    }
    
    // Crear modal de loading
    function crearModalLoading() {
        const modalLoading = document.createElement('div');
        modalLoading.className = 'modal fade';
        modalLoading.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center py-4">
                        <div class="spinner-border text-primary mb-3" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <h5>Cargando datos del producto...</h5>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalLoading);
        return modalLoading;
    }
    
    // Crear modal de edición
    function crearModalEdicion(producto, categorias) {
        const modalEdicion = document.createElement('div');
        modalEdicion.className = 'modal fade';
        modalEdicion.id = 'modalEdicion';
        modalEdicion.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-pencil-square me-2"></i>
                            Editar Producto
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarProducto" novalidate>
                            <input type="hidden" id="editProductoId" value="${producto.id}">
                            
                            <!-- Nombre del producto -->
                            <div class="mb-3">
                                <label for="editNombre" class="form-label fw-bold">
                                    <i class="bi bi-box me-2"></i>Nombre del Producto
                                </label>
                                <input type="text" class="form-control" id="editNombre" value="${producto.nombre}" required>
                                <div class="invalid-feedback" id="errorEditNombre">
                                    El nombre debe tener al menos 3 caracteres
                                </div>
                            </div>
                            
                            <!-- Categoría -->
                            <div class="mb-3">
                                <label for="editCategoria" class="form-label fw-bold">
                                    <i class="bi bi-tags me-2"></i>Categoría
                                </label>
                                <select class="form-select" id="editCategoria" required>
                                    <option value="">-- Seleccionar categoría --</option>
                                    ${categorias.map(cat => 
                                        `<option value="${cat.id}" ${cat.id == producto.id_categoria ? 'selected' : ''}>
                                            ${cat.nombre}
                                        </option>`
                                    ).join('')}
                                </select>
                                <div class="invalid-feedback" id="errorEditCategoria">
                                    Debe seleccionar una categoría
                                </div>
                            </div>
                            
                            <!-- Stock y Precio -->
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="editStock" class="form-label fw-bold">
                                        <i class="bi bi-boxes me-2"></i>Stock
                                    </label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="editStock" value="${producto.stock}" min="0" required>
                                        <span class="input-group-text">unidades</span>
                                    </div>
                                    <div class="invalid-feedback" id="errorEditStock">
                                        El stock debe ser 0 o mayor
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="editPrecio" class="form-label fw-bold">
                                        <i class="bi bi-currency-dollar me-2"></i>Precio
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input type="number" class="form-control" id="editPrecio" value="${producto.precio}" min="0.01" step="0.01" required>
                                    </div>
                                    <div class="invalid-feedback" id="errorEditPrecio">
                                        El precio debe ser mayor a 0
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Información adicional -->
                            <div class="alert alert-info mt-4">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Nota:</strong> Los cambios en el stock se reflejarán inmediatamente. 
                                Si necesita realizar movimientos de inventario, use la opción "Entradas y Salidas".
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x-circle me-1"></i> Cancelar
                        </button>
                        <button type="button" class="btn btn-primary" id="guardarEdicion">
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
        const form = modalEdicion.querySelector('#formEditarProducto');
        const nombreInput = modalEdicion.querySelector('#editNombre');
        const categoriaSelect = modalEdicion.querySelector('#editCategoria');
        const stockInput = modalEdicion.querySelector('#editStock');
        const precioInput = modalEdicion.querySelector('#editPrecio');
        const botonGuardar = modalEdicion.querySelector('#guardarEdicion');
        
        // Función de validación
        function validarFormularioEdicion() {
            let esValido = true;
            
            // Limpiar validaciones previas
            form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            
            // Validar nombre
            if (nombreInput.value.trim().length < 3) {
                nombreInput.classList.add('is-invalid');
                esValido = false;
            }
            
            // Validar categoría
            if (!categoriaSelect.value) {
                categoriaSelect.classList.add('is-invalid');
                esValido = false;
            }
            
            // Validar stock
            if (stockInput.value === '' || parseInt(stockInput.value) < 0) {
                stockInput.classList.add('is-invalid');
                esValido = false;
            }
            
            // Validar precio
            if (precioInput.value === '' || parseFloat(precioInput.value) <= 0) {
                precioInput.classList.add('is-invalid');
                esValido = false;
            }
            
            return esValido;
        }
        
        // Event listeners para validación en tiempo real
        [nombreInput, categoriaSelect, stockInput, precioInput].forEach(input => {
            input.addEventListener('input', validarFormularioEdicion);
            input.addEventListener('change', validarFormularioEdicion);
        });
        
        // Manejar guardado
        botonGuardar.addEventListener('click', function() {
            if (validarFormularioEdicion()) {
                guardarEdicionProducto(producto.id, modal, modalEdicion);
            }
        });
        
        // Permitir guardar con Enter
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (validarFormularioEdicion()) {
                    guardarEdicionProducto(producto.id, modal, modalEdicion);
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
    
    // Función para guardar edición
    function guardarEdicionProducto(id, modal, modalElement) {
        const botonGuardar = modalElement.querySelector('#guardarEdicion');
        const textoOriginal = botonGuardar.innerHTML;
        
        // Obtener datos del formulario
        const nombre = modalElement.querySelector('#editNombre').value.trim();
        const categoria = modalElement.querySelector('#editCategoria').value;
        const stock = modalElement.querySelector('#editStock').value;
        const precio = modalElement.querySelector('#editPrecio').value;
        
        // Mostrar loading
        botonGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
        botonGuardar.disabled = true;
        
        // Crear FormData
        const formData = new FormData();
        formData.append('id', id);
        formData.append('nombre', nombre);
        formData.append('categoria', categoria);
        formData.append('stock', stock);
        formData.append('precio', precio);
        
        // Enviar petición AJAX
        fetch('../php/editarProducto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cerrar modal
                modal.hide();
                
                // Mostrar mensaje de éxito
                mostrarNotificacion(data.message, 'success');
                
                // Recargar página después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Mostrar error
                mostrarNotificacion(data.message, 'error');
                
                // Restaurar botón
                botonGuardar.innerHTML = textoOriginal;
                botonGuardar.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión. Inténtalo de nuevo.', 'error');
            
            // Restaurar botón
            botonGuardar.innerHTML = textoOriginal;
            botonGuardar.disabled = false;
        });
    }
    
    // Inicializar eventos de edición
    manejarEdicion();
});