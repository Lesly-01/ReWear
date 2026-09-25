<?php
header('Content-Type: application/json');
require_once("../config/conexion.php");
session_start();

try {
    $database = new Database();
    $db = $database->getConnection();

    $id_profile = isset($_GET['id']) ? $_GET['id'] : null;

    if (!$id_profile) {
        echo json_encode(['success' => false, 'message' => 'No profile ID provided']);
        exit;
    }

    // Obtenemos datos del usuario y su perfil de diseñador
    $sql = "SELECT u.id_usuario, u.nombre, u.correo, p.biografia, p.rango_precio_desde, p.rango_precio_hasta, p.foto_perfil
            FROM usuarios u
            JOIN perfiles_disenador p ON u.id_usuario = p.id_usuario
            WHERE u.id_usuario = :id LIMIT 1";

    $stmt = $db->prepare($sql);
    $stmt->execute([':id' => $id_profile]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Profile not found']);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>