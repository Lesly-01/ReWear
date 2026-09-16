<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    // Consulta las prendas ordenadas de la más reciente a la más antigua
    $stmt = $pdo->query("SELECT * FROM prendas_portafolio ORDER BY id_prenda DESC");
    $prendas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $prendas
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener datos: ' . $e->getMessage()
    ]);
}
?>