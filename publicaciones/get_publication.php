<?php
header('Content-Type: application/json');
require_once '../config/conexion.php'; // Ajusta la ruta a tu conexión

$id_prenda = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id_prenda <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de publicación no válido']);
    exit;
}

try {
    $sql = "SELECT 
                p.id_prenda,
                p.titulo,
                p.descripcion,
                p.precio,
                p.fecha_publicacion,
                u.nombre AS nombre_disenador,
                c.nombre AS categoria_nombre,
                e.nombre AS estilo_nombre,
                pd.rango_precio_desde,
                pd.rango_precio_hasta,
                (SELECT imagen_url FROM imagenes_prenda WHERE id_prenda = p.id_prenda LIMIT 1) AS foto_prenda,
                (SELECT GROUP_CONCAT(t.nombre SEPARATOR ', ') 
                 FROM disenador_tecnica dt 
                 JOIN tecnicas t ON dt.id_tecnica = t.id_tecnica 
                 WHERE dt.id_usuario = p.id_disenador) AS especializaciones
            FROM prendas_publicadas p
            INNER JOIN usuarios u ON p.id_disenador = u.id_usuario
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN estilo e ON p.id_estilo = e.id_estilo
            LEFT JOIN perfiles_disenador pd ON u.id_usuario = pd.id_usuario
            WHERE p.id_prenda = :id_prenda LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id_prenda' => $id_prenda]);
    $publicacion = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($publicacion) {
        echo json_encode(['success' => true, 'data' => $publicacion]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Publicación no encontrada']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>