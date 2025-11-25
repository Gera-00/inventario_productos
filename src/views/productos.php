<?php
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
        <a class="navbar-brand" href="home.html">
          <i class="bi bi-building-fill fs-3"></i>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="home.php">Inicio</a></li>
            <li class="nav-item"><a class="nav-link active" href="productos.php">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="categorias.php">Categorías</a></li>
            <li class="nav-item"><a class="nav-link" href="agregarProducto.html">Agregar</a></li>
            <li class="nav-item"><a class="nav-link text-danger" href="../../includes/sesion.php?action=logout"><i class="bi bi-box-arrow-right"></i> Salir</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Productos</h3>
        <a href="agregarProducto.html" class="btn btn-success">+ Nuevo</a>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
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
                        <tr>
                          <td><?php echo $fila['id'] ?></td>
                          <td><?php echo $fila['nombre'] ?></td>
                          <td><?php echo isset($categorias[$fila['id_categoria']]) ? $categorias[$fila['id_categoria']] : 'Sin categoría'; ?></td>
                          <td class="<?php echo $fila['stock'] <= 10 ? 'text-danger' : 'text-success'; ?>"><?php echo $fila['stock'] ?></td>
                          <td>$<?php echo number_format($fila['precio'], 2) ?></td>
                          <td><span class="badge <?php echo $claseStock; ?>"><?php echo $estadoStock; ?></span></td>
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
  </body>
+</html>
