<?php
include 'conexion.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Obtener datos del formulario (ya validados por JavaScript)
    $nombre = trim($_POST['name']);
    $categoria = intval($_POST['category']);
    $stock = intval($_POST['quantity']);
    $precio = floatval($_POST['price']);
    
    // Insertar el nuevo producto usando prepared statements
    $query = "INSERT INTO Productos (nombre, id_categoria, stock, precio) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($conexion, $query);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "siid", $nombre, $categoria, $stock, $precio);
        
        if (mysqli_stmt_execute($stmt)) {
            // Éxito: redirigir a productos con mensaje
            echo "<script>alert('¡Producto agregado exitosamente!'); window.location.href='../views/productos.php';</script>";
        } else {
            // Error al insertar
            echo "<script>alert('Error al guardar el producto. Intente nuevamente.'); window.location.href='../views/agregarProducto.php';</script>";
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo "<script>alert('Error en la consulta. Intente nuevamente.'); window.location.href='../views/agregarProducto.php';</script>";
    }
    
} else {
    // Si no es POST, redirigir al formulario
    header("Location: ../views/agregarProducto.php");
    exit();
}
?>