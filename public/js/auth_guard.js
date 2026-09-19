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

function irAMiPerfil() {
    // Intenta leer 'usuarioSesion' o 'usuario' por si varía el nombre de la clave
    const datosGuardados = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario');

    if (!datosGuardados) {
        console.warn('No se encontró ninguna sesión activa en localStorage.');
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(datosGuardados);


    const rol = (usuario.rol || usuario.role || usuario.tipo || '').toLowerCase();

    // Redirección adaptada a variaciones del rol
    if (rol === 'disenador' || rol === 'designer') {
        window.location.href = 'perfildiseñador.html';
    } else if (rol === 'comprador' || rol === 'buyer' || rol === 'usuario') {
        window.location.href = 'perfilusuario.html';
    } else {
        console.warn('Rol no reconocido:', rol);
        window.location.href = 'homepage.html';
    }
}

function updateNavbar() {
    const datosGuardados = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario');
    if (!datosGuardados) return;

    const usuario = JSON.parse(datosGuardados);
    const rol = (usuario.rol || usuario.role || usuario.tipo || '').toLowerCase();

    const clothesLink = document.getElementById('nav-clothes');
    const profileLink = document.getElementById('nav-profile');

    if (clothesLink) {
        if (rol === 'disenador' || rol === 'designer') {
            clothesLink.href = 'clothes.html';
        } else if (rol === 'comprador' || rol === 'buyer' || rol === 'usuario' || rol === 'client') {
            clothesLink.href = 'clothes_catalog.html';
        }
    }

    if (profileLink) {
        if (rol === 'disenador' || rol === 'designer') {
            profileLink.href = 'perfildiseñador.html';
        } else if (rol === 'comprador' || rol === 'buyer' || rol === 'usuario' || rol === 'client') {
            profileLink.href = 'perfilusuario.html';
        }
    }
}

// Ejecutar updateNavbar automáticamente al cargar la página si el script está incluido
document.addEventListener('DOMContentLoaded', updateNavbar);
