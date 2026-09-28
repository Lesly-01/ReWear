async function verificarAcceso(rolesPermitidos = []) {
    try {
        const response = await fetch("../auth/check_session.php");
        const data = await response.json();

        // LOG DE DEPURACIÓN
        console.log("Auth Guard - Session Data:", data);

        // 1. Si no está autenticado, limpiar almacenamiento y redirigir al login
        if (!data.authenticated) {
            console.warn("Auth Guard: Usuario no autenticado. Redirigiendo al login...");
            sessionStorage.removeItem('usuario');
            localStorage.removeItem('usuario');
            window.location.href = "login.html";
            return null;
        }

        // --- SOLUCIÓN AQUÍ ---
        // Guardar los datos devueltos por PHP tanto en sessionStorage como en localStorage
        if (data.user) {
            sessionStorage.setItem('usuario', JSON.stringify(data.user));
            localStorage.setItem('usuario', JSON.stringify(data.user));
        }

        const rolUsuario = data.user.rol; // 'comprador' o 'disenador'
        console.log("Auth Guard - Rol detectado:", rolUsuario);

        // Actualizar los enlaces de la barra de navegación dinámicamente
        updateNavbar();

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
    const datosGuardados = sessionStorage.getItem('usuario') || localStorage.getItem('usuario') || localStorage.getItem('usuarioSesion');

    if (!datosGuardados) {
        console.warn('No se encontró ninguna sesión activa.');
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
        window.location.href = 'homepage.html';
    }
}

function updateNavbar() {
    const datosGuardados = sessionStorage.getItem('usuario') || localStorage.getItem('usuario') || localStorage.getItem('usuarioSesion');
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