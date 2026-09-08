/**
 * career.js - Gestión de carrera para "Camino a la Leyenda INTECO"
 * Controla la progresión a través de 4 años escolares, selección y finales.
 */

const Career = {

    /**
     * Inicializa una nueva carrera
     */
    iniciar: function(player, equipoId) {
        return {
            año: 1,
            semestre: 1,
            equipoActualId: equipoId,
            fase: 'inicio_semestre',
            // Fases: inicio_semestre, torneo_grupo, torneo_eliminatorias, fin_torneo,
            //        entre_semestres, evaluacion_seleccion, comeduc, fin_año, carrera_terminada
            torneoActual: null,
            torneoCOMEDUC: null,
            historialTorneos: [],
            seleccionado: false,
            historialSeleccion: [],
            campeonatosGanados: { inteco: 0, comeduc: 0 },
            vecesMVPTorneo: 0,
            historialPartidos: [],
            añoActual: DATOS.años[0],
            edadInicial: player.edad,
            equipoLetra: equipoId.charAt(equipoId.length - 1) // A, B, C, D, E
        };
    },

    /**
     * Obtiene el equipo actual del jugador para el año actual
     */
    obtenerEquipoActual: function(career) {
        const año = career.año;
        const letra = career.equipoLetra;
        const equipos = DATOS.equipos[año];
        const equipo = equipos.find(e => e.id === `${año}${letra}`);
        if (equipo) {
            career.equipoActualId = equipo.id;
            return equipo;
        }
        // Fallback al primer equipo del año
        career.equipoActualId = equipos[0].id;
        return equipos[0];
    },

    /**
     * Inicia un nuevo semestre (crea torneo INTECO)
     */
    iniciarSemestre: function(career, player) {
        const equipo = this.obtenerEquipoActual(career);
        career.equipoActualId = equipo.id;

        const torneo = Tournament.crearCampeonatoINTECO(
            career.año, career.semestre, career.equipoActualId
        );

        career.torneoActual = torneo;
        career.fase = 'torneo_grupo';

        // Recuperar fitness al inicio del semestre
        Player.recuperarFitness(player);
        Player.actualizarMoral(player, 10);

        return torneo;
    },

    /**
     * Avanza al siguiente paso de la carrera
     * @returns {Object} { accion, datos } - Qué debe hacer la UI
     */
    avanzar: function(career, player) {
        switch (career.fase) {
            case 'inicio_semestre':
                return this.manejarInicioSemestre(career, player);

            case 'torneo_grupo':
                return this.manejarTorneoGrupo(career, player);

            case 'torneo_eliminatorias':
                return this.manejarTorneoEliminatorias(career, player);

            case 'fin_torneo':
                return this.manejarFinTorneo(career, player);

            case 'entre_semestres':
                return this.manejarEntreSemestres(career, player);

            case 'evaluacion_seleccion':
                return this.manejarEvaluacionSeleccion(career, player);

            case 'comeduc':
                return this.manejarCOMEDUC(career, player);

            case 'comeduc_grupo':
                return this.manejarCOMEDUCGrupo(career, player);

            case 'comeduc_eliminatorias':
                return this.manejarCOMEDUCEliminatorias(career, player);

            case 'fin_comeduc':
                return this.manejarFinCOMEDUC(career, player);

            case 'fin_año':
                return this.manejarFinAño(career, player);

            case 'carrera_terminada':
                return { accion: 'pantalla_final', datos: this.generarFinal(career, player) };

            default:
                return { accion: 'dashboard', datos: null };
        }
    },

    /**
     * Maneja inicio de semestre
     */
    manejarInicioSemestre: function(career, player) {
        const torneo = this.iniciarSemestre(career, player);
        return {
            accion: 'inicio_torneo',
            datos: {
                torneo: torneo,
                mensaje: `¡Comienza el ${torneo.nombre}!`,
                equipoJugador: DATOS.obtenerEquipoPorId(career.equipoActualId),
                formato: torneo.formato
            }
        };
    },

    /**
     * Maneja fase de grupo del torneo
     */
    manejarTorneoGrupo: function(career, player) {
        const torneo = career.torneoActual;

        // Simular partidos de otros equipos
        Tournament.simularPartidosHasta(torneo, torneo.formato, player);

        // Ver si quedan partidos del jugador
        if (Tournament.quedanPartidosGrupoJugador(torneo)) {
            // Hay partido del jugador
            const resultado = Tournament.jugarPartidoJugador(torneo, player);

            if (resultado) {
                // Registrar en jugador
                if (resultado.statsJugador) {
                    Player.registrarPartido(player, resultado.statsJugador);
                    const xpResult = Player.agregarXP(player, resultado.statsJugador.xp);

                    // Agregar al historial
                    career.historialPartidos.push({
                        torneo: torneo.nombre,
                        oponente: resultado.esEquipoLocal ?
                            resultado.equipoVisitante.nombre : resultado.equipoLocal.nombre,
                        marcador: `${resultado.golesLocal} - ${resultado.golesVisitante}`,
                        resultado: resultado.statsJugador.resultado,
                        goles: resultado.statsJugador.goles,
                        asistencias: resultado.statsJugador.asistencias,
                        rating: resultado.statsJugador.rating,
                        rol: resultado.rolJugador
                    });

                    // Recuperar un poco de fitness
                    Player.recuperarFitness(player);

                    return {
                        accion: 'resultado_partido',
                        datos: {
                            resultado: resultado,
                            xpResult: xpResult,
                            torneo: torneo
                        }
                    };
                }
            }
        }

        // No quedan partidos en grupo, completar grupo y verificar clasificación
        Tournament.completarGrupoJugador(torneo);

        // Completar todos los grupos
        torneo.grupos.forEach((g, idx) => {
            g.partidos.forEach(p => {
                if (!p.jugado) {
                    const res = Match.simularSinJugador(p.equipo1, p.equipo2, torneo.formato);
                    p.goles1 = res.goles1;
                    p.goles2 = res.goles2;
                    p.jugado = true;
                    Tournament.actualizarStandings(p.equipo1, p.equipo2, res.goles1, res.goles2);
                }
            });
        });

        // Verificar si clasificó
        const clasifico = Tournament.equipoJugadorClasifico(torneo);
        const posicion = Tournament.posicionEquipoJugador(torneo);

        if (clasifico) {
            // Generar eliminatorias
            Tournament.generarEliminatorias(torneo);
            career.fase = 'torneo_eliminatorias';

            return {
                accion: 'clasificacion',
                datos: {
                    clasifico: true,
                    posicion: posicion,
                    torneo: torneo,
                    mensaje: `¡Tu equipo clasificó ${posicion}° del grupo! Avanzas a eliminatorias.`
                }
            };
        } else {
            career.fase = 'fin_torneo';
            return {
                accion: 'clasificacion',
                datos: {
                    clasifico: false,
                    posicion: posicion,
                    torneo: torneo,
                    mensaje: `Tu equipo terminó ${posicion}° del grupo. Eliminado del torneo.`
                }
            };
        }
    },

    /**
     * Maneja eliminatorias del torneo
     */
    manejarTorneoEliminatorias: function(career, player) {
        const torneo = career.torneoActual;

        if (torneo.fase === 'completado') {
            career.fase = 'fin_torneo';
            return this.manejarFinTorneo(career, player);
        }

        // Verificar si el equipo del jugador está en esta ronda
        if (Tournament.equipoJugadorEnEliminatoria(torneo)) {
            // Jugar la ronda
            const rondaResult = Tournament.jugarRondaEliminatoria(torneo, player);

            // Buscar el partido del jugador
            const partidoJugador = rondaResult.resultados.find(p => p.esPartidoJugador);

            if (partidoJugador && partidoJugador.resultado && partidoJugador.resultado.statsJugador) {
                Player.registrarPartido(player, partidoJugador.resultado.statsJugador);
                Player.agregarXP(player, partidoJugador.resultado.statsJugador.xp);
                Player.recuperarFitness(player);

                career.historialPartidos.push({
                    torneo: torneo.nombre + ` (${this.nombreFaseEliminatoria(torneo.fase)})`,
                    oponente: partidoJugador.equipo1.esJugador ? partidoJugador.equipo2.nombre : partidoJugador.equipo1.nombre,
                    marcador: `${Math.floor(partidoJugador.goles1)} - ${Math.floor(partidoJugador.goles2)}${partidoJugador.penales ? ' (PEN)' : ''}`,
                    resultado: partidoJugador.resultado.statsJugador.resultado,
                    goles: partidoJugador.resultado.statsJugador.goles,
                    asistencias: partidoJugador.resultado.statsJugador.asistencias,
                    rating: partidoJugador.resultado.statsJugador.rating,
                    rol: partidoJugador.resultado.rolJugador
                });
            }

            // Verificar si el equipo del jugador ganó
            const jugadorGano = partidoJugador && partidoJugador.ganador &&
                (partidoJugador.ganador.esJugador || partidoJugador.ganador.id === torneo.equipoJugadorId);

            if (!jugadorGano && torneo.fase !== 'completado') {
                // El jugador fue eliminado, simular resto del torneo
                while (torneo.fase !== 'completado') {
                    Tournament.jugarRondaEliminatoria(torneo, player);
                }
                career.fase = 'fin_torneo';
            }

            if (torneo.fase === 'completado') {
                career.fase = 'fin_torneo';
            }

            return {
                accion: 'resultado_eliminatoria',
                datos: {
                    partido: partidoJugador,
                    ronda: rondaResult,
                    jugadorGano: jugadorGano,
                    torneo: torneo,
                    faseNombre: this.nombreFaseEliminatoria(torneo.fase)
                }
            };
        } else {
            // El equipo del jugador no está en esta ronda (ya fue eliminado)
            while (torneo.fase !== 'completado') {
                Tournament.jugarRondaEliminatoria(torneo, player);
            }
            career.fase = 'fin_torneo';
            return this.manejarFinTorneo(career, player);
        }
    },

    /**
     * Maneja fin de torneo
     */
    manejarFinTorneo: function(career, player) {
        const torneo = career.torneoActual;

        // Verificar si el jugador fue campeón
        const esCampeon = torneo.campeon &&
            (torneo.campeon.esJugador || torneo.campeon.id === career.equipoActualId);

        if (esCampeon) {
            career.campeonatosGanados.inteco++;
            player.titulosINTECO++;
            Player.actualizarReputacion(player, 15);
            Player.actualizarMoral(player, 20);
        }

        // Guardar torneo en historial
        career.historialTorneos.push({
            nombre: torneo.nombre,
            tipo: torneo.tipo,
            año: career.año,
            semestre: career.semestre,
            campeon: torneo.campeon ? torneo.campeon.nombre : 'Desconocido',
            esCampeon: esCampeon,
            formato: torneo.formato
        });

        // Avanzar fase
        if (career.semestre === 1) {
            career.fase = 'entre_semestres';
        } else {
            career.fase = 'evaluacion_seleccion';
        }

        career.torneoActual = null;

        return {
            accion: 'fin_torneo',
            datos: {
                torneo: torneo,
                esCampeon: esCampeon,
                campeon: torneo.campeon ? torneo.campeon.nombre : 'Desconocido',
                mensaje: esCampeon
                    ? `🏆 ¡FELICIDADES! ¡Tu equipo es el campeón del ${torneo.nombre}!`
                    : `El ${torneo.nombre} ha finalizado. Campeón: ${torneo.campeon ? torneo.campeon.nombre : 'Desconocido'}`
            }
        };
    },

    /**
     * Maneja período entre semestres
     */
    manejarEntreSemestres: function(career, player) {
        career.semestre = 2;
        career.fase = 'inicio_semestre';

        // Recuperar fitness
        Player.actualizarFitness(player, 30);
        Player.actualizarMoral(player, 10);

        return {
            accion: 'entre_semestres',
            datos: {
                mensaje: '📚 ¡Comienza el 2° semestre! Prepárate para el próximo campeonato.',
                año: career.año,
                semestre: 2
            }
        };
    },

    /**
     * Maneja evaluación de selección INTECO
     */
    manejarEvaluacionSeleccion: function(career, player) {
        const puntaje = Player.calcularPuntajeSeleccion(player, career.año);
        const umbral = 45 - (career.año - 1) * 5; // Más fácil en años superiores
        const seleccionado = puntaje >= umbral;

        career.seleccionado = seleccionado;
        career.historialSeleccion.push({
            año: career.año,
            puntaje: puntaje,
            seleccionado: seleccionado
        });

        if (seleccionado) {
            player.vecesSeleccionado++;
            career.fase = 'comeduc';
            Player.actualizarReputacion(player, 10);
            Player.actualizarMoral(player, 15);
        } else {
            career.fase = 'fin_año';
        }

        return {
            accion: 'evaluacion_seleccion',
            datos: {
                seleccionado: seleccionado,
                puntaje: puntaje,
                umbral: umbral,
                mensaje: seleccionado
                    ? '🎖️ ¡Has sido convocado a la Selección INTECO! Representarás al liceo en el campeonato COMEDUC.'
                    : '😔 No has sido seleccionado esta temporada. ¡Sigue esforzándote!',
                desglose: {
                    goles: Math.min(player.totalGoles * 2, 20),
                    asistencias: Math.min(player.totalAsistencias * 1.5, 10),
                    nivel: Math.min(player.nivel * 2, 20),
                    rendimiento: Math.min(player.promedioRendimiento * 2.5, 20),
                    reputacion: Math.min(player.reputacion * 0.15, 15),
                    disciplina: Math.max(0, 15 - player.totalTarjetasAmarillas - player.totalTarjetasRojas * 5),
                    bonusAño: career.año === 4 ? 10 : (career.año === 3 ? 5 : 0)
                }
            }
        };
    },

    /**
     * Maneja inicio de COMEDUC
     */
    manejarCOMEDUC: function(career, player) {
        const torneo = Tournament.crearCampeonatoCOMEDUC(player);
        career.torneoCOMEDUC = torneo;
        career.fase = 'comeduc_grupo';

        return {
            accion: 'inicio_comeduc',
            datos: {
                torneo: torneo,
                mensaje: '🏟️ ¡Comienza el Campeonato COMEDUC! El torneo más importante del circuito escolar.'
            }
        };
    },

    /**
     * Maneja grupo COMEDUC (misma lógica que INTECO)
     */
    manejarCOMEDUCGrupo: function(career, player) {
        const torneo = career.torneoCOMEDUC;

        Tournament.simularPartidosHasta(torneo, torneo.formato, player);

        if (Tournament.quedanPartidosGrupoJugador(torneo)) {
            const resultado = Tournament.jugarPartidoJugador(torneo, player);

            if (resultado && resultado.statsJugador) {
                Player.registrarPartido(player, resultado.statsJugador);
                Player.agregarXP(player, resultado.statsJugador.xp);
                Player.recuperarFitness(player);

                career.historialPartidos.push({
                    torneo: 'COMEDUC',
                    oponente: resultado.esEquipoLocal ?
                        resultado.equipoVisitante.nombre : resultado.equipoLocal.nombre,
                    marcador: `${resultado.golesLocal} - ${resultado.golesVisitante}`,
                    resultado: resultado.statsJugador.resultado,
                    goles: resultado.statsJugador.goles,
                    asistencias: resultado.statsJugador.asistencias,
                    rating: resultado.statsJugador.rating,
                    rol: resultado.rolJugador
                });

                return {
                    accion: 'resultado_partido',
                    datos: { resultado, torneo }
                };
            }
        }

        // Completar grupos
        torneo.grupos.forEach(g => {
            g.partidos.forEach(p => {
                if (!p.jugado) {
                    const res = Match.simularSinJugador(p.equipo1, p.equipo2, torneo.formato);
                    p.goles1 = res.goles1;
                    p.goles2 = res.goles2;
                    p.jugado = true;
                    Tournament.actualizarStandings(p.equipo1, p.equipo2, res.goles1, res.goles2);
                }
            });
        });

        const clasifico = Tournament.equipoJugadorClasifico(torneo);

        if (clasifico) {
            Tournament.generarEliminatorias(torneo);
            career.fase = 'comeduc_eliminatorias';
            return {
                accion: 'clasificacion',
                datos: {
                    clasifico: true,
                    posicion: Tournament.posicionEquipoJugador(torneo),
                    torneo: torneo,
                    mensaje: '¡La Selección INTECO clasifica a eliminatorias del COMEDUC!'
                }
            };
        } else {
            career.fase = 'fin_comeduc';
            return {
                accion: 'clasificacion',
                datos: {
                    clasifico: false,
                    posicion: Tournament.posicionEquipoJugador(torneo),
                    torneo: torneo,
                    mensaje: 'La Selección INTECO ha sido eliminada del COMEDUC en fase de grupos.'
                }
            };
        }
    },

    /**
     * Maneja eliminatorias COMEDUC
     */
    manejarCOMEDUCEliminatorias: function(career, player) {
        const torneo = career.torneoCOMEDUC;

        if (torneo.fase === 'completado') {
            career.fase = 'fin_comeduc';
            return this.manejarFinCOMEDUC(career, player);
        }

        if (Tournament.equipoJugadorEnEliminatoria(torneo)) {
            const rondaResult = Tournament.jugarRondaEliminatoria(torneo, player);
            const partidoJugador = rondaResult.resultados.find(p => p.esPartidoJugador);

            if (partidoJugador && partidoJugador.resultado && partidoJugador.resultado.statsJugador) {
                Player.registrarPartido(player, partidoJugador.resultado.statsJugador);
                Player.agregarXP(player, partidoJugador.resultado.statsJugador.xp);
                Player.recuperarFitness(player);
            }

            const jugadorGano = partidoJugador && partidoJugador.ganador &&
                (partidoJugador.ganador.esJugador || partidoJugador.ganador.id === 'inteco');

            if (!jugadorGano && torneo.fase !== 'completado') {
                while (torneo.fase !== 'completado') {
                    Tournament.jugarRondaEliminatoria(torneo, player);
                }
            }

            if (torneo.fase === 'completado') {
                career.fase = 'fin_comeduc';
            }

            return {
                accion: 'resultado_eliminatoria',
                datos: {
                    partido: partidoJugador,
                    ronda: rondaResult,
                    jugadorGano: jugadorGano,
                    torneo: torneo,
                    esCOMEDUC: true
                }
            };
        } else {
            while (torneo.fase !== 'completado') {
                Tournament.jugarRondaEliminatoria(torneo, player);
            }
            career.fase = 'fin_comeduc';
            return this.manejarFinCOMEDUC(career, player);
        }
    },

    /**
     * Maneja fin de COMEDUC
     */
    manejarFinCOMEDUC: function(career, player) {
        const torneo = career.torneoCOMEDUC;
        const esCampeon = torneo.campeon &&
            (torneo.campeon.esJugador || torneo.campeon.id === 'inteco');

        if (esCampeon) {
            career.campeonatosGanados.comeduc++;
            player.titulosCOMEDUC++;
            Player.actualizarReputacion(player, 25);
            Player.actualizarMoral(player, 25);
        }

        career.historialTorneos.push({
            nombre: 'Campeonato COMEDUC',
            tipo: 'comeduc',
            año: career.año,
            campeon: torneo.campeon ? torneo.campeon.nombre || torneo.campeon.abrev : 'Desconocido',
            esCampeon: esCampeon
        });

        career.fase = 'fin_año';
        career.torneoCOMEDUC = null;

        return {
            accion: 'fin_comeduc',
            datos: {
                esCampeon: esCampeon,
                campeon: torneo.campeon ? (torneo.campeon.nombre || torneo.campeon.abrev) : 'Desconocido',
                mensaje: esCampeon
                    ? '🏅 ¡¡INCREÍBLE!! ¡La Selección INTECO es CAMPEONA del COMEDUC! ¡Victoria histórica!'
                    : `El Campeonato COMEDUC ha finalizado. Campeón: ${torneo.campeon ? (torneo.campeon.nombre || torneo.campeon.abrev) : 'Desconocido'}`
            }
        };
    },

    /**
     * Maneja fin de año
     */
    manejarFinAño: function(career, player) {
        if (career.año >= 4) {
            career.fase = 'carrera_terminada';
            return {
                accion: 'fin_año',
                datos: {
                    año: career.año,
                    mensaje: `📚 Has completado ${DATOS.años[career.año - 1]}. ¡Tu carrera en INTECO ha terminado!`,
                    esUltimoAño: true
                }
            };
        }

        // Avanzar al siguiente año
        career.año++;
        career.semestre = 1;
        career.fase = 'inicio_semestre';
        career.añoActual = DATOS.años[career.año - 1];
        career.seleccionado = false;

        Player.avanzarEdad(player);
        Player.actualizarFitness(player, 40);
        Player.actualizarMoral(player, 15);

        // Actualizar equipo (cambiar número del año, mantener letra)
        this.obtenerEquipoActual(career);

        if (career.año === 3) {
            return {
                accion: 'eleccion_especialidad',
                datos: {
                    año: career.año - 1,
                    nuevoAño: career.año,
                    mensaje: `¡Has pasado a 3° Medio! En INTECO debes elegir tu especialidad técnica.`,
                    esUltimoAño: false
                }
            };
        }

        return {
            accion: 'fin_año',
            datos: {
                año: career.año - 1,
                nuevoAño: career.año,
                mensaje: `📚 Has completado ${DATOS.años[career.año - 2]}. ¡Pasas a ${DATOS.años[career.año - 1]}!`,
                esUltimoAño: false
            }
        };
    },

    /**
     * Nombre legible de la fase eliminatoria
     */
    nombreFaseEliminatoria: function(fase) {
        const nombres = {
            'cuartos': 'Cuartos de Final',
            'semis': 'Semifinal',
            'final': 'Final',
            'completado': 'Torneo Completado'
        };
        return nombres[fase] || fase;
    },

    /**
     * Genera el final de la carrera
     */
    generarFinal: function(career, player) {
        // Calcular puntaje final
        let puntaje = 0;

        // Partidos jugados
        puntaje += Math.min(player.totalPartidos * 0.5, 10);
        // Goles
        puntaje += Math.min(player.totalGoles * 1, 20);
        // Asistencias
        puntaje += Math.min(player.totalAsistencias * 0.8, 10);
        // Nivel
        puntaje += Math.min(player.nivel * 1.5, 15);
        // Reputación
        puntaje += Math.min(player.reputacion * 0.15, 15);
        // MVPs
        puntaje += Math.min(player.totalMVPs * 2, 10);
        // Campeonatos INTECO
        puntaje += career.campeonatosGanados.inteco * 8;
        // Campeonatos COMEDUC
        puntaje += career.campeonatosGanados.comeduc * 15;
        // Selecciones
        puntaje += player.vecesSeleccionado * 5;

        puntaje = Math.min(100, Math.round(puntaje));

        // Determinar tipo de final
        let final;
        if (puntaje >= DATOS.finales.leyendaINTECO.reqMin) {
            final = DATOS.finales.leyendaINTECO;
        } else if (puntaje >= DATOS.finales.campeonCOMEDUC.reqMin) {
            final = DATOS.finales.campeonCOMEDUC;
        } else if (puntaje >= DATOS.finales.capitanSeleccion.reqMin) {
            final = DATOS.finales.capitanSeleccion;
        } else if (puntaje >= DATOS.finales.figuraEspecialidad.reqMin) {
            final = DATOS.finales.figuraEspecialidad;
        } else {
            final = DATOS.finales.jugadorCurso;
        }

        return {
            final: final,
            puntaje: puntaje,
            estadisticas: {
                partidosJugados: player.totalPartidos,
                partidosGanados: player.totalGanados,
                goles: player.totalGoles,
                asistencias: player.totalAsistencias,
                mvps: player.totalMVPs,
                nivel: player.nivel,
                overall: player.overall,
                promedioRating: player.promedioRendimiento,
                reputacion: player.reputacion,
                tarjetasAmarillas: player.totalTarjetasAmarillas,
                tarjetasRojas: player.totalTarjetasRojas,
                titulosINTECO: career.campeonatosGanados.inteco,
                titulosCOMEDUC: career.campeonatosGanados.comeduc,
                vecesSeleccionado: player.vecesSeleccionado
            },
            historialTorneos: career.historialTorneos,
            historialSeleccion: career.historialSeleccion
        };
    }
};

console.log('✅ career.js cargado correctamente');
