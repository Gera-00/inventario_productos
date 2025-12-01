<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea GET y que exista el ID
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de categoría inválido'
        ]);
        exit();
    }
    
    // Verificar que la categoría existe y obtener su información
    $consultaCategoria = "SELECT id, nombre FROM Categorias WHERE id = ?";
    $stmtCategoria = mysqli_prepare($conexion, $consultaCategoria);
    mysqli_stmt_bind_param($stmtCategoria, "i", $id);
    mysqli_stmt_execute($stmtCategoria);
    $resultadoCategoria = mysqli_stmt_get_result($stmtCategoria);
    
    if (mysqli_num_rows($resultadoCategoria) == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'La categoría no existe'
        ]);
        exit();
    }
    
    $categoria = mysqli_fetch_assoc($resultadoCategoria);
    
    // Obtener todos los productos de esta categoría
    $consultaProductos = "SELECT id, nombre, stock, precio FROM Productos WHERE id_categoria = ? ORDER BY nombre ASC";
    $stmtProductos = mysqli_prepare($conexion, $consultaProductos);
    mysqli_stmt_bind_param($stmtProductos, "i", $id);
    mysqli_stmt_execute($stmtProductos);
    $resultadoProductos = mysqli_stmt_get_result($stmtProductos);
    
    $productos = [];
    $totalStock = 0;
    $valorTotal = 0;
    $conteoProductos = 0;
    
    while ($producto = mysqli_fetch_assoc($resultadoProductos)) {
        $productos[] = $producto;
        $totalStock += $producto['stock'];
        $valorTotal += ($producto['stock'] * $producto['precio']);
        $conteoProductos++;
    }
    
    // Calcular estadísticas
    $precioPromedio = $conteoProductos > 0 ? $valorTotal / $totalStock : 0;
    
    echo json_encode([
        'success' => true,
        'categoria' => $categoria,
        'productos' => $productos,
        'estadisticas' => [
            'total_productos' => $conteoProductos,
            'total_stock' => $totalStock,
            'valor_total' => $valorTotal,
            'precio_promedio' => $precioPromedio
        ]
    ]);
    
    mysqli_stmt_close($stmtCategoria);
    mysqli_stmt_close($stmtProductos);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>