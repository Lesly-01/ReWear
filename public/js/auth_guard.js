async function verificarAcceso(rolesPermitidos = []) {
    try {
        const response = await fetch("../auth/check_session.php");
        const data = await response.json();

        // 1. Si no está autenticado, redirigir al login
        if (!data.authenticated) {
            window.location.href = "login.html";
            return null;
        }

        // 2. Validar restricción por rol si la página lo requiere
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(data.user.rol)) {
            alert("Unauthorized access for your user role.");
            
            // Redirigir a la vista correspondiente según su rol real
            if (data.user.rol === "diseñador") {
                window.location.href = "clothes.html";
            } else if (data.user.rol === "comprador") {
                window.location.href = "clothes_catalog.html";
            } else {
                window.location.href = "homepage.html";
            }
            return null;
        }

        return data.user;
    } catch (error) {
        console.error("Error verifying authentication:", error);
        window.location.href = "login.html";
    }
}