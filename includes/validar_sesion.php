<?php
session_start(); // Necesario para leer la sesión

// Verificar si el usuario está logueado
if (!isset($_SESSION['logueado']) || $_SESSION['logueado'] !== true) {
    // No hay sesión activa: redirigir al login
    header('Location: ../../index.html');
    exit;
}
?>