<?php
header('Content-Type: application/json');
require_once("../config/conexion.php");

$database = new Database();
$db = $database->getConnection();

try {
    // Seleccionamos todos los campos necesarios para renderizar la tarjeta
    $sql = "SELECT s.id_solicitud, s.titulo, s.tipo_prenda, s.metodo, s.instrucciones, 
                   s.presupuesto_min, s.presupuesto_max, s.foto_prenda, s.estado, 
                   s.fecha_publicacion, u.nombre AS comprador 
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