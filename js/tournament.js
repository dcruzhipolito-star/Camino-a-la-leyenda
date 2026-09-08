/**
 * tournament.js - Sistema de campeonatos para "Camino a la Leyenda INTECO"
 * Gestiona campeonatos INTECO (1er y 2do semestre) y COMEDUC.
 */

const Tournament = {

    /**
     * Crea un campeonato INTECO (20 equipos, 4 grupos de 5)
     * @param {number} año - Año escolar actual
     * @param {number} semestre - 1 o 2
     * @param {string} equipoJugadorId - ID del equipo del jugador
     * @returns {Object} Estado del torneo
     */
    crearCampeonatoINTECO: function(año, semestre, equipoJugadorId) {
        const todosEquipos = DATOS.obtenerTodosLosEquipos().map(e => ({
            id: e.id,
            nombre: e.nombre,
            año: e.año,
            fuerza: Match.generarFuerza(e),
            esJugador: e.id === equipoJugadorId,
            pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0
        }));

        // Sortear grupos asegurando que el equipo del jugador quede en un grupo
        const grupos = this.sortearGrupos(todosEquipos, 4, equipoJugadorId);

        // Generar calendario de partidos para cada grupo
        grupos.forEach(grupo => {
            grupo.partidos = this.generarCalendarioGrupo(grupo.equipos);
        });

        // Determinar formato (aleatorio entre F5 y F7, o basado en semestre)
        const formato = semestre === 1 ? 'futbol5' : 'futbol7';

        return {
            tipo: 'inteco',
            nombre: `Campeonato INTECO ${semestre === 1 ? '1er' : '2do'} Semestre`,
            año: año,
            semestre: semestre,
            formato: formato,
            grupos: grupos,
            fase: 'grupo', // 'grupo', 'cuartos', 'semis', 'final', 'completado'
            jornadaActual: 0,
            totalJornadas: 4, // Cada equipo juega 4 partidos en grupo
            eliminatorias: null,
            campeon: null,
            goleadores: [],
            mvps: [],
            equipoJugadorId: equipoJugadorId,
            grupoJugador: grupos.findIndex(g => g.equipos.some(e => e.esJugador)),
            partidosJugados: 0
        };
    },

    /**
     * Crea un campeonato COMEDUC (19 establecimientos, 4 grupos)
     * @param {Object} player - El jugador
     * @returns {Object} Estado del torneo
     */
    crearCampeonatoCOMEDUC: function(player) {
        const equipos = DATOS.comeduc.map(c => ({
            id: c.id,
            nombre: c.nombre,
            abrev: c.abrev,
            logo: c.logo || null,
            fuerza: Match.generarFuerzaCOMEDUC(c),
            esJugador: c.id === 'inteco',
            pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0
        }));


        // INTECO es más fuerte si el jugador es bueno
        const inteco = equipos.find(e => e.id === 'inteco');
        if (inteco) {
            inteco.fuerza = Math.min(90, inteco.fuerza + Math.floor(player.overall * 0.2));
        }

        // 19 equipos en 4 grupos: 5+5+5+4
        const grupos = this.sortearGruposCOMEDUC(equipos);

        grupos.forEach(grupo => {
            grupo.partidos = this.generarCalendarioGrupo(grupo.equipos);
        });

        return {
            tipo: 'comeduc',
            nombre: 'Campeonato COMEDUC',
            año: null,
            semestre: null,
            formato: 'futbol7', // COMEDUC siempre en F7
            grupos: grupos,
            fase: 'grupo',
            jornadaActual: 0,
            totalJornadas: null, // Variable por grupo
            eliminatorias: null,
            campeon: null,
            goleadores: [],
            mvps: [],
            equipoJugadorId: 'inteco',
            grupoJugador: grupos.findIndex(g => g.equipos.some(e => e.esJugador)),
            partidosJugados: 0
        };
    },

    /**
     * Sortea equipos en grupos (garantiza que el equipo del jugador esté en uno)
     */
    sortearGrupos: function(equipos, numGrupos, equipoJugadorId) {
        const shuffled = [...equipos];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const grupos = [];
        const porGrupo = Math.ceil(equipos.length / numGrupos);
        const letras = ['A', 'B', 'C', 'D'];

        for (let i = 0; i < numGrupos; i++) {
            grupos.push({
                nombre: `Grupo ${letras[i]}`,
                letra: letras[i],
                equipos: shuffled.slice(i * porGrupo, (i + 1) * porGrupo),
                partidos: [],
                completado: false
            });
        }

        return grupos;
    },

    /**
     * Sortea grupos para COMEDUC (19 equipos: 5+5+5+4)
     */
    sortearGruposCOMEDUC: function(equipos) {
        const shuffled = [...equipos];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Asegurar que INTECO esté primero para que quede en un grupo
        const intecoIdx = shuffled.findIndex(e => e.id === 'inteco');
        if (intecoIdx > 0) {
            [shuffled[0], shuffled[intecoIdx]] = [shuffled[intecoIdx], shuffled[0]];
        }

        const letras = ['A', 'B', 'C', 'D'];
        // Distribución: 5+5+5+4
        const distribucion = [5, 5, 5, 4];
        const grupos = [];
        let idx = 0;

        for (let i = 0; i < 4; i++) {
            grupos.push({
                nombre: `Grupo ${letras[i]}`,
                letra: letras[i],
                equipos: shuffled.slice(idx, idx + distribucion[i]),
                partidos: [],
                completado: false
            });
            idx += distribucion[i];
        }

        return grupos;
    },

    /**
     * Genera calendario round-robin para un grupo
     */
    generarCalendarioGrupo: function(equipos) {
        const partidos = [];
        for (let i = 0; i < equipos.length; i++) {
            for (let j = i + 1; j < equipos.length; j++) {
                partidos.push({
                    equipo1: equipos[i],
                    equipo2: equipos[j],
                    goles1: null,
                    goles2: null,
                    jugado: false,
                    esPartidoJugador: equipos[i].esJugador || equipos[j].esJugador,
                    eventos: []
                });
            }
        }
        // Mezclar orden de partidos
        for (let i = partidos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [partidos[i], partidos[j]] = [partidos[j], partidos[i]];
        }
        // Mover partidos del jugador para que estén espaciados
        const partidosJugador = partidos.filter(p => p.esPartidoJugador);
        const partidosOtros = partidos.filter(p => !p.esPartidoJugador);
        const reordenados = [];
        let jIdx = 0, oIdx = 0;

        while (jIdx < partidosJugador.length || oIdx < partidosOtros.length) {
            if (jIdx < partidosJugador.length) {
                reordenados.push(partidosJugador[jIdx++]);
            }
            // Intercalar 1-2 partidos de otros
            const otrosIntercalar = Math.min(Math.floor(Math.random() * 2) + 1, partidosOtros.length - oIdx);
            for (let k = 0; k < otrosIntercalar; k++) {
                if (oIdx < partidosOtros.length) {
                    reordenados.push(partidosOtros[oIdx++]);
                }
            }
        }

        return reordenados;
    },

    /**
     * Obtiene el próximo partido del jugador en el torneo
     */
    obtenerProximoPartidoJugador: function(torneo) {
        const grupo = torneo.grupos[torneo.grupoJugador];
        if (!grupo) return null;

        if (torneo.fase === 'grupo') {
            return grupo.partidos.find(p => p.esPartidoJugador && !p.jugado) || null;
        }

        if (torneo.eliminatorias) {
            const faseActual = torneo.eliminatorias[torneo.fase];
            if (faseActual) {
                return faseActual.find(p => p.esPartidoJugador && !p.jugado) || null;
            }
        }

        return null;
    },

    /**
     * Simula los partidos de otros equipos que no son del jugador hasta llegar al próximo partido del jugador
     */
    simularPartidosHasta: function(torneo, formato, player) {
        if (torneo.fase === 'grupo') {
            const grupo = torneo.grupos[torneo.grupoJugador];
            for (const partido of grupo.partidos) {
                if (partido.jugado) continue;
                if (partido.esPartidoJugador) break; // Llegamos al partido del jugador

                // Simular partido sin jugador
                const resultado = Match.simularSinJugador(partido.equipo1, partido.equipo2, formato);
                partido.goles1 = resultado.goles1;
                partido.goles2 = resultado.goles2;
                partido.jugado = true;

                // Actualizar standings
                this.actualizarStandings(partido.equipo1, partido.equipo2, resultado.goles1, resultado.goles2);
            }

            // Simular partidos de OTROS grupos completamente
            torneo.grupos.forEach((g, idx) => {
                if (idx === torneo.grupoJugador) return;
                g.partidos.forEach(partido => {
                    if (partido.jugado) return;
                    const resultado = Match.simularSinJugador(partido.equipo1, partido.equipo2, formato);
                    partido.goles1 = resultado.goles1;
                    partido.goles2 = resultado.goles2;
                    partido.jugado = true;
                    this.actualizarStandings(partido.equipo1, partido.equipo2, resultado.goles1, resultado.goles2);
                });
            });
        }
    },

    /**
     * Juega un partido del jugador y registra resultado
     */
    jugarPartidoJugador: function(torneo, player) {
        let partido;
        let equipoJugador, equipoRival;

        if (torneo.fase === 'grupo') {
            const grupo = torneo.grupos[torneo.grupoJugador];
            partido = grupo.partidos.find(p => p.esPartidoJugador && !p.jugado);
        } else if (torneo.eliminatorias && torneo.eliminatorias[torneo.fase]) {
            partido = torneo.eliminatorias[torneo.fase].find(p => p.esPartidoJugador && !p.jugado);
        }

        if (!partido) return null;

        // Determinar cuál equipo es el del jugador
        if (partido.equipo1.esJugador) {
            equipoJugador = partido.equipo1;
            equipoRival = partido.equipo2;
        } else {
            equipoJugador = partido.equipo2;
            equipoRival = partido.equipo1;
        }

        // Simular partido con el jugador
        const resultado = Match.simular(
            partido.equipo1, partido.equipo2,
            torneo.formato, player, torneo.equipoJugadorId
        );

        partido.goles1 = resultado.golesLocal;
        partido.goles2 = resultado.golesVisitante;
        partido.jugado = true;
        partido.eventos = resultado.eventos;
        partido.resultado = resultado;

        // Actualizar standings en fase de grupo
        if (torneo.fase === 'grupo') {
            this.actualizarStandings(partido.equipo1, partido.equipo2, resultado.golesLocal, resultado.golesVisitante);
        }

        torneo.partidosJugados++;

        return resultado;
    },

    /**
     * Actualiza la tabla de posiciones
     */
    actualizarStandings: function(equipo1, equipo2, goles1, goles2) {
        equipo1.pj++;
        equipo2.pj++;
        equipo1.gf += goles1;
        equipo1.gc += goles2;
        equipo2.gf += goles2;
        equipo2.gc += goles1;

        if (goles1 > goles2) {
            equipo1.pg++;
            equipo1.pts += 3;
            equipo2.pp++;
        } else if (goles2 > goles1) {
            equipo2.pg++;
            equipo2.pts += 3;
            equipo1.pp++;
        } else {
            equipo1.pe++;
            equipo2.pe++;
            equipo1.pts += 1;
            equipo2.pts += 1;
        }
    },

    /**
     * Obtiene standings ordenados de un grupo
     */
    obtenerStandings: function(grupo) {
        return [...grupo.equipos].sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            const dgA = a.gf - a.gc;
            const dgB = b.gf - b.gc;
            if (dgB !== dgA) return dgB - dgA;
            return b.gf - a.gf;
        });
    },

    /**
     * Verifica si la fase de grupo está completa
     */
    faseGrupoCompleta: function(torneo) {
        return torneo.grupos.every(g =>
            g.partidos.every(p => p.jugado)
        );
    },

    /**
     * Completa todos los partidos restantes del grupo del jugador (los que no son del jugador)
     */
    completarGrupoJugador: function(torneo) {
        const grupo = torneo.grupos[torneo.grupoJugador];
        grupo.partidos.forEach(partido => {
            if (partido.jugado || partido.esPartidoJugador) return;
            const resultado = Match.simularSinJugador(partido.equipo1, partido.equipo2, torneo.formato);
            partido.goles1 = resultado.goles1;
            partido.goles2 = resultado.goles2;
            partido.jugado = true;
            this.actualizarStandings(partido.equipo1, partido.equipo2, resultado.goles1, resultado.goles2);
        });
    },

    /**
     * Genera el cuadro de eliminatorias (cuartos de final)
     * Clasifican los 2 primeros de cada grupo (8 equipos)
     */
    generarEliminatorias: function(torneo) {
        // Obtener clasificados (top 2 de cada grupo)
        const clasificados = [];
        torneo.grupos.forEach(grupo => {
            const standings = this.obtenerStandings(grupo);
            clasificados.push({
                primero: { ...standings[0], pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 },
                segundo: { ...standings[1], pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 }
            });
        });

        // Cuartos: 1°A vs 2°B, 1°B vs 2°A, 1°C vs 2°D, 1°D vs 2°C
        const cuartos = [
            this.crearPartidoEliminatoria(clasificados[0].primero, clasificados[1].segundo, torneo.equipoJugadorId),
            this.crearPartidoEliminatoria(clasificados[1].primero, clasificados[0].segundo, torneo.equipoJugadorId),
            this.crearPartidoEliminatoria(clasificados[2].primero, clasificados[3].segundo, torneo.equipoJugadorId),
            this.crearPartidoEliminatoria(clasificados[3].primero, clasificados[2].segundo, torneo.equipoJugadorId)
        ];

        torneo.eliminatorias = {
            cuartos: cuartos,
            semis: [],
            final: []
        };

        torneo.fase = 'cuartos';

        return clasificados;
    },

    /**
     * Crea un partido de eliminatoria
     */
    crearPartidoEliminatoria: function(equipo1, equipo2, equipoJugadorId) {
        return {
            equipo1: equipo1,
            equipo2: equipo2,
            goles1: null,
            goles2: null,
            jugado: false,
            esPartidoJugador: equipo1.id === equipoJugadorId || equipo2.id === equipoJugadorId ||
                              equipo1.esJugador || equipo2.esJugador,
            ganador: null,
            eventos: []
        };
    },

    /**
     * Juega una ronda de eliminatorias
     * @returns {Object} Resultados de la ronda
     */
    jugarRondaEliminatoria: function(torneo, player) {
        const ronda = torneo.eliminatorias[torneo.fase];
        const resultados = [];

        for (const partido of ronda) {
            if (partido.jugado) continue;

            let resultado;
            if (partido.esPartidoJugador) {
                resultado = Match.simular(
                    partido.equipo1, partido.equipo2,
                    torneo.formato, player, torneo.equipoJugadorId
                );
                partido.eventos = resultado.eventos;
            } else {
                const sim = Match.simularSinJugador(partido.equipo1, partido.equipo2, torneo.formato);
                resultado = {
                    golesLocal: sim.goles1,
                    golesVisitante: sim.goles2,
                    eventos: [],
                    statsJugador: null
                };
            }

            partido.goles1 = resultado.golesLocal;
            partido.goles2 = resultado.golesVisitante;
            partido.jugado = true;

            // En eliminatorias, si hay empate se van a penales (random)
            if (partido.goles1 === partido.goles2) {
                const penales = Math.random() < 0.5;
                if (penales) {
                    partido.goles1 += 0.5; // Marcar que ganó por penales
                    partido.ganador = partido.equipo1;
                    partido.penales = true;
                } else {
                    partido.goles2 += 0.5;
                    partido.ganador = partido.equipo2;
                    partido.penales = true;
                }
            } else {
                partido.ganador = partido.goles1 > partido.goles2 ? partido.equipo1 : partido.equipo2;
            }

            partido.resultado = resultado;
            resultados.push(partido);
        }

        // Generar siguiente ronda
        const ganadores = ronda.map(p => p.ganador);

        if (torneo.fase === 'cuartos') {
            // Generar semifinales
            torneo.eliminatorias.semis = [
                this.crearPartidoEliminatoria(ganadores[0], ganadores[1], torneo.equipoJugadorId),
                this.crearPartidoEliminatoria(ganadores[2], ganadores[3], torneo.equipoJugadorId)
            ];
            torneo.fase = 'semis';
        } else if (torneo.fase === 'semis') {
            // Generar final
            torneo.eliminatorias.final = [
                this.crearPartidoEliminatoria(ganadores[0], ganadores[1], torneo.equipoJugadorId)
            ];
            torneo.fase = 'final';
        } else if (torneo.fase === 'final') {
            torneo.campeon = ganadores[0];
            torneo.fase = 'completado';
        }

        return { resultados, ganadores, fase: torneo.fase };
    },

    /**
     * Verifica si el equipo del jugador clasificó a eliminatorias
     */
    equipoJugadorClasifico: function(torneo) {
        const grupo = torneo.grupos[torneo.grupoJugador];
        const standings = this.obtenerStandings(grupo);
        const posicion = standings.findIndex(e => e.esJugador);
        return posicion < 2; // Top 2 clasifican
    },

    /**
     * Obtiene posición del equipo del jugador en su grupo
     */
    posicionEquipoJugador: function(torneo) {
        const grupo = torneo.grupos[torneo.grupoJugador];
        const standings = this.obtenerStandings(grupo);
        return standings.findIndex(e => e.esJugador) + 1;
    },

    /**
     * Verifica si el equipo del jugador está en la ronda actual de eliminatorias
     */
    equipoJugadorEnEliminatoria: function(torneo) {
        if (!torneo.eliminatorias) return false;
        const ronda = torneo.eliminatorias[torneo.fase];
        if (!ronda) return false;
        return ronda.some(p => p.esPartidoJugador);
    },

    /**
     * Obtiene resumen del torneo
     */
    obtenerResumen: function(torneo) {
        return {
            nombre: torneo.nombre,
            tipo: torneo.tipo,
            fase: torneo.fase,
            formato: torneo.formato,
            campeon: torneo.campeon ? torneo.campeon.nombre : null,
            grupos: torneo.grupos.map(g => ({
                nombre: g.nombre,
                standings: this.obtenerStandings(g).map(e => ({
                    nombre: e.nombre || e.abrev,
                    pj: e.pj, pg: e.pg, pe: e.pe, pp: e.pp,
                    gf: e.gf, gc: e.gc, dg: e.gf - e.gc, pts: e.pts,
                    esJugador: e.esJugador
                }))
            })),
            eliminatorias: torneo.eliminatorias
        };
    },

    /**
     * Verifica si quedan partidos del jugador en fase de grupo
     */
    quedanPartidosGrupoJugador: function(torneo) {
        if (torneo.fase !== 'grupo') return false;
        const grupo = torneo.grupos[torneo.grupoJugador];
        return grupo.partidos.some(p => p.esPartidoJugador && !p.jugado);
    }
};

console.log('✅ tournament.js cargado correctamente');
