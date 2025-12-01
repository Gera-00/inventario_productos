<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = (int)$_POST['id'];
    $nombre = trim($_POST['nombre']);
    
    // Validaciones
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de categoría inválido'
        ]);
        exit();
    }
    
    if (empty($nombre) || strlen($nombre) < 2) {
        echo json_encode([
            'success' => false,
            'message' => 'El nombre debe tener al menos 2 caracteres'
        ]);
        exit();
    }
    
    // Verificar que la categoría existe
    $consultaVerificar = "SELECT id FROM Categorias WHERE id = ?";
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
    
    // Verificar que no exista otra categoría con el mismo nombre (excepto la actual)
    $consultaNombre = "SELECT id FROM Categorias WHERE nombre = ? AND id != ?";
    $stmtNombre = mysqli_prepare($conexion, $consultaNombre);
    mysqli_stmt_bind_param($stmtNombre, "si", $nombre, $id);
    mysqli_stmt_execute($stmtNombre);
    $resultadoNombre = mysqli_stmt_get_result($stmtNombre);
    
    if (mysqli_num_rows($resultadoNombre) > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Ya existe otra categoría con ese nombre'
        ]);
        exit();
    }
    
    // Actualizar la categoría
    $consultaActualizar = "UPDATE Categorias SET nombre = ? WHERE id = ?";
    $stmtActualizar = mysqli_prepare($conexion, $consultaActualizar);
    mysqli_stmt_bind_param($stmtActualizar, "si", $nombre, $id);
    
    if (mysqli_stmt_execute($stmtActualizar)) {
        echo json_encode([
            'success' => true,
            'message' => 'Categoría "' . $nombre . '" actualizada correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al actualizar la categoría: ' . mysqli_error($conexion)
        ]);
    }
    
    mysqli_stmt_close($stmtActualizar);
    mysqli_stmt_close($stmtVerificar);
    mysqli_stmt_close($stmtNombre);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>