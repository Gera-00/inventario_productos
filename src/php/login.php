<?php
    include 'conexion.php';
?>

<?php 
    $usuario = isset($_POST['usuario']) ? $_POST['usuario'] : '';
    $contrasenia = isset($_POST['contrasenia']) ? $_POST['contrasenia'] : '';

    // Usar prepared statements para evitar SQL injection
    $consulta = "SELECT * FROM Usuarios WHERE usuario = ? AND contrasenia = ?";
    $stmt = mysqli_prepare($conexion, $consulta);
    
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "ss", $usuario, $contrasenia);
        mysqli_stmt_execute($stmt);
        $credencial = mysqli_stmt_get_result($stmt);
        
        // Verificar si se encontró el usuario
        if (mysqli_num_rows($credencial) > 0) {
            // Usuario encontrado, iniciar sesión
            session_start();
            $user_data = mysqli_fetch_assoc($credencial);
            $_SESSION['usuario_id'] = $user_data['id'];
            $_SESSION['usuario'] = $user_data['usuario'];
            $_SESSION['nombre'] = $user_data['nombre'];
            
            // Redireccionar al home
            header("Location: ../views/home.php");
            exit();
        } else {
            // Credenciales incorrectas
            echo "<script>alert('Usuario o contraseña incorrectos'); window.location.href='../../index.html';</script>";
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo "<script>alert('Error en la consulta'); window.location.href='../../index.html';</script>";
    }
?>