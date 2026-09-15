<?php
header("Content-Type: application/json; charset=UTF-8");
session_start();

if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        "authenticated" => true,
        "user" => [
            "id"     => $_SESSION['id_usuario'],
            "nombre" => $_SESSION['nombre'],
            "correo" => $_SESSION['correo'],
            "rol"    => $_SESSION['rol']
        ]
    ]);
} else {
    echo json_encode([
        "authenticated" => false,
        "message"       => "No active session."
    ]);
}
?>