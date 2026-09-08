/**
 * player.js - Gestión del jugador para "Camino a la Leyenda INTECO"
 * Creación, progresión, estadísticas y nivel del jugador.
 */

const Player = {
    /**
     * Crea un nuevo jugador con stats iniciales según posición
     */
    crear: function(nombre, nacionalidad, numeroCamiseta, posicion, genero) {
        const stats = this.generarStatsIniciales(posicion);
        return {
            nombre: nombre,
            genero: genero || 'Hombre',
            nacionalidad: nacionalidad,
            bandera: DATOS.banderas[nacionalidad] || '🏳️',
            numeroCamiseta: parseInt(numeroCamiseta),
            posicion: posicion,
            posicionAbrev: DATOS.posicionesAbrev[posicion],
            stats: stats,
            overall: this.calcularOverall(stats, posicion),
            nivel: 1,
            xp: 0,
            xpParaSiguiente: DATOS.xpPorNivel(1),
            skillPoints: 0,
            reputacion: 10,
            comportamiento: 100, // reputación escolar
            partidosSuspendidos: 0,
            moral: 70,
            estadoFisico: 100,
            edad: 14,
            // Estadísticas acumuladas
            totalPartidos: 0,
            totalGanados: 0,
            totalEmpatados: 0,
            totalPerdidos: 0,
            totalGoles: 0,
            totalAsistencias: 0,
            totalMVPs: 0,
            totalTarjetasAmarillas: 0,
            totalTarjetasRojas: 0,
            totalXPGanada: 0,
            ratings: [],
            promedioRendimiento: 0,
            // Títulos
            titulosINTECO: 0,
            titulosCOMEDUC: 0,
            vecesSeleccionado: 0,
            vecesMVPTorneo: 0
        };
    },

    /**
     * Genera stats iniciales aleatorios según la posición
     */
    generarStatsIniciales: function(posicion) {
        const rangos = DATOS.statsIniciales[posicion];
        const stats = {};
        for (const [stat, [min, max]] of Object.entries(rangos)) {
            stats[stat] = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return stats;
    },

    /**
     * Calcula el overall del jugador basado en posición
     */
    calcularOverall: function(stats, posicion) {
        let pesos;
        switch (posicion) {
            case 'Arquero':
                pesos = { velocidad: 0.1, tiro: 0.05, pase: 0.15, defensa: 0.5, resistencia: 0.2 };
                break;
            case 'Defensa':
                pesos = { velocidad: 0.15, tiro: 0.05, pase: 0.2, defensa: 0.4, resistencia: 0.2 };
                break;
            case 'Mediocampista':
                pesos = { velocidad: 0.15, tiro: 0.15, pase: 0.35, defensa: 0.15, resistencia: 0.2 };
                break;
            case 'Delantero':
                pesos = { velocidad: 0.2, tiro: 0.4, pase: 0.15, defensa: 0.05, resistencia: 0.2 };
                break;
            default:
                pesos = { velocidad: 0.2, tiro: 0.2, pase: 0.2, defensa: 0.2, resistencia: 0.2 };
        }
        let overall = 0;
        for (const [stat, peso] of Object.entries(pesos)) {
            overall += (stats[stat] || 0) * peso;
        }
        return Math.round(overall);
    },

    /**
     * Agrega XP al jugador y maneja subida de nivel
     * @returns {Object} { leveledUp: boolean, newLevel: number, skillPointsGanados: number }
     */
    agregarXP: function(player, cantidad) {
        if (cantidad <= 0) return { leveledUp: false };

        player.xp += cantidad;
        player.totalXPGanada += cantidad;
        let leveledUp = false;
        let skillPointsGanados = 0;

        while (player.xp >= player.xpParaSiguiente) {
            player.xp -= player.xpParaSiguiente;
            player.nivel++;
            player.xpParaSiguiente = DATOS.xpPorNivel(player.nivel);
            leveledUp = true;

            // Otorgar puntos de habilidad al subir de nivel (3 puntos por nivel)
            player.skillPoints += 3;
            skillPointsGanados += 3;
        }

        // Recalcular overall
        player.overall = this.calcularOverall(player.stats, player.posicion);

        return { leveledUp, newLevel: player.nivel, skillPointsGanados };
    },

    /**
     * Asigna un punto de habilidad a una stat específica
     */
    asignarPuntoHabilidad: function(player, stat) {
        if (player.skillPoints > 0 && player.stats[stat] < 99) {
            player.skillPoints--;
            player.stats[stat]++;
            player.overall = this.calcularOverall(player.stats, player.posicion);
            return true;
        }
        return false;
    },

    /**
     * (Deprecated) Mejorar stats automáticamente - Eliminado por el nuevo sistema de skillPoints.
     */

    /**
     * Obtiene la stat principal según posición
     */
    getStatPrincipal: function(posicion) {
        const mapa = {
            'Arquero': 'defensa',
            'Defensa': 'defensa',
            'Mediocampista': 'pase',
            'Delantero': 'tiro'
        };
        return mapa[posicion] || 'pase';
    },

    /**
     * Actualiza reputación del jugador
     */
    actualizarReputacion: function(player, cambio) {
        player.reputacion = Math.max(0, Math.min(100, player.reputacion + cambio));
    },

    /**
     * Actualiza moral del jugador
     */
    actualizarMoral: function(player, cambio) {
        player.moral = Math.max(0, Math.min(100, player.moral + cambio));
    },

    /**
     * Actualiza estado físico
     */
    actualizarFitness: function(player, cambio) {
        player.estadoFisico = Math.max(0, Math.min(100, player.estadoFisico + cambio));
    },

    /**
     * Registra resultado de un partido en las estadísticas del jugador
     */
    registrarPartido: function(player, resultado) {
        player.totalPartidos++;
        if (resultado.resultado === 'W') player.totalGanados++;
        else if (resultado.resultado === 'D') player.totalEmpatados++;
        else player.totalPerdidos++;

        player.totalGoles += resultado.goles;
        player.totalAsistencias += resultado.asistencias;
        player.totalTarjetasAmarillas += resultado.tarjetasAmarillas;
        player.totalTarjetasRojas += resultado.tarjetasRojas;
        if (resultado.mvp) player.totalMVPs++;

        // Actualizar promedio de rendimiento
        player.ratings.push(resultado.rating);
        player.promedioRendimiento = parseFloat(
            (player.ratings.reduce((a, b) => a + b, 0) / player.ratings.length).toFixed(1)
        );

        // Actualizar moral según resultado
        if (resultado.resultado === 'W') this.actualizarMoral(player, 5);
        else if (resultado.resultado === 'D') this.actualizarMoral(player, -2);
        else this.actualizarMoral(player, -8);

        // Actualizar fitness (se reduce tras jugar)
        if (resultado.rol === 'titular') this.actualizarFitness(player, -15);
        else if (resultado.rol === 'suplente') this.actualizarFitness(player, -8);

        // Tarjetas rojas afectan moral y reputación
        if (resultado.tarjetasRojas > 0) {
            this.actualizarMoral(player, -15);
            this.actualizarReputacion(player, -10);
        }
        if (resultado.tarjetasAmarillas > 0) {
            this.actualizarReputacion(player, -3);
        }

        // Goles y asistencias mejoran reputación
        this.actualizarReputacion(player, resultado.goles * 5 + resultado.asistencias * 3);
        if (resultado.mvp) this.actualizarReputacion(player, 8);
    },

    /**
     * Recupera fitness entre partidos
     */
    recuperarFitness: function(player) {
        this.actualizarFitness(player, Math.floor(Math.random() * 10) + 15);
    },

    /**
     * Avanza la edad del jugador al cambiar de año
     */
    avanzarEdad: function(player) {
        player.edad++;
    },

    /**
     * Calcula el puntaje de selección del jugador
     */
    calcularPuntajeSeleccion: function(player, año) {
        let puntaje = 0;
        
        // Goles (peso: 20%)
        puntaje += Math.min(player.totalGoles * 2, 20);
        
        // Asistencias (peso: 10%)
        puntaje += Math.min(player.totalAsistencias * 1.5, 10);
        
        // Nivel (peso: 20%)
        puntaje += Math.min(player.nivel * 2, 20);
        
        // Promedio rendimiento (peso: 20%)
        puntaje += Math.min(player.promedioRendimiento * 2.5, 20);
        
        // Reputación (peso: 15%)
        puntaje += Math.min(player.reputacion * 0.15, 15);
        
        // Disciplina (peso: 15%) - menos tarjetas = más puntaje
        const disciplina = Math.max(0, 15 - player.totalTarjetasAmarillas * 1 - player.totalTarjetasRojas * 5);
        puntaje += disciplina;

        // Bonus por ser de 4° Medio
        if (año === 4) puntaje += 10;
        // Bonus por ser de 3° Medio
        if (año === 3) puntaje += 5;

        return Math.round(puntaje);
    },

    /**
     * Obtiene un resumen del jugador para mostrar en UI
     */
    obtenerResumen: function(player) {
        return {
            nombre: player.nombre,
            posicion: player.posicion,
            posicionAbrev: player.posicionAbrev,
            nacionalidad: player.nacionalidad,
            bandera: player.bandera,
            numero: player.numeroCamiseta,
            overall: player.overall,
            nivel: player.nivel,
            xp: player.xp,
            xpMax: player.xpParaSiguiente,
            skillPoints: player.skillPoints,
            stats: { ...player.stats },
            reputacion: player.reputacion,
            moral: player.moral,
            fitness: player.estadoFisico,
            partidos: player.totalPartidos,
            goles: player.totalGoles,
            asistencias: player.totalAsistencias,
            promedioRating: player.promedioRendimiento
        };
    }
};

console.log('✅ player.js cargado correctamente');
