/**
 * match.js - Motor de simulación de partidos para "Camino a la Leyenda INTECO"
 * Simula partidos de Fútbol 5 y Fútbol 7 con eventos, goles, tarjetas, etc.
 */

const Match = {
    /**
     * Determina si el jugador será titular, suplente o reserva
     * Basado en nivel, rendimiento, estado físico, edad y experiencia
     */
    determinarTitularidad: function(player, año) {
        let probabilidadTitular = 40; // Base 40%

        // Nivel contribuye (+2% por nivel)
        probabilidadTitular += player.nivel * 2;

        // Rendimiento promedio (+rating * 3)
        probabilidadTitular += (player.promedioRendimiento || 5) * 3;

        // Estado físico (si < 50, penalización fuerte)
        if (player.estadoFisico < 30) probabilidadTitular -= 30;
        else if (player.estadoFisico < 50) probabilidadTitular -= 15;
        else if (player.estadoFisico > 80) probabilidadTitular += 10;

        // Moral
        if (player.moral > 70) probabilidadTitular += 5;
        else if (player.moral < 30) probabilidadTitular -= 10;

        // Reputación
        probabilidadTitular += player.reputacion * 0.15;

        // Experiencia (partidos jugados)
        probabilidadTitular += Math.min(player.totalPartidos * 0.5, 10);

        // Tarjetas rojas recientes penalizan
        if (player.totalTarjetasRojas > 0) probabilidadTitular -= 5;

        // Limitar entre 10 y 95
        probabilidadTitular = Math.max(10, Math.min(95, probabilidadTitular));

        const roll = Math.random() * 100;

        if (roll < probabilidadTitular) return 'titular';
        else if (roll < probabilidadTitular + 25) return 'suplente';
        else return 'reserva';
    },

    /**
     * Simula un partido completo entre dos equipos
     * @param {Object} equipoLocal - { id, nombre, fuerza }
     * @param {Object} equipoVisitante - { id, nombre, fuerza }
     * @param {string} formato - 'futbol5' o 'futbol7'
     * @param {Object} player - El jugador del usuario
     * @param {string} equipoJugadorId - ID del equipo del jugador
     * @returns {Object} Resultado del partido con eventos
     */
    simular: function(equipoLocal, equipoVisitante, formato, player, equipoJugadorId) {
        const config = DATOS.formaciones[formato];
        const duracion = config.duracion;
        const esEquipoLocal = equipoLocal.id === equipoJugadorId;
        const esEquipoVisitante = equipoVisitante.id === equipoJugadorId;
        const jugadorParticipa = esEquipoLocal || esEquipoVisitante;

        // Determinar titularidad si el jugador participa
        let rolJugador = 'no_participa';
        if (jugadorParticipa) {
            if (player.partidosSuspendidos && player.partidosSuspendidos > 0) {
                rolJugador = 'reserva';
                player.partidosSuspendidos--;
            } else {
                rolJugador = this.determinarTitularidad(player, player.edad - 13);
            }
        }

        // Calcular fuerzas de equipo
        let fuerzaLocal = equipoLocal.fuerza || this.generarFuerza(equipoLocal);
        let fuerzaVisitante = equipoVisitante.fuerza || this.generarFuerza(equipoVisitante);

        // Si el jugador es titular, su overall afecta la fuerza del equipo
        if (rolJugador === 'titular') {
            const equipoJugador = esEquipoLocal ? 'local' : 'visitante';
            const bonus = (player.overall - 50) * 0.3;
            if (equipoJugador === 'local') fuerzaLocal += bonus;
            else fuerzaVisitante += bonus;
        } else if (rolJugador === 'suplente') {
            const equipoJugador = esEquipoLocal ? 'local' : 'visitante';
            const bonus = (player.overall - 50) * 0.1;
            if (equipoJugador === 'local') fuerzaLocal += bonus;
            else fuerzaVisitante += bonus;
        }

        // Generar goles basado en fuerza
        const golesLocal = this.generarGoles(fuerzaLocal, fuerzaVisitante, formato);
        const golesVisitante = this.generarGoles(fuerzaVisitante, fuerzaLocal, formato);

        // Generar eventos del partido
        const eventos = this.generarEventos(
            equipoLocal, equipoVisitante, golesLocal, golesVisitante,
            duracion, player, rolJugador, esEquipoLocal, formato
        );

        // Calcular estadísticas del jugador en este partido
        const statsJugador = this.calcularStatsJugador(
            eventos, player, rolJugador, esEquipoLocal,
            golesLocal, golesVisitante
        );

        // Determinar resultado desde perspectiva del jugador
        let resultado = 'D';
        if (jugadorParticipa) {
            const golesEquipo = esEquipoLocal ? golesLocal : golesVisitante;
            const golesRival = esEquipoLocal ? golesVisitante : golesLocal;
            if (golesEquipo > golesRival) resultado = 'W';
            else if (golesEquipo < golesRival) resultado = 'L';
        }

        return {
            equipoLocal: equipoLocal,
            equipoVisitante: equipoVisitante,
            golesLocal: golesLocal,
            golesVisitante: golesVisitante,
            formato: formato,
            eventos: eventos,
            rolJugador: rolJugador,
            resultado: resultado,
            statsJugador: statsJugador,
            jugadorParticipa: jugadorParticipa,
            esEquipoLocal: esEquipoLocal
        };
    },

    /**
     * Genera la fuerza de un equipo basada en su año
     */
    generarFuerza: function(equipo) {
        const año = equipo.año || 1;
        const base = 40 + (año - 1) * 5; // 40, 45, 50, 55
        const variacion = Math.floor(Math.random() * 20) - 5; // -5 a +15
        return Math.max(30, Math.min(85, base + variacion));
    },

    /**
     * Genera la fuerza de un equipo COMEDUC
     */
    generarFuerzaCOMEDUC: function(equipo) {
        const base = 55;
        const variacion = Math.floor(Math.random() * 30) - 10;
        // INTECO es ligeramente más fuerte si el jugador es bueno
        if (equipo.id === 'inteco') return base + 10 + Math.floor(Math.random() * 10);
        return Math.max(40, Math.min(90, base + variacion));
    },

    /**
     * Genera cantidad de goles usando distribución tipo Poisson simplificada
     */
    generarGoles: function(fuerzaAtaque, fuerzaDefensa, formato) {
        // Calcular goles esperados
        const diferencial = (fuerzaAtaque - fuerzaDefensa) / 100;
        let golesEsperados;

        if (formato === 'futbol5') {
            golesEsperados = 2.2 + diferencial * 3; // F5 tiene más goles
        } else {
            golesEsperados = 1.6 + diferencial * 2.5;
        }

        golesEsperados = Math.max(0.3, golesEsperados);

        // Generar goles con distribución pseudo-Poisson
        let goles = 0;
        let prob = Math.exp(-golesEsperados);
        let acumulado = prob;
        const rand = Math.random();

        for (let k = 1; k <= 10; k++) {
            prob *= golesEsperados / k;
            acumulado += prob;
            if (rand < acumulado) {
                goles = k - 1;
                break;
            }
            goles = k;
        }

        return Math.min(goles, 8); // Máximo 8 goles por equipo
    },

    /**
     * Genera eventos narrativos del partido
     */
    generarEventos: function(eqLocal, eqVisitante, golesL, golesV, duracion, player, rol, esLocal, formato) {
        const eventos = [];
        const totalGoles = golesL + golesV;
        const minutosGol = this.distribuirMinutos(totalGoles, duracion);

        // Crear array de goles (alternando entre equipos según probabilidad)
        let golesLRestantes = golesL;
        let golesVRestantes = golesV;

        const nombresLocal = this.generarPlantilla(formato, eqLocal.id, player.genero);
        const nombresVisitante = this.generarPlantilla(formato, eqVisitante.id, player.genero);

        // Si el jugador participa, insertar su nombre
        if (rol === 'titular' || rol === 'suplente') {
            const plantilla = esLocal ? nombresLocal : nombresVisitante;
            plantilla[0] = player.nombre;
        }

        minutosGol.forEach(minuto => {
            let equipoGol;
            if (golesLRestantes > 0 && golesVRestantes > 0) {
                equipoGol = Math.random() < golesLRestantes / (golesLRestantes + golesVRestantes) ? 'local' : 'visitante';
            } else if (golesLRestantes > 0) {
                equipoGol = 'local';
            } else {
                equipoGol = 'visitante';
            }

            const esEquipoJugador = (equipoGol === 'local' && esLocal) || (equipoGol === 'visitante' && !esLocal);
            const plantillaGol = equipoGol === 'local' ? nombresLocal : nombresVisitante;
            const plantillaAsist = equipoGol === 'local' ? nombresLocal : nombresVisitante;
            const eqGolId = equipoGol === 'local' ? eqLocal.id : eqVisitante.id;

            // Determinar si el jugador marca/asiste
            let goleador, asistente;
            const participaEnGol = (rol === 'titular') && esEquipoJugador;

            if (participaEnGol) {
                const probGolJugador = this.probGolJugador(player);
                const probAsistJugador = this.probAsistenciaJugador(player);

                if (Math.random() < probGolJugador) {
                    goleador = player.nombre;
                    asistente = plantillaAsist[Math.floor(Math.random() * (plantillaAsist.length - 1)) + 1] || DATOS.generarNombreNPC(eqGolId, player.genero);
                } else if (Math.random() < probAsistJugador) {
                    goleador = plantillaGol[Math.floor(Math.random() * (plantillaGol.length - 1)) + 1] || DATOS.generarNombreNPC(eqGolId, player.genero);
                    asistente = player.nombre;
                } else {
                    goleador = plantillaGol[Math.floor(Math.random() * plantillaGol.length)] || DATOS.generarNombreNPC(eqGolId, player.genero);
                    asistente = Math.random() < 0.7 ? (plantillaAsist[Math.floor(Math.random() * plantillaAsist.length)] || DATOS.generarNombreNPC(eqGolId, player.genero)) : null;
                }
            } else {
                goleador = plantillaGol[Math.floor(Math.random() * plantillaGol.length)] || DATOS.generarNombreNPC(eqGolId, player.genero);
                asistente = Math.random() < 0.7 ? (plantillaAsist[Math.floor(Math.random() * plantillaAsist.length)] || DATOS.generarNombreNPC(eqGolId, player.genero)) : null;
            }

            // Asegurar que goleador y asistente no sean la misma persona
            if (asistente === goleador) asistente = null;

            const equipoNombre = equipoGol === 'local' ? eqLocal.nombre : eqVisitante.nombre;

            eventos.push({
                minuto: minuto,
                tipo: 'gol',
                equipo: equipoGol,
                equipoNombre: equipoNombre,
                goleador: goleador,
                asistente: asistente,
                jugadorInvolucrado: goleador === player.nombre || asistente === player.nombre,
                descripcion: asistente
                    ? `⚽ ¡GOOOL de ${equipoNombre}! ${goleador} marca con asistencia de ${asistente}.`
                    : `⚽ ¡GOOOL de ${equipoNombre}! ${goleador} marca un gran gol.`
            });

            if (equipoGol === 'local') golesLRestantes--;
            else golesVRestantes--;
        });

        // Generar tarjetas amarillas (1-3 por partido)
        const numAmarillas = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numAmarillas; i++) {
            const minuto = Math.floor(Math.random() * duracion) + 1;
            const equipoTarjeta = Math.random() < 0.5 ? 'local' : 'visitante';
            const esEquipoJugador = (equipoTarjeta === 'local' && esLocal) || (equipoTarjeta === 'visitante' && !esLocal);
            const plantilla = equipoTarjeta === 'local' ? nombresLocal : nombresVisitante;
            const eqTarjetaId = equipoTarjeta === 'local' ? eqLocal.id : eqVisitante.id;

            let jugadorTarjeta;
            if (esEquipoJugador && rol === 'titular' && Math.random() < 0.15) {
                jugadorTarjeta = player.nombre;
            } else {
                jugadorTarjeta = plantilla[Math.floor(Math.random() * plantilla.length)] || DATOS.generarNombreNPC(eqTarjetaId, player.genero);
            }

            const equipoNombre = equipoTarjeta === 'local' ? eqLocal.nombre : eqVisitante.nombre;

            eventos.push({
                minuto: minuto,
                tipo: 'tarjeta_amarilla',
                equipo: equipoTarjeta,
                equipoNombre: equipoNombre,
                jugador: jugadorTarjeta,
                jugadorInvolucrado: jugadorTarjeta === player.nombre,
                descripcion: `🟨 Tarjeta amarilla para ${jugadorTarjeta} (${equipoNombre}).`
            });
        }

        // Tarjeta roja (baja probabilidad: 5%)
        if (Math.random() < 0.05) {
            const minuto = Math.floor(Math.random() * duracion) + 1;
            const equipoTarjeta = Math.random() < 0.5 ? 'local' : 'visitante';
            const esEquipoJugador = (equipoTarjeta === 'local' && esLocal) || (equipoTarjeta === 'visitante' && !esLocal);
            const plantilla = equipoTarjeta === 'local' ? nombresLocal : nombresVisitante;
            const eqTarjetaId = equipoTarjeta === 'local' ? eqLocal.id : eqVisitante.id;

            let jugadorTarjeta;
            if (esEquipoJugador && rol === 'titular' && Math.random() < 0.08) {
                jugadorTarjeta = player.nombre;
            } else {
                jugadorTarjeta = plantilla[Math.floor(Math.random() * plantilla.length)] || DATOS.generarNombreNPC(eqTarjetaId, player.genero);
            }

            const equipoNombre = equipoTarjeta === 'local' ? eqLocal.nombre : eqVisitante.nombre;

            eventos.push({
                minuto: minuto,
                tipo: 'tarjeta_roja',
                equipo: equipoTarjeta,
                equipoNombre: equipoNombre,
                jugador: jugadorTarjeta,
                jugadorInvolucrado: jugadorTarjeta === player.nombre,
                descripcion: `🟥 ¡Tarjeta roja! ${jugadorTarjeta} (${equipoNombre}) es expulsado.`
            });
        }

        // Evento de sustitución si el jugador es suplente (entra en 2da mitad)
        if (rol === 'suplente') {
            const minutoEntrada = Math.floor(duracion * 0.5) + Math.floor(Math.random() * (duracion * 0.3));
            eventos.push({
                minuto: minutoEntrada,
                tipo: 'sustitucion',
                equipo: esLocal ? 'local' : 'visitante',
                jugador: player.nombre,
                jugadorInvolucrado: true,
                descripcion: `🔄 ¡Cambio! Entra ${player.nombre} al campo.`
            });
        }

        // Ordenar eventos por minuto
        eventos.sort((a, b) => a.minuto - b.minuto);

        return eventos;
    },

    /**
     * Genera una plantilla de nombres NPC para un equipo
     */
    generarPlantilla: function(formato, equipoId, genero) {
        const cantidad = formato === 'futbol5' ? 5 : 7;
        const nombres = [];
        const usados = new Set();
        
        let pool = null;
        
        // Determinar si es un equipo de INTECO (por ejemplo '1A' o 'inteco')
        const esInteco = equipoId === 'inteco' || /^[1-4][A-E]$/.test(equipoId);
        
        if (esInteco) {
            if (equipoId === 'inteco') {
                pool = DATOS.obtenerAlumnosIntecoPorGenero(genero);
            } else if (DATOS.alumnosInteco && DATOS.alumnosInteco[equipoId]) {
                pool = DATOS.alumnosInteco[equipoId][genero === 'Mujer' ? 'mujeres' : 'hombres'];
            }
        }
        
        if (pool && pool.length > 0) {
            // Copiar pool y barajar
            const tempPool = [...pool];
            for (let i = tempPool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tempPool[i], tempPool[j]] = [tempPool[j], tempPool[i]];
            }
            
            // Añadir nombres de la lista de alumnos
            for (let i = 0; i < Math.min(cantidad, tempPool.length); i++) {
                nombres.push(tempPool[i]);
                usados.add(tempPool[i]);
            }
        }
        
        // Rellenar si faltan nombres (o si no es INTECO)
        while (nombres.length < cantidad) {
            let nombre;
            let intentos = 0;
            do {
                nombre = DATOS.generarNombreNPC(equipoId, genero);
                intentos++;
            } while (usados.has(nombre) && intentos < 100);
            usados.add(nombre);
            nombres.push(nombre);
        }
        
        return nombres;
    },

    /**
     * Distribuye minutos de goles a lo largo del partido
     */
    distribuirMinutos: function(cantidad, duracion) {
        const minutos = [];
        for (let i = 0; i < cantidad; i++) {
            minutos.push(Math.floor(Math.random() * duracion) + 1);
        }
        return minutos.sort((a, b) => a - b);
    },

    /**
     * Probabilidad de que el jugador marque gol
     */
    probGolJugador: function(player) {
        const base = {
            'Delantero': 0.40,
            'Mediocampista': 0.20,
            'Defensa': 0.08,
            'Arquero': 0.02
        };
        let prob = base[player.posicion] || 0.15;
        // Modificar por stats
        prob += (player.stats.tiro - 50) * 0.003;
        prob += (player.overall - 50) * 0.002;
        return Math.max(0.02, Math.min(0.6, prob));
    },

    /**
     * Probabilidad de que el jugador dé asistencia
     */
    probAsistenciaJugador: function(player) {
        const base = {
            'Mediocampista': 0.35,
            'Delantero': 0.20,
            'Defensa': 0.15,
            'Arquero': 0.05
        };
        let prob = base[player.posicion] || 0.15;
        prob += (player.stats.pase - 50) * 0.003;
        return Math.max(0.03, Math.min(0.5, prob));
    },

    /**
     * Calcula estadísticas del jugador en este partido
     */
    calcularStatsJugador: function(eventos, player, rol, esLocal, golesL, golesV) {
        let goles = 0, asistencias = 0, tarjetasAmarillas = 0, tarjetasRojas = 0;

        eventos.forEach(e => {
            if (e.jugadorInvolucrado || false) {
                if (e.tipo === 'gol' && e.goleador === player.nombre) goles++;
                if (e.tipo === 'gol' && e.asistente === player.nombre) asistencias++;
                if (e.tipo === 'tarjeta_amarilla' && e.jugador === player.nombre) tarjetasAmarillas++;
                if (e.tipo === 'tarjeta_roja' && e.jugador === player.nombre) tarjetasRojas++;
            }
        });

        // Calcular rating del partido (1.0 - 10.0)
        let rating = 5.0;
        if (rol === 'titular') {
            rating += goles * 1.2;
            rating += asistencias * 0.8;
            rating -= tarjetasAmarillas * 0.5;
            rating -= tarjetasRojas * 2.0;
            // Bonus por victoria
            const golesEquipo = esLocal ? golesL : golesV;
            const golesRival = esLocal ? golesV : golesL;
            if (golesEquipo > golesRival) rating += 0.8;
            else if (golesEquipo < golesRival) rating -= 0.5;
            // Variación aleatoria
            rating += (Math.random() * 1.5) - 0.5;
        } else if (rol === 'suplente') {
            rating = 4.5;
            rating += goles * 1.5; // Más impacto si marca entrando de cambio
            rating += asistencias * 1.0;
            rating += (Math.random() * 1.0);
        } else {
            rating = 0; // No jugó
        }
        rating = Math.max(1.0, Math.min(10.0, rating));
        rating = parseFloat(rating.toFixed(1));

        // Determinar MVP (rating >= 8.0 y fue titular)
        const mvp = rating >= 8.0 && (rol === 'titular' || rol === 'suplente');

        // Calcular XP ganada
        let xp = 0;
        const golesEquipo = esLocal ? golesL : golesV;
        const golesRival = esLocal ? golesV : golesL;

        if (rol !== 'reserva') {
            xp += goles * DATOS.xpRecompensas.gol;
            xp += asistencias * DATOS.xpRecompensas.asistencia;
            if (mvp) xp += DATOS.xpRecompensas.mvp;
            if (golesEquipo > golesRival) xp += DATOS.xpRecompensas.victoria;
            else if (golesEquipo === golesRival) xp += DATOS.xpRecompensas.empate;
            else xp += DATOS.xpRecompensas.derrota;
            xp += tarjetasAmarillas * DATOS.xpRecompensas.tarjetaAmarilla;
            xp += tarjetasRojas * DATOS.xpRecompensas.tarjetaRoja;
            if (rol === 'titular') xp += DATOS.xpRecompensas.titular;
            else xp += DATOS.xpRecompensas.suplente;
            // Portería invicta para arqueros
            if (player.posicion === 'Arquero' && golesRival === 0 && rol === 'titular') {
                xp += DATOS.xpRecompensas.porteriaInvicta;
            }
        }
        xp = Math.max(0, xp);

        // Determinar resultado
        let resultado = 'D';
        if (golesEquipo > golesRival) resultado = 'W';
        else if (golesEquipo < golesRival) resultado = 'L';

        return {
            goles, asistencias, tarjetasAmarillas, tarjetasRojas,
            rating, mvp, xp, resultado, rol
        };
    },

    /**
     * Simula un partido donde el jugador NO participa (solo resultado)
     */
    simularSinJugador: function(equipo1, equipo2, formato) {
        const fuerza1 = equipo1.fuerza || this.generarFuerza(equipo1);
        const fuerza2 = equipo2.fuerza || this.generarFuerza(equipo2);
        const goles1 = this.generarGoles(fuerza1, fuerza2, formato);
        const goles2 = this.generarGoles(fuerza2, fuerza1, formato);
        return { goles1, goles2 };
    }
};

console.log('✅ match.js cargado correctamente');
