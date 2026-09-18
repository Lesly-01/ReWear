<?php
header('Content-Type: application/json');
require_once("../config/conexion.php");

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "SELECT p.*, u.nombre as disenador 
            FROM prendas_portafolio p 
            LEFT JOIN usuarios u ON p.id_disenador = u.id_usuario 
            ORDER BY p.id_prenda DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $prendas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $prendas
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener publicaciones: ' . $e->getMessage()
    ]);
}
?>