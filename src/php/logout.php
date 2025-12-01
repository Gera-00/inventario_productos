<?php
// Iniciar la sesión para poder destruirla
session_start();

// Verificar si existe una sesión activa
if (isset($_SESSION['logueado']) && $_SESSION['logueado'] === true) {
    // Limpiar todas las variables de sesión
    $_SESSION = array();
    
    // Destruir la cookie de sesión si existe
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destruir la sesión completamente
    session_destroy();
    
    // Regenerar ID de sesión por seguridad (para nueva sesión)
    session_start();
    session_regenerate_id(true);
    session_destroy();
}

// Redireccionar al login con mensaje de confirmación
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
header("Location: ../../index.html?logout=success");
exit();
?>