/**
 * achievements.js - Sistema de logros para "Camino a la Leyenda INTECO"
 * Verifica y desbloquea logros basados en el progreso del jugador.
 */

const Achievements = {
    desbloqueados: [],

    /**
     * Verifica todos los logros y desbloquea los que correspondan
     * @returns {Array} Nuevos logros desbloqueados
     */
    verificar: function(player, career) {
        const nuevos = [];

        DATOS.logros.forEach(logro => {
            if (this.estaDesbloqueado(logro.id)) return;

            let desbloqueado = false;

            switch (logro.tipo) {
                case 'goles':
                    desbloqueado = player.totalGoles >= logro.valor;
                    break;

                case 'campeonato':
                    if (logro.valor === 'inteco') {
                        desbloqueado = career.campeonatosGanados.inteco > 0;
                    } else if (logro.valor === 'comeduc') {
                        desbloqueado = career.campeonatosGanados.comeduc > 0;
                    }
                    break;

                case 'seleccion':
                    desbloqueado = player.vecesSeleccionado > 0;
                    break;

                case 'mvp':
                    desbloqueado = player.vecesMVPTorneo > 0 || player.totalMVPs >= 5;
                    break;

                case 'leyenda':
                    // Se desbloquea al terminar la carrera con puntaje >= 95
                    if (career.fase === 'carrera_terminada') {
                        const finalData = Career.generarFinal(career, player);
                        desbloqueado = finalData.puntaje >= 95;
                    }
                    break;
            }

            if (desbloqueado) {
                this.desbloquear(logro.id);
                nuevos.push(logro);
            }
        });

        return nuevos;
    },

    /**
     * Desbloquea un logro
     */
    desbloquear: function(logroId) {
        if (!this.estaDesbloqueado(logroId)) {
            this.desbloqueados.push({
                id: logroId,
                fecha: new Date().toISOString()
            });
        }
    },

    /**
     * Verifica si un logro está desbloqueado
     */
    estaDesbloqueado: function(logroId) {
        return this.desbloqueados.some(d => d.id === logroId);
    },

    /**
     * Obtiene todos los logros con estado de desbloqueo
     */
    obtenerTodos: function() {
        return DATOS.logros.map(logro => ({
            ...logro,
            desbloqueado: this.estaDesbloqueado(logro.id),
            fecha: this.desbloqueados.find(d => d.id === logro.id)?.fecha
        }));
    },

    /**
     * Obtiene cantidad de logros desbloqueados
     */
    cantidadDesbloqueados: function() {
        return this.desbloqueados.length;
    },

    /**
     * Obtiene total de logros disponibles
     */
    totalLogros: function() {
        return DATOS.logros.length;
    },

    /**
     * Restaura logros desde estado guardado
     */
    restaurar: function(logrosGuardados) {
        this.desbloqueados = logrosGuardados || [];
    }
};

console.log('✅ achievements.js cargado correctamente');
