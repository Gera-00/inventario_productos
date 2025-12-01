<?php
include 'conexion.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Obtener datos del formulario (ya validados por JavaScript)
    $nombre = trim($_POST['nombre']);
    
    // Verificar si ya existe una categoría con ese nombre
    $verificarNombre = "SELECT id FROM Categorias WHERE nombre = ?";
    $stmtVerificar = mysqli_prepare($conexion, $verificarNombre);
    
    if ($stmtVerificar) {
        mysqli_stmt_bind_param($stmtVerificar, "s", $nombre);
        mysqli_stmt_execute($stmtVerificar);
        $resultado = mysqli_stmt_get_result($stmtVerificar);
        
        if (mysqli_num_rows($resultado) > 0) {
            // Ya existe una categoría con ese nombre
            echo "<script>alert('Ya existe una categoría con ese nombre'); window.location.href='../views/categorias.php';</script>";
            exit();
        }
        mysqli_stmt_close($stmtVerificar);
    }
    
    // Insertar la nueva categoría usando prepared statements
    $query = "INSERT INTO Categorias (nombre) VALUES (?)";
    $stmt = mysqli_prepare($conexion, $query);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", $nombre);
        
        if (mysqli_stmt_execute($stmt)) {
            // Éxito: redirigir a categorías con mensaje
            echo "<script>alert('¡Categoría agregada exitosamente!'); window.location.href='../views/categorias.php';</script>";
        } else {
            // Error al insertar
            echo "<script>alert('Error al guardar la categoría. Intente nuevamente.'); window.location.href='../views/categorias.php';</script>";
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo "<script>alert('Error en la consulta. Intente nuevamente.'); window.location.href='../views/categorias.php';</script>";
    }
    
} else {
    // Si no es POST, redirigir al formulario
    header("Location: ../views/categorias.php");
    exit();
}
?>