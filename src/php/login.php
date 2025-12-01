<?php
session_start(); // Siempre al inicio

// Si ya está logueado, redirigir
if (isset($_SESSION['logueado']) && $_SESSION['logueado'] === true) {
    header("Location: ../views/home.php");
    exit();
}

include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $contrasenia = $_POST['contrasenia'] ?? '';
    
    if (empty($usuario) || empty($contrasenia)) {
        // Campos vacíos - redirigir con mensaje
        echo "<script>alert('Todos los campos son obligatorios'); window.location.href='../../index.html';</script>";
        exit();
    } else {
        // Buscar usuario primero
        $consulta = "SELECT id, nombre, usuario, contrasenia FROM Usuarios WHERE usuario = ?";
        $stmt = mysqli_prepare($conexion, $consulta);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $usuario);
            mysqli_stmt_execute($stmt);
            $resultado = mysqli_stmt_get_result($stmt);
            
            if ($user_data = mysqli_fetch_assoc($resultado)) {
                if ($contrasenia === $user_data['contrasenia']) {
                    // Regenerar ID de sesión por seguridad
                    session_regenerate_id(true);
                    
                    // Establecer variables de sesión
                    $_SESSION['logueado'] = true;
                    $_SESSION['usuario_id'] = $user_data['id'];
                    $_SESSION['usuario'] = $user_data['usuario'];
                    $_SESSION['nombre'] = $user_data['nombre'];
                    $_SESSION['ultimo_acceso'] = time();

                    sleep(2.5);
                    header("Location: ../views/home.php");
                    exit();
                } else {
                    // Contraseña incorrecta - redirigir con mensaje
                    echo "<script>alert('Usuario o contraseña incorrectos'); window.location.href='../../index.html';</script>";
                    exit();
                }
            } else {
                // Usuario no encontrado - redirigir con mensaje
                echo "<script>alert('Usuario o contraseña incorrectos'); window.location.href='../../index.html';</script>";
                exit();
            }
            mysqli_stmt_close($stmt);
        } else {
            // Error en la consulta - redirigir con mensaje
            echo "<script>alert('Error del sistema. Intente nuevamente'); window.location.href='../../index.html';</script>";
            exit();
        }
    }
} else {
    // Si acceden directamente al archivo sin POST, redirigir al login
    header("Location: ../../index.html");
    exit();
}
?>