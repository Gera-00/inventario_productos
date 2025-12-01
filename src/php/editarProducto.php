<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = (int)$_POST['id'];
    $nombre = trim($_POST['nombre']);
    $categoria = (int)$_POST['categoria'];
    $stock = (int)$_POST['stock'];
    $precio = (float)$_POST['precio'];
    
    // Validaciones
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de producto inválido'
        ]);
        exit();
    }
    
    if (empty($nombre) || strlen($nombre) < 3) {
        echo json_encode([
            'success' => false,
            'message' => 'El nombre debe tener al menos 3 caracteres'
        ]);
        exit();
    }
    
    if ($categoria <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Debe seleccionar una categoría válida'
        ]);
        exit();
    }
    
    if ($stock < 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El stock no puede ser negativo'
        ]);
        exit();
    }
    
    if ($precio <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El precio debe ser mayor a 0'
        ]);
        exit();
    }
    
    // Verificar que el producto existe
    $consultaVerificar = "SELECT id FROM Productos WHERE id = ?";
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
    
    // Verificar que la categoría existe
    $consultaCategoria = "SELECT id FROM Categorias WHERE id = ?";
    $stmtCategoria = mysqli_prepare($conexion, $consultaCategoria);
    mysqli_stmt_bind_param($stmtCategoria, "i", $categoria);
    mysqli_stmt_execute($stmtCategoria);
    $resultadoCategoria = mysqli_stmt_get_result($stmtCategoria);
    
    if (mysqli_num_rows($resultadoCategoria) == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'La categoría seleccionada no existe'
        ]);
        exit();
    }
    
    // Verificar que no exista otro producto con el mismo nombre (excepto el actual)
    $consultaNombre = "SELECT id FROM Productos WHERE nombre = ? AND id != ?";
    $stmtNombre = mysqli_prepare($conexion, $consultaNombre);
    mysqli_stmt_bind_param($stmtNombre, "si", $nombre, $id);
    mysqli_stmt_execute($stmtNombre);
    $resultadoNombre = mysqli_stmt_get_result($stmtNombre);
    
    if (mysqli_num_rows($resultadoNombre) > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Ya existe otro producto con ese nombre'
        ]);
        exit();
    }
    
    // Actualizar el producto
    $consultaActualizar = "UPDATE Productos SET nombre = ?, id_categoria = ?, stock = ?, precio = ? WHERE id = ?";
    $stmtActualizar = mysqli_prepare($conexion, $consultaActualizar);
    mysqli_stmt_bind_param($stmtActualizar, "siidi", $nombre, $categoria, $stock, $precio, $id);
    
    if (mysqli_stmt_execute($stmtActualizar)) {
        echo json_encode([
            'success' => true,
            'message' => 'Producto "' . $nombre . '" actualizado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al actualizar el producto: ' . mysqli_error($conexion)
        ]);
    }
    
    mysqli_stmt_close($stmtActualizar);
    mysqli_stmt_close($stmtVerificar);
    mysqli_stmt_close($stmtCategoria);
    mysqli_stmt_close($stmtNombre);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>