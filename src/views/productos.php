<?php
    include '../../includes/validar_sesion.php';
    include '../php/conexion.php';
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Productos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="assets/css/styles.css">
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="home.php">
          <i class="bi bi-building-fill fs-3"></i>
        </a>
        <span class="navbar-text text-white me-3 fs-5">
          Hola, <?php echo $_SESSION['nombre']; ?>
        </span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="home.php">Inicio</a></li>
            <li class="nav-item"><a class="nav-link active" href="productos.php">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="categorias.php">Categorías</a></li>
            <li class="nav-item"><a class="nav-link" href="agregarProducto.php">Agregar</a></li>
            <li class="nav-item"><a class="nav-link text-danger" href="../php/logout.php"><i class="bi bi-box-arrow-right"></i> Salir</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Productos</h3>
        <a href="agregarProducto.php" class="btn btn-success">+ Nuevo</a>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" id="buscarProducto" placeholder="Buscar por nombre de producto...">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" id="filtroCategoria">
                <option value="">Todas las categorías</option>
                <?php 
                  // Obtener categorías para el filtro
                  $consultaFiltro = "SELECT id, nombre FROM Categorias ORDER BY nombre";
                  $stmtFiltro = mysqli_query($conexion, $consultaFiltro);
                  while($catFiltro = mysqli_fetch_array($stmtFiltro)):
                ?>
                  <option value="<?php echo $catFiltro['id']; ?>"><?php echo $catFiltro['nombre']; ?></option>
                <?php endwhile; ?>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" id="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="critico">Crítico (≤5)</option>
                <option value="bajo">Bajo (6-15)</option>
                <option value="normal">Normal (>15)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <!-- Contador de resultados -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <small class="text-muted" id="contadorResultados">Mostrando todos los productos</small>
            <button class="btn btn-outline-secondary btn-sm" id="limpiarFiltros">
              <i class="bi bi-x-circle"></i> Limpiar filtros
            </button>
          </div>
          
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle" id="tablaProductos">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <?php 
                    // SOLUCIÓN: Crear un array asociativo con las categorías UNA SOLA VEZ
                    $categorias = array();
                    $consultaCat = "SELECT id, nombre FROM Categorias;";
                    $stmtCat = mysqli_query($conexion, $consultaCat);
                    
                    // Llenar el array con id como clave y nombre como valor
                    while($cat = mysqli_fetch_array($stmtCat)){
                        $categorias[$cat['id']] = $cat['nombre'];
                    }

                    // Ahora consultar los productos
                    $consulta = "SELECT * FROM Productos;";
                    $stmt = mysqli_query($conexion, $consulta);

                    while($fila = mysqli_fetch_array($stmt)){ 
                        // Determinar el estado del stock
                        $estadoStock = '';
                        $claseStock = '';
                        if($fila['stock'] <= 5){
                            $estadoStock = 'Crítico';
                            $claseStock = 'bg-danger';
                        } elseif($fila['stock'] <= 15){
                            $estadoStock = 'Bajo';
                            $claseStock = 'bg-warning';
                        } else {
                            $estadoStock = 'Normal';
                            $claseStock = 'bg-success';
                        }
                    ?>
                        <tr data-categoria-id="<?php echo $fila['id_categoria']; ?>">
                          <td><?php echo $fila['id'] ?></td>
                          <td><?php echo $fila['nombre'] ?></td>
                          <td><?php echo isset($categorias[$fila['id_categoria']]) ? $categorias[$fila['id_categoria']] : 'Sin categoría'; ?></td>
                          <td class="<?php echo $fila['stock'] <= 10 ? 'text-danger' : 'text-success'; ?>"><?php echo $fila['stock'] ?></td>
                          <td>$<?php echo number_format($fila['precio'], 2) ?></td>
                          <td><span class="badge <?php echo $claseStock; ?>"><?php echo $estadoStock; ?></span></td>
                          <td>
                            <div class="btn-group btn-group-sm" role="group">
                              <button type="button" class="btn btn-outline-info btn-movimientos" data-id="<?php echo $fila['id']; ?>" data-nombre="<?php echo htmlspecialchars($fila['nombre']); ?>" data-stock="<?php echo $fila['stock']; ?>" title="Entradas y Salidas">
                                <i class="bi bi-arrow-left-right"></i>
                              </button>
                              <button type="button" class="btn btn-outline-primary btn-editar" data-id="<?php echo $fila['id']; ?>" title="Editar">
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button type="button" class="btn btn-outline-danger btn-eliminar" data-id="<?php echo $fila['id']; ?>" data-nombre="<?php echo htmlspecialchars($fila['nombre']); ?>" title="Eliminar">
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                    <?php }
                ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../assets/js/productos.js"></script>
  </body>
</html>
