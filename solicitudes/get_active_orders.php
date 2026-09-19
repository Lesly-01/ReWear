<?php
header("Content-Type: application/json");
include '../config/conexion.php';
session_start();

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["success" => false, "message" => "No session found"]);
    exit;
}

$id_disenador = $_SESSION['id_usuario'];

try {
    // Unimos postulaciones con solicitudes para obtener los detalles del pedido
    // Filtramos solo aquellas que el diseñador ha aceptado
    $sql = "SELECT p.id_postulacion, p.estado as estado_postulacion, p.fecha_postulacion,
                   s.titulo, s.instrucciones, s.descripcion, s.presupuesto_max, s.foto_prenda,
                   u.username as comprador
            FROM postulaciones p
            JOIN solicitudes s ON p.id_solicitud = s.id_solicitud
            JOIN usuarios u ON s.id_usuario = u.id_usuario
            WHERE p.id_disenador = ? AND p.estado = 'aceptada'";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_disenador);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode(["success" => true, "data" => $orders]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
