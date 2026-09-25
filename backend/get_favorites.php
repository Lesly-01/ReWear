<?php
session_start();
header('Content-Type: application/json');

// Incluimos la conexión subiendo un nivel desde la carpeta 'backend' hacia 'config'
require_once '../config/conexion.php';

// Verificar que el usuario tenga una sesión activa
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

// Consulta adaptada a la tabla 'prendas_portafolio'
$sql = "SELECT p.id_prenda, p.titulo, p.precio_minimo, p.precio_maximo, p.imagen_url 
        FROM favoritos f
        INNER JOIN prendas_portafolio p ON f.id_prenda = p.id_prenda
        WHERE f.id_usuario = ?
        ORDER BY f.fecha_guardado DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode($favorites);
?>