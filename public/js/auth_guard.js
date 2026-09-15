async function verificarAcceso(rolesPermitidos = []) {
    try {
        const response = await fetch("../auth/check_session.php");
        const data = await response.json();

        // 1. Si no está autenticado, redirigir al login
        if (!data.authenticated) {
            window.location.href = "login.html";
            return null;
        }

        const rolUsuario = data.user.rol; // 'comprador' o 'disenador'

        // 2. Validar restricción por rol si la página lo requiere
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario)) {
            alert("Acceso no autorizado para tu rol de usuario.");
            
            // Redirigir a la vista correspondiente según su rol
            if (rolUsuario === "disenador") {
                window.location.href = "clothes.html";
            } else if (rolUsuario === "comprador") {
                window.location.href = "clothes_catalog.html";
            } else {
                window.location.href = "homepage.html";
            }
            return null;
        }

        return data.user;
    } catch (error) {
        console.error("Error al verificar autenticación:", error);
        window.location.href = "login.html";
    }
}