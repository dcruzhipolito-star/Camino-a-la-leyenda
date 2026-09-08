/**
 * app.js - Controlador principal para "Camino a la Leyenda INTECO"
 * Inicializa el juego y maneja las interacciones del usuario.
 */

const App = {
    gameState: null,

    /**
     * Inicializa la aplicación
     */
    init: function() {
        console.log('⚽ Iniciando Camino a la Leyenda INTECO...');
        UI.renderMenuPrincipal();
    },

    /**
     * Inicia el proceso de nueva carrera
     */
    nuevaCarrera: function() {
        UI.renderCrearJugador();
    },

    /**
     * Crea el jugador y empieza la carrera
     */
    crearJugador: function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById('input-nombre').value;
        const nacionalidad = document.getElementById('input-nacionalidad').value;
        const numeroCamiseta = document.getElementById('input-camiseta').value;
        const posicion = document.getElementById('input-posicion').value;
        const genero = document.getElementById('input-genero').value;
        const equipoId = document.getElementById('input-equipo').value;

        // Crear jugador
        const player = Player.crear(nombre, nacionalidad, numeroCamiseta, posicion, genero);
        
        // Inicializar carrera
        const career = Career.iniciar(player, equipoId);
        
        // Inicializar estado global
        this.gameState = {
            player: player,
            career: career
        };
        
        // Limpiar noticias y logros
        News.restaurar([]);
        Achievements.restaurar([]);
        
        // Noticias iniciales
        News.generarNoticiaAño(player.nombre, 1);
        News.agregar('bienvenida', '¡Bienvenido a INTECO!', 'Comienzas tu camino escolar y futbolístico en el Instituto Tecnológico y Comercial Recoleta. ¡Demuestra tu talento!', '🏫');

        this.guardarJuego();
        UI.mostrarToast('Jugador creado exitosamente', 'success');
        UI.renderDashboard(this.gameState);
    },

    /**
     * Continúa carrera guardada
     */
    continuarCarrera: function() {
        const state = Storage.loadGame();
        if (state) {
            this.gameState = state;
            // Restaurar módulos que tienen estado propio
            if (state.news) News.restaurar(state.news);
            if (state.achievements) Achievements.restaurar(state.achievements);
            
            UI.mostrarToast('Partida cargada', 'info');
            UI.renderDashboard(this.gameState);
        } else {
            UI.mostrarToast('No hay partida guardada', 'error');
        }
    },

    /**
     * Borra la carrera guardada
     */
    borrarCarrera: function() {
        if (confirm('¿Estás seguro de borrar todos los datos de tu carrera? Esta acción no se puede deshacer.')) {
            Storage.deleteGame();
            UI.mostrarToast('Datos borrados', 'success');
            UI.renderMenuPrincipal();
        }
    },

    /**
     * Guarda el progreso actual
     */
    guardarJuego: function() {
        if (!this.gameState) return;
        
        // Añadir estado de módulos a gameState antes de guardar
        this.gameState.news = News.noticias;
        this.gameState.achievements = Achievements.desbloqueados;
        
        Storage.saveGame(this.gameState);
    },

    /**
     * Botón "Continuar" principal, avanza el flujo de la carrera
     */
    continuar: function() {
        if (!this.gameState) return;
        
        // Intentar disparar evento aleatorio
        const evento = Events.obtenerEventoAleatorio();
        if (evento) {
            UI.mostrarModalEvento(evento);
            return; // Se pausa el avance hasta que el jugador resuelva el evento
        }
        
        const nextStep = Career.avanzar(this.gameState.career, this.gameState.player);
        
        // Generar noticias según evento
        this.generarNoticiasDePaso(nextStep);
        
        // Verificar logros después de cada paso
        this.verificarLogros();
        
        // Auto-guardado
        this.guardarJuego();
        
        // Renderizar el evento
        UI.renderEvento(nextStep);
    },

    /**
     * Vuelve al dashboard después de ver un evento
     */
    volverDashboard: function() {
        UI.renderDashboard(this.gameState);
    },

    /**
     * Maneja la selección de especialidad
     */
    elegirEspecialidad: function(equipoId) {
        if (!this.gameState) return;
        const career = this.gameState.career;
        const player = this.gameState.player;
        
        career.equipoLetra = equipoId.charAt(1); // 'A', 'B', 'C', 'D', 'E'
        Career.obtenerEquipoActual(career);
        
        // Aplicar bonos
        if (career.equipoLetra === 'A') { player.stats.pase++; Player.actualizarReputacion(player, 5); }
        else if (career.equipoLetra === 'B') { player.stats.velocidad++; Player.actualizarMoral(player, 10); }
        else if (career.equipoLetra === 'C') { player.stats.resistencia++; Player.actualizarReputacion(player, 5); }
        else if (career.equipoLetra === 'D') { player.stats.tiro++; Player.actualizarMoral(player, 10); }
        else if (career.equipoLetra === 'E') { player.stats.defensa++; Player.actualizarReputacion(player, 5); }
        
        player.overall = Player.calcularOverall(player.stats, player.posicion);
        
        UI.mostrarToast('Especialidad elegida correctamente', 'success');
        this.guardarJuego();
        UI.renderDashboard(this.gameState);
    },

    /**
     * Genera noticias automáticas según lo que pasó
     */
    generarNoticiasDePaso: function(step) {
        if (!step || !step.datos) return;
        
        const player = this.gameState.player;
        const accion = step.accion;
        const d = step.datos;
        
        switch (accion) {
            case 'inicio_torneo':
                News.generarNoticiaInicioTorneo(d.torneo.nombre, d.formato);
                break;
                
            case 'resultado_partido':
                News.generarNoticiaResultado(d.resultado, d.torneo.nombre);
                if (d.resultado.statsJugador) {
                    const stats = d.resultado.statsJugador;
                    if (stats.goles > 0) News.generarNoticiaGol(player.nombre, DATOS.obtenerEquipoPorId(this.gameState.career.equipoActualId).nombre, d.resultado.esEquipoLocal ? d.resultado.equipoVisitante.nombre : d.resultado.equipoLocal.nombre, stats.goles);
                    if (stats.mvp) News.generarNoticiaMVP(player.nombre, d.resultado.esEquipoLocal ? d.resultado.equipoVisitante.nombre : d.resultado.equipoLocal.nombre);
                }
                
                // Mostrar UI de nivel
                if (d.xpResult && d.xpResult.leveledUp) {
                    News.generarNoticiaLevel(player.nombre, d.xpResult.newLevel);
                    // Retrasar modal para que no choque con la transición de pantalla
                    setTimeout(() => UI.mostrarNivelModal(d.xpResult.newLevel, d.xpResult.skillPointsGanados), 500);
                }
                
                // Lesiones / pérdida fitness
                if (player.estadoFisico < 30) News.generarNoticiaLesion(player.nombre);
                break;
                
            case 'clasificacion':
                News.generarNoticiaClasificacion(DATOS.obtenerEquipoPorId(this.gameState.career.equipoActualId).nombre, d.posicion, d.clasifico);
                break;
                
            case 'fin_torneo':
                News.generarNoticiaCampeon(d.campeon, d.torneo.nombre, d.esCampeon);
                break;
                
            case 'evaluacion_seleccion':
                News.generarNoticiaConvocatoria(player.nombre, d.seleccionado);
                break;
                
            case 'fin_comeduc':
                News.generarNoticiaCampeon(d.campeon, 'Campeonato COMEDUC', d.esCampeon);
                break;
                
            case 'fin_año':
                if (!d.esUltimoAño) News.generarNoticiaAño(player.nombre, d.nuevoAño);
                break;
        }
    },

    /**
     * Verifica y muestra logros desbloqueados
     */
    verificarLogros: function() {
        const nuevosLogros = Achievements.verificar(this.gameState.player, this.gameState.career);
        
        nuevosLogros.forEach((logro, index) => {
            News.generarNoticiaLogro(this.gameState.player.nombre, logro);
            // Mostrar modal escalonado si hay múltiples
            setTimeout(() => UI.mostrarLogroModal(logro), (index + 1) * 1500);
        });
    }
};

// Inicializar la app cuando cargue la página
window.onload = () => App.init();
