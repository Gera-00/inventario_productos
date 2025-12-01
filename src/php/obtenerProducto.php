<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea GET y que exista el ID
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de producto inválido'
        ]);
        exit();
    }
    
    // Obtener datos del producto
    $consultaProducto = "SELECT id, nombre, id_categoria, stock, precio FROM Productos WHERE id = ?";
    $stmtProducto = mysqli_prepare($conexion, $consultaProducto);
    mysqli_stmt_bind_param($stmtProducto, "i", $id);
    mysqli_stmt_execute($stmtProducto);
    $resultadoProducto = mysqli_stmt_get_result($stmtProducto);
    
    if (mysqli_num_rows($resultadoProducto) == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El producto no existe'
        ]);
        exit();
    }
    
    $producto = mysqli_fetch_assoc($resultadoProducto);
    
    // Obtener todas las categorías
    $consultaCategorias = "SELECT id, nombre FROM Categorias ORDER BY nombre ASC";
    $resultadoCategorias = mysqli_query($conexion, $consultaCategorias);
    
    $categorias = [];
    while ($categoria = mysqli_fetch_assoc($resultadoCategorias)) {
        $categorias[] = $categoria;
    }
    
    echo json_encode([
        'success' => true,
        'producto' => $producto,
        'categorias' => $categorias
    ]);
    
    mysqli_stmt_close($stmtProducto);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>