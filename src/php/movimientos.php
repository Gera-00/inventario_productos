<?php
include '../../includes/validar_sesion.php';
include 'conexion.php';

// Verificar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = (int)$_POST['id'];
    $tipo = $_POST['tipo']; // 'entrada' o 'salida'
    $cantidad = (int)$_POST['cantidad'];
    
    // Validaciones
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de producto inválido'
        ]);
        exit();
    }
    
    if (!in_array($tipo, ['entrada', 'salida'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Tipo de movimiento inválido'
        ]);
        exit();
    }
    
    if ($cantidad <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'La cantidad debe ser mayor a 0'
        ]);
        exit();
    }
    
    // Obtener información del producto actual
    $consultaProducto = "SELECT id, nombre, stock FROM Productos WHERE id = ?";
    $stmtProducto = mysqli_prepare($conexion, $consultaProducto);
    mysqli_stmt_bind_param($stmtProducto, "i", $id);
    mysqli_stmt_execute($stmtProducto);
    $resultado = mysqli_stmt_get_result($stmtProducto);
    
    if (mysqli_num_rows($resultado) == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El producto no existe'
        ]);
        exit();
    }
    
    $producto = mysqli_fetch_assoc($resultado);
    $stockActual = $producto['stock'];
    
    // Calcular nuevo stock
    if ($tipo == 'entrada') {
        $nuevoStock = $stockActual + $cantidad;
    } else { // salida
        $nuevoStock = $stockActual - $cantidad;
        
        // Verificar que no quede stock negativo
        if ($nuevoStock < 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Stock insuficiente. Stock actual: ' . $stockActual
            ]);
            exit();
        }
    }
    
    // Actualizar el stock del producto
    $consultaActualizar = "UPDATE Productos SET stock = ? WHERE id = ?";
    $stmtActualizar = mysqli_prepare($conexion, $consultaActualizar);
    mysqli_stmt_bind_param($stmtActualizar, "ii", $nuevoStock, $id);
    
    if (mysqli_stmt_execute($stmtActualizar)) {
        echo json_encode([
            'success' => true,
            'message' => ucfirst($tipo) . ' registrada correctamente. Nuevo stock: ' . $nuevoStock,
            'nuevoStock' => $nuevoStock,
            'stockAnterior' => $stockActual,
            'cantidad' => $cantidad,
            'tipo' => $tipo
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al actualizar el stock: ' . mysqli_error($conexion)
        ]);
    }
    
    mysqli_stmt_close($stmtActualizar);
    mysqli_stmt_close($stmtProducto);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

mysqli_close($conexion);
?>