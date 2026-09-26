/**
 * AvatarManager - Módulo para gestionar la visualización de fotos de perfil e iniciales
 */
const AvatarManager = {
    /**
     * Retorna la URL de la imagen de perfil o genera un avatar de iniciales si no existe.
     * @param {string} name - Nombre del usuario para generar iniciales.
     * @param {string|null} photoPath - Ruta de la imagen desde la DB.
     * @returns {string} URL de la imagen o Base64 del canvas.
     */
    getProfileImage: function(name, photoPath) {
        if (photoPath && photoPath.trim() !== '') {
            // Validar ruta de la imagen
            return photoPath.startsWith('uploads/') ? `../${photoPath}` : photoPath;
        }
        return this.generateInitialsAvatar(name || 'User');
    },

    /**
     * Genera un avatar basado en iniciales usando un Canvas.
     */
    generateInitialsAvatar: function(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        // Paleta de colores consistente
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFB833', '#33FFF3', '#1b4332'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = colors[Math.abs(hash) % colors.length];

        // Fondo
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2);
        ctx.fill();

        // Texto (Iniciales)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const initials = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        ctx.fillText(initials || '?', 50, 50);

        return canvas.toDataURL();
    }
};