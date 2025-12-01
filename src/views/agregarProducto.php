<?php
  include '../../includes/validar_sesion.php';
  include '../php/conexion.php';
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Agregar Producto</title>
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
            <li class="nav-item"><a class="nav-link" href="productos.php">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="categorias.php">Categorías</a></li>
            <li class="nav-item"><a class="nav-link active" href="agregarProducto.php">Agregar</a></li>
            <li class="nav-item"><a class="nav-link text-danger" href="../php/logout.php"><i class="bi bi-box-arrow-right"></i> Salir</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8">
          <div class="card">
            <div class="card-header">Agregar nuevo producto</div>
            <div class="card-body">
              <form method="POST" action="../php/guardar.php" id="productForm" name="frm" novalidate>
                <div class="mb-3">
                  <label for="name" class="form-label">Nombre del Producto</label>
                  <input type="text" class="form-control" id="name" name="name">
                  <p class="alert alert-danger mt-2" style="display:none" id="nom">El nombre debe tener más de 2 caracteres y solo letras</p>
                </div>

                <div class="mb-3">
                  <label for="category" class="form-label">Categoría</label>
                  <select id="category" name="category" class="form-select">
                    <option value="">-- Seleccionar categoría --</option>
                    <?php 
                      // Obtener categorías desde la base de datos
                      $consultaCategorias = "SELECT id, nombre FROM Categorias ORDER BY nombre ASC";
                      $resultadoCategorias = mysqli_query($conexion, $consultaCategorias);
                      
                      if ($resultadoCategorias && mysqli_num_rows($resultadoCategorias) > 0) {
                        while ($categoria = mysqli_fetch_assoc($resultadoCategorias)) {
                          echo '<option value="' . $categoria['id'] . '">' . htmlspecialchars($categoria['nombre']) . '</option>';
                        }
                      } else {
                        echo '<option value="" disabled>No hay categorías disponibles</option>';
                      }
                    ?>
                  </select>
                  <p class="alert alert-danger mt-2" style="display:none" id="cat">Debe seleccionar una categoría</p>
                </div>

                <div class="row g-3">
                  <div class="col-6">
                    <label for="quantity" class="form-label">Cantidad (Stock)</label>
                    <input type="text" class="form-control" id="quantity" name="quantity">
                    <p class="alert alert-danger mt-2" style="display:none" id="cant">La cantidad debe ser un número válido (0 o mayor)</p>
                  </div>
                  <div class="col-6">
                    <label for="price" class="form-label">Precio</label>
                    <input type="text" class="form-control" id="price" name="price">
                    <p class="alert alert-danger mt-2" style="display:none" id="prec">El precio debe ser un número válido mayor a 0</p>
                  </div>
                </div>

                <div class="mt-4 d-flex gap-2">
                  <button type="button" id="btnEnviar" class="btn btn-primary">Guardar Producto</button>
                  <a href="productos.php" class="btn btn-outline-secondary">Cancelar</a>
                </div>
                
                <!-- Mensaje de éxito -->
                <p class="alert alert-success mt-3" style="display:none" id="btn">Producto guardado exitosamente. Redirigiendo...</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../assets/js/agregarProducto.js"></script>
  </body>
</html>
