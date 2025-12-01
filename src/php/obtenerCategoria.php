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
    
    // Obtener datos de la categoría
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
    
    // Obtener cantidad de productos asociados
    $consultaProductos = "SELECT COUNT(*) as total FROM Productos WHERE id_categoria = ?";
    $stmtProductos = mysqli_prepare($conexion, $consultaProductos);
    mysqli_stmt_bind_param($stmtProductos, "i", $id);
    mysqli_stmt_execute($stmtProductos);
    $resultadoProductos = mysqli_stmt_get_result($stmtProductos);
    $conteoProductos = mysqli_fetch_assoc($resultadoProductos);
    
    echo json_encode([
        'success' => true,
        'categoria' => $categoria,
        'productos_asociados' => $conteoProductos['total']
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