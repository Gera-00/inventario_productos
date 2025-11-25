<?php 
  include '../php/conexion.php';
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Categorías</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="assets/css/styles.css">
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="home.html">
          <i class="bi bi-building-fill fs-3"></i>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="home.php">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="productos.php">Productos</a></li>
            <li class="nav-item"><a class="nav-link active" href="categorias.php">Categorías</a></li>
            <li class="nav-item"><a class="nav-link" href="agregarProducto.html">Agregar</a></li>
            <li class="nav-item"><a class="nav-link text-danger" href="../../includes/sesion.php?action=logout"><i class="bi bi-box-arrow-right"></i> Salir</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Categorías</h3>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalAgregarCategoria">
          <i class="bi bi-plus-circle"></i> Nueva Categoría
        </button>
      </div>

      <?php
        // Obtener estadísticas generales
        $consultaTotalCategorias = "SELECT COUNT(*) as total FROM Categorias";
        $stmtTotal = mysqli_query($conexion, $consultaTotalCategorias);
        $totalCategorias = mysqli_fetch_array($stmtTotal)['total'];

        $consultaTotalProductos = "SELECT COUNT(*) as total FROM Productos";
        $stmtTotalProd = mysqli_query($conexion, $consultaTotalProductos);
        $totalProductos = mysqli_fetch_array($stmtTotalProd)['total'];
      ?>

      <!-- Tarjetas de estadísticas -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title"><?php echo $totalCategorias; ?></h4>
                  <p class="card-text">Total Categorías</p>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-tags fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title"><?php echo $totalProductos; ?></h4>
                  <p class="card-text">Total Productos</p>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-box-seam fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Lista de Categorías</h5>
        </div>
        <div class="card-body">
          <?php
            // Consulta para obtener categorías con contador de productos
            $consultaCategorias = "
              SELECT c.id, c.nombre, 
                     COUNT(p.id) as total_productos,
                     COALESCE(SUM(p.stock), 0) as total_stock,
                     COALESCE(AVG(p.precio), 0) as precio_promedio
              FROM Categorias c 
              LEFT JOIN Productos p ON c.id = p.id_categoria 
              GROUP BY c.id, c.nombre 
              ORDER BY c.nombre ASC
            ";
            $stmtCategorias = mysqli_query($conexion, $consultaCategorias);

            if(mysqli_num_rows($stmtCategorias) > 0):
          ?>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre de Categoría</th>
                    <th>Productos</th>
                    <th>Stock Total</th>
                    <th>Precio Promedio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <?php while($categoria = mysqli_fetch_array($stmtCategorias)): 
                    // Determinar el color del badge según cantidad de productos
                    $badgeClass = '';
                    if($categoria['total_productos'] == 0){
                        $badgeClass = 'bg-secondary';
                    } elseif($categoria['total_productos'] <= 3){
                        $badgeClass = 'bg-warning text-dark';
                    } elseif($categoria['total_productos'] <= 7){
                        $badgeClass = 'bg-info';
                    } else {
                        $badgeClass = 'bg-success';
                    }
                  ?>
                    <tr>
                      <td><?php echo $categoria['id']; ?></td>
                      <td>
                        <strong><?php echo $categoria['nombre']; ?></strong>
                      </td>
                      <td>
                        <span class="badge <?php echo $badgeClass; ?>">
                          <?php echo $categoria['total_productos']; ?> 
                          <?php echo $categoria['total_productos'] == 1 ? 'producto' : 'productos'; ?>
                        </span>
                      </td>
                      <td>
                        <?php if($categoria['total_stock'] > 0): ?>
                          <span class="text-success fw-bold"><?php echo $categoria['total_stock']; ?> unidades</span>
                        <?php else: ?>
                          <span class="text-muted">Sin stock</span>
                        <?php endif; ?>
                      </td>
                      <td>
                        <?php if($categoria['precio_promedio'] > 0): ?>
                          $<?php echo number_format($categoria['precio_promedio'], 2); ?>
                        <?php else: ?>
                          <span class="text-muted">N/A</span>
                        <?php endif; ?>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm" role="group">
                          <button type="button" class="btn btn-outline-primary" title="Ver productos">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button type="button" class="btn btn-outline-warning" title="Editar">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button type="button" class="btn btn-outline-danger" title="Eliminar">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  <?php endwhile; ?>
                </tbody>
              </table>
            </div>
          <?php else: ?>
            <div class="alert alert-info text-center">
              <i class="bi bi-info-circle fs-1 d-block mb-2"></i>
              <h5>No hay categorías registradas</h5>
              <p class="mb-0">Agrega tu primera categoría haciendo clic en "Nueva Categoría"</p>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <!-- Modal para agregar nueva categoría -->
      <div class="modal fade" id="modalAgregarCategoria" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Agregar Nueva Categoría</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formAgregarCategoria">
                <div class="mb-3">
                  <label for="nombreCategoria" class="form-label">Nombre de la Categoría</label>
                  <input type="text" class="form-control" id="nombreCategoria" name="nombre" required>
                  <div class="form-text">Ingresa un nombre descriptivo para la categoría</div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" form="formAgregarCategoria" class="btn btn-success">Guardar Categoría</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
