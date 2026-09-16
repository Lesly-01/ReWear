<?php
header('Content-Type: application/json');
require_once 'conexion.php'; // Asegúrate de que el nombre de tu archivo de conexión sea el correcto

session_start();
$id_disenador = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $min_price = floatval($_POST['min_price'] ?? 0);
    $max_price = floatval($_POST['max_price'] ?? 0);
    $description = trim($_POST['description'] ?? '');

    // Manejo de la subida de imagen
    $image_path = 'IMG/default.jpg';
    
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image_file']['tmp_name'];
        $fileName = $_FILES['image_file']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        if (in_array($fileExtension, $allowedExtensions)) {
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $uploadFileDir = './uploads/';

            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0755, true);
            }

            $dest_path = $uploadFileDir . $newFileName;
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $image_path = 'uploads/' . $newFileName;
            }
        }
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO prendas_portafolio (id_disenador, titulo, categoria, precio_minimo, precio_maximo, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id_disenador, $title, $category, $min_price, $max_price, $description, $image_path]);

        echo json_encode([
            'success' => true,
            'message' => '¡Proyecto publicado exitosamente en el portafolio!'
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error en la base de datos: ' . $e->getMessage()
        ]);
    }
}
?>