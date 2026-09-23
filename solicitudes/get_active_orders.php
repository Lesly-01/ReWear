<?php
header("Content-Type: application/json");
require_once '../config/conexion.php';
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "message" => "No session found"]);
    exit;
}

$id_disenador = $_SESSION['id_usuario'];

try {
    $database = new Database();
    $db = $database->getConnection();

    // Unimos postulaciones con solicitudes para obtener los detalles del pedido
    // Filtramos solo aquellas que el diseñador ha aceptado
    $sql = "SELECT p.id_postulacion, p.estado as estado_postulacion, p.fecha as fecha_postulacion,
                   s.titulo, s.instrucciones, s.descripcion, s.presupuesto_max, s.foto_prenda,
                   u.nombre as comprador
            FROM postulaciones p
            JOIN solicitudes s ON p.id_solicitud = s.id_solicitud
            JOIN usuarios u ON s.id_usuario = u.id_usuario
            WHERE p.id_disenador = ? AND p.estado = 'accepted'",";

    $stmt = $db->prepare($sql);
    $stmt->execute([$id_disenador]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $orders]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
