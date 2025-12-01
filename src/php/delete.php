<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea POST y que exista el ID
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'])) {
    $id = (int)$_POST['id'];
    
    // Validar que el ID sea válido
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de producto inválido'
        ]);
        exit();
    }
    
    // Verificar que el producto existe
    $consultaVerificar = "SELECT id, nombre FROM Productos WHERE id = ?";
    $stmtVerificar = mysqli_prepare($conexion, $consultaVerificar);
    mysqli_stmt_bind_param($stmtVerificar, "i", $id);
    mysqli_stmt_execute($stmtVerificar);
    $resultado = mysqli_stmt_get_result($stmtVerificar);
    
    if (mysqli_num_rows($resultado) == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El producto no existe'
        ]);
        exit();
    }
    
    $producto = mysqli_fetch_assoc($resultado);
    
    // Eliminar el producto
    $consultaEliminar = "DELETE FROM Productos WHERE id = ?";
    $stmtEliminar = mysqli_prepare($conexion, $consultaEliminar);
    mysqli_stmt_bind_param($stmtEliminar, "i", $id);
    
    if (mysqli_stmt_execute($stmtEliminar)) {
        echo json_encode([
            'success' => true,
            'message' => 'Producto "' . $producto['nombre'] . '" eliminado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al eliminar el producto: ' . mysqli_error($conexion)
        ]);
    }
    
    mysqli_stmt_close($stmtEliminar);
    mysqli_stmt_close($stmtVerificar);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>