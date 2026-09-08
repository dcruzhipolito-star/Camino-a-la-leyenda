/**
 * storage.js - Gestión de LocalStorage para "Camino a la Leyenda INTECO"
 * Maneja guardado, carga y eliminación del progreso del juego.
 */

const Storage = {
    SAVE_KEY: 'camino_leyenda_inteco_save',
    SETTINGS_KEY: 'camino_leyenda_inteco_settings',

    /**
     * Guarda el estado completo del juego
     * @param {Object} gameState - Estado del juego a guardar
     */
    saveGame: function(gameState) {
        try {
            const data = JSON.stringify(gameState);
            localStorage.setItem(this.SAVE_KEY, data);
            console.log('💾 Juego guardado correctamente');
            return true;
        } catch (e) {
            console.error('❌ Error al guardar:', e);
            return false;
        }
    },

    /**
     * Carga el estado del juego desde LocalStorage
     * @returns {Object|null} Estado del juego o null si no hay guardado
     */
    loadGame: function() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            if (!data) return null;
            const state = JSON.parse(data);
            console.log('📂 Juego cargado correctamente');
            return state;
        } catch (e) {
            console.error('❌ Error al cargar:', e);
            return null;
        }
    },

    /**
     * Verifica si hay un juego guardado
     * @returns {boolean}
     */
    hasSavedGame: function() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    /**
     * Elimina el juego guardado
     */
    deleteGame: function() {
        localStorage.removeItem(this.SAVE_KEY);
        console.log('🗑️ Juego eliminado');
    },

    /**
     * Guarda configuraciones del juego
     * @param {Object} settings
     */
    saveSettings: function(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('❌ Error al guardar configuración:', e);
        }
    },

    /**
     * Carga configuraciones
     * @returns {Object}
     */
    loadSettings: function() {
        try {
            const data = localStorage.getItem(this.SETTINGS_KEY);
            return data ? JSON.parse(data) : { sonido: true, animaciones: true };
        } catch (e) {
            return { sonido: true, animaciones: true };
        }
    }
};

console.log('✅ storage.js cargado correctamente');
