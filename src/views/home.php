<?php
    include '../../includes/validar_sesion.php';
    include '../php/conexion.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <title>Sistema de Inventario</title>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Inventario - Dashboard</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="assets/css/styles.css">
    </head>
    <body class="d-flex flex-column min-vh-100">
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
                        <li class="nav-item"><a class="nav-link" href="agregarProducto.php">Agregar</a></li>
                        <li class="nav-item"><a class="nav-link text-danger" href="../php/logout.php"><i class="bi bi-box-arrow-right"></i> Salir</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <?php  
            // Consultas para obtener estadísticas del dashboard
            
            // 1. Total de productos
            $consultaTotal = "SELECT COUNT(*) as total FROM Productos";
            $stmtTotal = mysqli_query($conexion, $consultaTotal);
            $totalProductos = mysqli_fetch_array($stmtTotal)['total'];
            
            // 2. Total de categorías
            $consultaCategorias = "SELECT COUNT(*) as total FROM Categorias";
            $stmtCategorias = mysqli_query($conexion, $consultaCategorias);
            $totalCategorias = mysqli_fetch_array($stmtCategorias)['total'];
            
            // 3. Productos con stock bajo (<=10)
            $consultaStockBajo = "SELECT COUNT(*) as total FROM Productos WHERE stock <= 10";
            $stmtStockBajo = mysqli_query($conexion, $consultaStockBajo);
            $productosStockBajo = mysqli_fetch_array($stmtStockBajo)['total'];
            
            // 4. Crear array de categorías para las alertas
            $categorias = array();
            $consultaCat = "SELECT id, nombre FROM Categorias";
            $stmtCat = mysqli_query($conexion, $consultaCat);
            while($cat = mysqli_fetch_array($stmtCat)){
                $categorias[$cat['id']] = $cat['nombre'];
            }
            
            // 5. Productos críticos para alertas (stock <= 10)
            $consultaAlertas = "SELECT * FROM Productos WHERE stock <= 10 ORDER BY stock ASC LIMIT 10";
            $stmtAlertas = mysqli_query($conexion, $consultaAlertas);
        ?>
        
        <main class="container my-4">
            <div class="row g-3">
                <div class="col-12 col-lg-8">
                    <div class="row g-3">
                        <div class="col-12 col-md-4">
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column">
                                    <h6 class="card-title">Total productos</h6>
                                    <h3 class="display-6 mt-auto"><?php echo $totalProductos; ?></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column">
                                    <h6 class="card-title">Categorías</h6>
                                    <h3 class="display-6 mt-auto"><?php echo $totalCategorias; ?></h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="card h-100 border-warning">
                                <div class="card-body d-flex flex-column">
                                    <h6 class="card-title">Productos con stock bajo</h6>
                                    <h3 class="display-6 text-danger mt-auto"><?php echo $productosStockBajo; ?></h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section class="mt-3">
                        <div class="card">
                            <div class="card-header">Alertas de stock</div>
                            <div class="card-body">
                                <?php if(mysqli_num_rows($stmtAlertas) > 0): ?>
                                    <ul class="list-group">
                                        <?php while($alerta = mysqli_fetch_array($stmtAlertas)): 
                                            // Determinar el color del badge según el stock
                                            $badgeClass = '';
                                            $textoUnidades = '';
                                            
                                            if($alerta['stock'] <= 3){
                                                $badgeClass = 'bg-danger';
                                                $textoUnidades = $alerta['stock'] . ($alerta['stock'] == 1 ? ' unidad' : ' unidades');
                                            } elseif($alerta['stock'] <= 10){
                                                $badgeClass = 'bg-warning text-dark';
                                                $textoUnidades = $alerta['stock'] . ' unidades';
                                            }
                                        ?>
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong><?php echo $alerta['nombre']; ?></strong>
                                                    <small class="text-muted d-block">
                                                        <?php echo isset($categorias[$alerta['id_categoria']]) ? $categorias[$alerta['id_categoria']] : 'Sin categoría'; ?>
                                                    </small>
                                                </div>
                                                <span class="badge <?php echo $badgeClass; ?>"><?php echo $textoUnidades; ?></span>
                                            </li>
                                        <?php endwhile; ?>
                                    </ul>
                                <?php else: ?>
                                    <div class="alert alert-success mb-0">
                                        <i class="bi bi-check-circle"></i> ¡Excelente! Todos los productos tienen stock suficiente.
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </section>
                </div>

                <aside class="col-12 col-lg-4">
                    <div class="card mb-3">
                        <div class="card-header">Resumen rápido</div>
                        <div class="card-body">
                            <?php 
                                // Obtener estadísticas adicionales
                                $consultaValorTotal = "SELECT SUM(stock * precio) as valor_total FROM Productos";
                                $stmtValor = mysqli_query($conexion, $consultaValorTotal);
                                $valorInventario = mysqli_fetch_array($stmtValor)['valor_total'];
                                
                                $consultaPromedio = "SELECT AVG(precio) as precio_promedio FROM Productos";
                                $stmtPromedio = mysqli_query($conexion, $consultaPromedio);
                                $precioPromedio = mysqli_fetch_array($stmtPromedio)['precio_promedio'];
                            ?>
                            <p class="mb-1">Última actualización: <strong><?php echo date('d/m/Y H:i'); ?></strong></p>
                            <hr>
                            <div class="row text-center">
                                <div class="col-6">
                                    <small class="text-muted">Valor total inventario</small>
                                    <div class="fw-bold text-primary">$<?php echo number_format($valorInventario, 2); ?></div>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Precio promedio</small>
                                    <div class="fw-bold text-info">$<?php echo number_format($precioPromedio, 2); ?></div>
                                </div>
                            </div>
                            <hr>
                            <p class="small text-muted mb-0">Navega a 'Productos' para ver la tabla completa o a 'Agregar' para crear un nuevo producto.</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Atajos</div>
                        <div class="card-body d-grid gap-2">
                            <a href="agregarProducto.php" class="btn btn-success">
                                <i class="bi bi-plus-circle"></i> Agregar Producto
                            </a>
                            <a href="productos.php" class="btn btn-outline-primary">
                                <i class="bi bi-list-ul"></i> Ver Productos
                            </a>
                            <a href="categorias.php" class="btn btn-outline-secondary">
                                <i class="bi bi-tags"></i> Gestionar Categorías
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <footer class="text-center py-3 mt-auto">
            <small class="text-muted">Sistema de inventario — By. Gerar2</small>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>