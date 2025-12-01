<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = (int)$_POST['id'];
    
    // Validaciones
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de categoría inválido'
        ]);
        exit();
    }
    
    // Verificar que la categoría existe
    $consultaVerificar = "SELECT id, nombre FROM Categorias WHERE id = ?";
    $stmtVerificar = mysqli_prepare($conexion, $consultaVerificar);
    mysqli_stmt_bind_param($stmtVerificar, "i", $id);
    mysqli_stmt_execute($stmtVerificar);
    $resultado = mysqli_stmt_get_result($stmtVerificar);
    
    if (mysqli_num_rows($resultado) == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'La categoría no existe'
        ]);
        exit();
    }
    
    $categoria = mysqli_fetch_assoc($resultado);
    
    // Verificar que no tenga productos asociados
    $consultaProductos = "SELECT COUNT(*) as total FROM Productos WHERE id_categoria = ?";
    $stmtProductos = mysqli_prepare($conexion, $consultaProductos);
    mysqli_stmt_bind_param($stmtProductos, "i", $id);
    mysqli_stmt_execute($stmtProductos);
    $resultadoProductos = mysqli_stmt_get_result($stmtProductos);
    $conteoProductos = mysqli_fetch_assoc($resultadoProductos);
    
    if ($conteoProductos['total'] > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'No se puede eliminar la categoría porque tiene ' . $conteoProductos['total'] . ' producto(s) asociado(s). Primero debe reasignar o eliminar los productos.'
        ]);
        exit();
    }
    
    // Eliminar la categoría
    $consultaEliminar = "DELETE FROM Categorias WHERE id = ?";
    $stmtEliminar = mysqli_prepare($conexion, $consultaEliminar);
    mysqli_stmt_bind_param($stmtEliminar, "i", $id);
    
    if (mysqli_stmt_execute($stmtEliminar)) {
        echo json_encode([
            'success' => true,
            'message' => 'Categoría "' . $categoria['nombre'] . '" eliminada correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al eliminar la categoría: ' . mysqli_error($conexion)
        ]);
    }
    
    mysqli_stmt_close($stmtEliminar);
    mysqli_stmt_close($stmtVerificar);
    mysqli_stmt_close($stmtProductos);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>