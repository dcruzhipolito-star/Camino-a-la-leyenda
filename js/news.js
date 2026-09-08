/**
 * news.js - Sistema de noticias deportivas para "Camino a la Leyenda INTECO"
 * Genera noticias automáticas basadas en eventos del juego.
 */

const News = {
    noticias: [],

    /**
     * Agrega una noticia al sistema
     */
    agregar: function(tipo, titulo, contenido, icono) {
        this.noticias.unshift({
            id: Date.now() + Math.random(),
            tipo: tipo,
            titulo: titulo,
            contenido: contenido,
            icono: icono || '📰',
            fecha: this.generarFecha(),
            leida: false
        });

        // Mantener máximo 50 noticias
        if (this.noticias.length > 50) {
            this.noticias = this.noticias.slice(0, 50);
        }
    },

    /**
     * Genera noticias de resultado de partido
     */
    generarNoticiaResultado: function(resultado, torneoNombre) {
        const eq1 = resultado.equipoLocal.nombre || resultado.equipoLocal.abrev;
        const eq2 = resultado.equipoVisitante.nombre || resultado.equipoVisitante.abrev;
        const score = `${resultado.golesLocal} - ${resultado.golesVisitante}`;

        let detalle = '';
        if (resultado.statsJugador && resultado.statsJugador.goles > 0) {
            detalle = `${resultado.statsJugador.goles} gol(es) de tu jugador.`;
        }

        this.agregar(
            'resultado',
            `${eq1} ${score} ${eq2}`,
            `${torneoNombre}: ${eq1} se enfrentó a ${eq2} con marcador ${score}. ${detalle}`.trim(),
            '⚽'
        );
    },

    /**
     * Genera noticia de gol del jugador
     */
    generarNoticiaGol: function(playerName, equipoNombre, rival, cantidadGoles) {
        if (cantidadGoles <= 0) return;

        const plantillas = DATOS.plantillasNoticias.gol;
        const template = plantillas[Math.floor(Math.random() * plantillas.length)];

        this.agregar(
            'gol',
            cantidadGoles > 1 ? `¡${playerName} marca ${cantidadGoles} goles!` : `¡Gol de ${playerName}!`,
            template.replace('{jugador}', playerName).replace('{equipo}', equipoNombre).replace('{rival}', rival),
            '⚽'
        );
    },

    /**
     * Genera noticia de convocatoria a selección
     */
    generarNoticiaConvocatoria: function(playerName, seleccionado) {
        if (seleccionado) {
            this.agregar(
                'convocatoria',
                `¡${playerName} convocado a la Selección INTECO!`,
                `Gran noticia para ${playerName}: ha sido incluido en la nómina de la Selección INTECO para disputar el Campeonato COMEDUC. Su rendimiento ha llamado la atención del cuerpo técnico.`,
                '🎖️'
            );
        } else {
            this.agregar(
                'convocatoria',
                `Selección INTECO definida sin ${playerName}`,
                `${playerName} no fue incluido en la convocatoria de la Selección INTECO esta temporada. Deberá seguir trabajando para ganarse un lugar.`,
                '📋'
            );
        }
    },

    /**
     * Genera noticia de MVP
     */
    generarNoticiaMVP: function(playerName, rival) {
        this.agregar(
            'mvp',
            `⭐ ${playerName} elegido MVP`,
            `Actuación estelar de ${playerName} en el partido contra ${rival}. Fue elegido como el Jugador Más Valioso del encuentro.`,
            '⭐'
        );
    },

    /**
     * Genera noticia de campeón
     */
    generarNoticiaCampeon: function(equipoNombre, torneoNombre, esJugador) {
        this.agregar(
            'campeon',
            `🏆 ¡${equipoNombre} campeón del ${torneoNombre}!`,
            esJugador
                ? `¡Momento histórico! ${equipoNombre} se consagra campeón del ${torneoNombre}. ¡Tu equipo levanta el trofeo!`
                : `${equipoNombre} se quedó con el título del ${torneoNombre} tras una gran campaña.`,
            '🏆'
        );
    },

    /**
     * Genera noticia de lesión/pérdida de fitness
     */
    generarNoticiaLesion: function(playerName) {
        const plantillas = DATOS.plantillasNoticias.lesion;
        const template = plantillas[Math.floor(Math.random() * plantillas.length)];

        this.agregar(
            'lesion',
            `⚠️ Alerta: ${playerName}`,
            template.replace('{jugador}', playerName),
            '🏥'
        );
    },

    /**
     * Genera noticia de subida de nivel
     */
    generarNoticiaLevel: function(playerName, nivel) {
        this.agregar(
            'nivel',
            `📈 ${playerName} sube a nivel ${nivel}`,
            `${playerName} ha alcanzado el nivel ${nivel}. Su progresión como futbolista sigue en ascenso.`,
            '📈'
        );
    },

    /**
     * Genera noticia de logro desbloqueado
     */
    generarNoticiaLogro: function(playerName, logro) {
        this.agregar(
            'logro',
            `${logro.icono} Logro desbloqueado: ${logro.nombre}`,
            `${playerName} ha conseguido el logro "${logro.nombre}": ${logro.desc}`,
            logro.icono
        );
    },

    /**
     * Genera noticia de nuevo año escolar
     */
    generarNoticiaAño: function(playerName, año) {
        this.agregar(
            'escolar',
            `📚 ¡Nuevo año escolar!`,
            `${playerName} comienza ${DATOS.años[año - 1]}. Una nueva temporada de desafíos futbolísticos le espera.`,
            '📚'
        );
    },

    /**
     * Genera noticia de inicio de torneo
     */
    generarNoticiaInicioTorneo: function(torneoNombre, formato) {
        const formatoNombre = formato === 'futbol5' ? 'Fútbol 5' : 'Fútbol 7';
        this.agregar(
            'torneo',
            `🏟️ Comienza el ${torneoNombre}`,
            `Se puso en marcha el ${torneoNombre}. El formato será ${formatoNombre}. ¡20 equipos lucharán por la gloria!`,
            '🏟️'
        );
    },

    /**
     * Genera noticia de clasificación
     */
    generarNoticiaClasificacion: function(equipoNombre, posicion, clasifico) {
        if (clasifico) {
            this.agregar(
                'clasificacion',
                `✅ ${equipoNombre} clasifica a eliminatorias`,
                `${equipoNombre} terminó en la posición ${posicion}° de su grupo y avanza a la fase eliminatoria.`,
                '✅'
            );
        } else {
            this.agregar(
                'clasificacion',
                `❌ ${equipoNombre} queda eliminado`,
                `${equipoNombre} no logró clasificar, finalizando en la posición ${posicion}° de su grupo.`,
                '❌'
            );
        }
    },

    /**
     * Genera una fecha aleatoria del año escolar
     */
    generarFecha: function() {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mes = meses[Math.floor(Math.random() * 12)];
        const dia = Math.floor(Math.random() * 28) + 1;
        return `${dia} ${mes}`;
    },

    /**
     * Obtiene las últimas N noticias
     */
    obtenerUltimas: function(cantidad) {
        return this.noticias.slice(0, cantidad || 10);
    },

    /**
     * Obtiene noticias no leídas
     */
    obtenerNoLeidas: function() {
        return this.noticias.filter(n => !n.leida);
    },

    /**
     * Marca todas como leídas
     */
    marcarTodasLeidas: function() {
        this.noticias.forEach(n => n.leida = true);
    },

    /**
     * Restaura noticias desde estado guardado
     */
    restaurar: function(noticiasGuardadas) {
        this.noticias = noticiasGuardadas || [];
    }
};

console.log('✅ news.js cargado correctamente');
