<?php
// 1. La sesión siempre debe iniciar antes de cualquier salida de texto o encabezado
session_start();
header('Content-Type: application/json');

// 2. Inclusión del archivo de conexión desde la carpeta prendas/
require_once("../config/conexion.php");

// 3. Instanciación obligatoria según tu clase Database
$database = new Database();
$db = $database->getConnection(); // Creamos la variable $db activa para PDO

// 4. Obtención del usuario de la sesión (o fallback a ID 1 para pruebas)
$id_disenador = $_SESSION['id_usuario'] ?? $_SESSION['user_id'] ?? 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lectura de los campos enviados por FormData
    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $min_price = floatval($_POST['min_price'] ?? 0);
    $max_price = floatval($_POST['max_price'] ?? 0);
    $description = trim($_POST['description'] ?? '');
    $image_url_input = trim($_POST['image_url'] ?? '');

    // Validación básica de campos obligatorios
    if (empty($title) || empty($category) || $min_price <= 0 || $max_price <= 0 || empty($description)) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, llena todos los campos obligatorios del formulario.'
        ]);
        exit;
    }

    // Ruta por defecto si no suben imagen
    $image_path = !empty($image_url_input) ? $image_url_input : 'IMG/default.jpg';
    
    // 5. Manejo de la subida de imagen física
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image_file']['tmp_name'];
        $fileName = $_FILES['image_file']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        if (in_array($fileExtension, $allowedExtensions)) {
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            // Ruta hacia la carpeta public/imagenes/uploads/
            $uploadFileDir = '../public/imagenes/uploads/';

            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0755, true);
            }

            $dest_path = $uploadFileDir . $newFileName;
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $image_path = 'imagenes/uploads/' . $newFileName;
            }
        }
    }

    try {
        // 6. Uso correcto de $db en lugar de $pdo + Consulta Preparada con PDO
        $sql = "INSERT INTO prendas_portafolio 
                (id_disenador, titulo, categoria, precio_minimo, precio_maximo, descripcion, imagen_url) 
                VALUES (:id_disenador, :titulo, :categoria, :precio_minimo, :precio_maximo, :descripcion, :imagen_url)";
        
        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':id_disenador' => $id_disenador,
            ':titulo'       => $title,
            ':categoria'    => $category,
            ':precio_minimo'=> $min_price,
            ':precio_maximo'=> $max_price,
            ':descripcion'  => $description,
            ':imagen_url'   => $image_path
        ]);

        echo json_encode([
            'success' => true,
            'message' => '¡Proyecto publicado exitosamente en el portafolio!'
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error PDO en la base de datos: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Petición no válida.'
    ]);
}
?>