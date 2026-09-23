<?php
// Deshabilitar la visualización de errores en la salida para evitar corromper el JSON
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
require_once("../config/conexion.php");

try {
    $database = new Database();
    $db = $database->getConnection();

    // Verificar si se solicitó un ID específico
    $id_solicitud = isset($_GET['id']) ? $_GET['id'] : null;

    if ($id_solicitud) {
        // Consulta para una sola solicitud
        $sql = "SELECT s.id_solicitud, s.titulo, s.tipo_prenda, s.metodo, s.instrucciones,
                       s.presupuesto_min, s.presupuesto_max, s.foto_prenda, s.estado,
                       s.fecha_publicacion, u.nombre AS comprador
                FROM solicitudes s
                LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
                WHERE s.id_solicitud = :id
                LIMIT 1";

        $stmt = $db->prepare($sql);
        $stmt->bindValue(':id', $id_solicitud, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            echo json_encode(['success' => false, 'message' => 'No se encontró la solicitud con el ID proporcionado.']);
            exit;
        }

        echo json_encode(['success' => true, 'data' => $data]);

    } else {
        // Consulta para todas las solicitudes
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
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>