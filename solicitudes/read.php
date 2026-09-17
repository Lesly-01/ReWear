<?php
header('Content-Type: application/json');
require_once("../config/conexion.php");

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "SELECT s.*, u.nombre AS comprador 
            FROM solicitudes s 
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario 
            ORDER BY s.id_solicitud DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $solicitudes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $solicitudes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>