<?php
header('Content-Type: application/json');
require_once("../config/conexion.php");
session_start();

try {
    $database = new Database();
    $db = $database->getConnection();

    $id_prenda = isset($_GET['id']) ? $_GET['id'] : null;

    if (!$id_prenda) {
        echo json_encode(['success' => false, 'message' => 'No ID provided']);
        exit;
    }

    $sql = "SELECT p.id_prenda, p.titulo, p.categoria, p.descripcion,
                   p.precio_minimo, p.precio_maximo, p.imagen_url, p.fecha_creacion,
                   u.nombre as designer_name
            FROM prendas_portafolio p
            JOIN usuarios u ON p.id_disenador = u.id_usuario
            WHERE p.id_prenda = :id LIMIT 1";

    $stmt = $db->prepare($sql);
    $stmt->execute([':id' => $id_prenda]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Item not found']);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>