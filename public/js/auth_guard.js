async function verificarAcceso(rolesPermitidos = []) {
    try {
        const response = await fetch("../auth/check_session.php");
        const data = await response.json();

        // LOG DE DEPURACIÓN: Para saber qué está pasando en el navegador
        console.log("Auth Guard - Session Data:", data);

        // 1. Si no está autenticado, redirigir al login
        if (!data.authenticated) {
            console.warn("Auth Guard: Usuario no autenticado. Redirigiendo al login...");
            window.location.href = "login.html";
            return null;
        }

        const rolUsuario = data.user.rol; // 'comprador' o 'disenador'
        console.log("Auth Guard - Rol detectado:", rolUsuario);

        // 2. Validar restricción por rol si la página lo requiere
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario)) {
            console.error(`Auth Guard: Acceso denegado. Rol ${rolUsuario} no está en la lista permitida:`, rolesPermitidos);
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
    const datosGuardados = localStorage.getItem('usuarioSesion') || localStorage.getItem('usuario');

    if (!datosGuardados) {
        console.warn('No se encontró ninguna sesión activa en localStorage.');
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(datosGuardados);
    const rol = (usuario.rol || usuario.role || usuario.tipo || '').toLowerCase();

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

document.addEventListener('DOMContentLoaded', updateNavbar);
