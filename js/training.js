/**
 * training.js - Sistema de Entrenamiento para "Camino a la Leyenda INTECO"
 */

const Training = {
    tipos: [
        { id: 'tiro', nombre: 'Definición', stat: 'tiro', icon: '🎯', costo: 20, desc: 'Mejora tu precisión y potencia.' },
        { id: 'pase', nombre: 'Rondos', stat: 'pase', icon: '📨', costo: 20, desc: 'Mejora tu visión y distribución.' },
        { id: 'velocidad', nombre: 'Sprints', stat: 'velocidad', icon: '⚡', costo: 25, desc: 'Mejora tu aceleración.' },
        { id: 'defensa', nombre: 'Marcaje', stat: 'defensa', icon: '🛡️', costo: 20, desc: 'Mejora tus quites e intercepciones.' },
        { id: 'resistencia', nombre: 'Cardio', stat: 'resistencia', icon: '💪', costo: 30, desc: 'Mejora tu fondo físico.' }
    ],

    entrenar: function(player, tipoId) {
        const tipo = this.tipos.find(t => t.id === tipoId);
        if (!tipo) return { exito: false, msj: 'Tipo de entrenamiento no válido' };

        if (player.estadoFisico < tipo.costo) {
            return { exito: false, msj: 'No tienes suficiente energía para entrenar.' };
        }

        // Consumir energía
        Player.actualizarFitness(player, -tipo.costo);
        player.ultimoPartidoEntrenado = player.totalPartidos;

        // Probabilidad de éxito en el entrenamiento (ej: 80% éxito)
        const exitoEntrenamiento = Math.random() < 0.8;
        
        if (exitoEntrenamiento) {
            // Gana XP o a veces un punto directo a la stat
            const granExito = Math.random() < 0.15; // 15% de subir directamente
            
            if (granExito && player.stats[tipo.stat] < 99) {
                player.stats[tipo.stat]++;
                player.overall = Player.calcularOverall(player.stats, player.posicion);
                return { exito: true, msj: `¡Entrenamiento excepcional! Tu ${tipo.nombre} ha mejorado (+1).`, tipo: 'stat' };
            } else {
                const xpGanada = Math.floor(Math.random() * 40) + 40; // 40-80 XP
                const xpResult = Player.agregarXP(player, xpGanada);
                return { exito: true, msj: `Buen entrenamiento. Has ganado ${xpGanada} XP.`, tipo: 'xp', xpResult: xpResult };
            }
        } else {
            return { exito: true, msj: 'Entrenamiento normal, has mantenido la forma pero sin grandes mejoras.', tipo: 'fail' };
        }
    }
};

console.log('✅ training.js cargado correctamente');
