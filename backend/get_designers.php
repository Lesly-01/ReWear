<?php
// Configuración de cabeceras para responder en formato JSON
header('Content-Type: application/json; charset=utf-8');

// Incluir conexión usando la ruta absoluta basada en la ubicación de este archivo
require_once __DIR__ . '/../config/conexion.php';

try {
    // 1. Instanciar la clase Database y obtener la conexión PDO
    $database = new Database();
    $pdo = $database->getConnection();

    // 2. Consulta para obtener los datos de los diseñadores
    $sql = "SELECT 
                u.id_usuario,
                u.nombre,
                pd.biografia,
                pd.foto_perfil,
                pd.rango_precio_desde,
                pd.rango_precio_hasta,
                COALESCE(AVG(r.calificacion), 0) AS promedio_calificacion,
                COUNT(DISTINCT r.id_resena) AS total_resenas,
                (
                    SELECT GROUP_CONCAT(t.nombre SEPARATOR ', ')
                    FROM disenador_tecnica dt
                    INNER JOIN tecnicas t ON dt.id_tecnica = t.id_tecnica
                    WHERE dt.id_usuario = u.id_usuario
                ) AS tecnicas
            FROM usuarios u
            INNER JOIN perfiles_disenador pd ON u.id_usuario = pd.id_usuario
            LEFT JOIN postulaciones pos ON u.id_usuario = pos.id_disenador
            LEFT JOIN resenas r ON pos.id_postulacion = r.id_postulacion
            WHERE u.rol = 'disenador' AND u.estado = 'activo'
            GROUP BY u.id_usuario, u.nombre, pd.biografia, pd.foto_perfil, pd.rango_precio_desde, pd.rango_precio_hasta";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $disenadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Respuesta JSON limpia
    echo json_encode([
        'success' => true,
        'data' => $disenadores
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Respuesta limpia en caso de error en la consulta
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener diseñadores: ' . $e->getMessage()
    ]);
}
?>