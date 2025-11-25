<?php
// Función para verificar si el usuario está logueado
function verificar_sesion() {
    session_start();
    if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['usuario'])) {
        header('Location: ../index.html');
        exit();
    }
}

// Función para cerrar sesión
function cerrar_sesion() {
    session_start();
    session_unset(); // Limpiar todas las variables de sesión
    session_destroy(); // Destruir la sesión
    header('Location: ../index.html');
    exit();
}

// Si se recibe la acción de logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    cerrar_sesion();
}
?>