/**
 * ui.js - Módulo de interfaz de usuario para "Camino a la Leyenda INTECO"
 * Renderiza todas las pantallas, componentes y maneja navegación.
 */

const UI = {
    pantallaActual: null,
    animacionesActivas: true,

    // ========== NAVEGACIÓN ==========

    /**
     * Muestra una pantalla y oculta las demás
     */
    mostrarPantalla: function(pantallaId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });

        const pantalla = document.getElementById(pantallaId);
        if (pantalla) {
            pantalla.classList.add('active');
            this.pantallaActual = pantallaId;
            // Scroll al inicio
            pantalla.scrollTop = 0;
        }
    },

    // ========== MENÚ PRINCIPAL ==========

    renderMenuPrincipal: function() {
        const container = document.getElementById('menu-content');
        const haySave = Storage.hasSavedGame();

        container.innerHTML = `
            <div class="menu-logo">
                <div class="logo-icon">⚽</div>
                <h1 class="game-title">CAMINO A LA<br><span class="title-highlight">LEYENDA</span></h1>
                <p class="game-subtitle">INSTITUTO TECNOLÓGICO Y COMERCIAL RECOLETA</p>
            </div>
            <div class="menu-buttons">
                <button class="btn-primary btn-glow" onclick="App.nuevaCarrera()">
                    <span class="btn-icon">🆕</span> Nueva Carrera
                </button>
                ${haySave ? `
                <button class="btn-secondary btn-glow" onclick="App.continuarCarrera()">
                    <span class="btn-icon">▶️</span> Continuar Carrera
                </button>
                <button class="btn-danger" onclick="App.borrarCarrera()">
                    <span class="btn-icon">🗑️</span> Borrar Datos
                </button>
                ` : ''}
            </div>
            <div class="menu-footer">
                <p>Versión 1.0 — INTECO 2026</p>
            </div>
        `;

        this.mostrarPantalla('screen-menu');
    },

    // ========== CREAR JUGADOR ==========

    renderCrearJugador: function() {
        const container = document.getElementById('create-content');

        // Generar opciones de nacionalidad
        const opcionesNac = DATOS.nacionalidades.map(n =>
            `<option value="${n}">${DATOS.banderas[n]} ${n}</option>`
        ).join('');

        // Generar opciones de posición
        const opcionesPos = DATOS.posiciones.map(p =>
            `<option value="${p}" ${p === 'Delantero' ? 'selected' : ''}>${p}</option>`
        ).join('');

        // Generar opciones de equipo (solo 1° Medio para año 1)
        const opcionesEquipo = DATOS.equipos[1].map(e =>
            `<option value="${e.id}">${e.nombre}</option>`
        ).join('');

        container.innerHTML = `
            <div class="create-header">
                <button class="btn-back" onclick="UI.renderMenuPrincipal()">← Volver</button>
                <h2>Crear tu Jugador</h2>
                <p class="subtitle">Comienza tu camino a la leyenda</p>
            </div>
            <form id="form-crear-jugador" class="create-form" onsubmit="App.crearJugador(event)">
                <div class="form-group">
                    <label for="input-nombre">
                        <span class="label-icon">👤</span> Nombre del Jugador
                    </label>
                    <input type="text" id="input-nombre" required maxlength="30"
                           placeholder="Ingresa tu nombre..." class="input-field">
                </div>
                <div class="form-group">
                    <label for="input-nacionalidad">
                        <span class="label-icon">🌎</span> Nacionalidad
                    </label>
                    <select id="input-nacionalidad" required class="input-field">
                        ${opcionesNac}
                    </select>
                </div>
                <div class="form-group">
                    <label for="input-genero">
                        <span class="label-icon">🚻</span> Categoría
                    </label>
                    <select id="input-genero" required class="input-field">
                        <option value="Hombre">👨 Masculino</option>
                        <option value="Mujer">👩 Femenino</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="input-camiseta">
                            <span class="label-icon">👕</span> N° Camiseta
                        </label>
                        <input type="number" id="input-camiseta" required min="1" max="99"
                               value="10" class="input-field">
                    </div>
                    <div class="form-group">
                        <label for="input-posicion">
                            <span class="label-icon">📍</span> Posición
                        </label>
                        <select id="input-posicion" required class="input-field"
                                onchange="UI.previewStats(this.value)">
                            ${opcionesPos}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="input-equipo">
                        <span class="label-icon">🏫</span> Curso (1° Medio)
                    </label>
                    <select id="input-equipo" required class="input-field">
                        ${opcionesEquipo}
                    </select>
                </div>
                <div class="stats-preview" id="stats-preview">
                    <h3>Vista previa de estadísticas</h3>
                    <div id="preview-bars"></div>
                </div>
                <button type="submit" class="btn-primary btn-glow btn-large">
                    <span class="btn-icon">🚀</span> ¡Comenzar Carrera!
                </button>
            </form>
        `;

        this.previewStats('Delantero');
        this.mostrarPantalla('screen-create');
    },

    /**
     * Muestra preview de stats según posición
     */
    previewStats: function(posicion) {
        const rangos = DATOS.statsIniciales[posicion];
        const container = document.getElementById('preview-bars');
        if (!container) return;

        const statsLabels = {
            velocidad: { label: 'Velocidad', icon: '⚡' },
            tiro: { label: 'Tiro', icon: '🎯' },
            pase: { label: 'Pase', icon: '📨' },
            defensa: { label: 'Defensa', icon: '🛡️' },
            resistencia: { label: 'Resistencia', icon: '💪' }
        };

        let html = '';
        for (const [stat, [min, max]] of Object.entries(rangos)) {
            const avg = Math.floor((min + max) / 2);
            const info = statsLabels[stat];
            html += `
                <div class="stat-bar-container">
                    <span class="stat-label">${info.icon} ${info.label}</span>
                    <div class="stat-bar-bg">
                        <div class="stat-bar-fill" style="width: ${avg}%"></div>
                    </div>
                    <span class="stat-value">${min}-${max}</span>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    // ========== DASHBOARD ==========

    renderDashboard: function(gameState) {
        const container = document.getElementById('dashboard-content');
        const player = gameState.player;
        const career = gameState.career;

        const ultimoEntreno = player.ultimoPartidoEntrenado !== undefined ? player.ultimoPartidoEntrenado : -2;
        const puedeEntrenar = (player.totalPartidos - ultimoEntreno) >= 2;
        const btnEntrenarText = puedeEntrenar ? '<span class="btn-icon">🏋️</span> Entrenar' : `<span class="btn-icon">⏳</span> Juega ${2 - (player.totalPartidos - ultimoEntreno)} partido(s) más`;

        container.innerHTML = `
            <div class="dashboard-header">
                <div class="header-info">
                    <div class="year-badge">${DATOS.años[career.año - 1]}</div>
                    <span class="semester-badge">Semestre ${career.semestre}</span>
                </div>
                <div class="header-actions">
                    <button class="btn-icon-only" onclick="App.guardarJuego()" title="Guardar">💾</button>
                </div>
            </div>

            ${this.componentePlayerCard(player, career)}

            <div class="dashboard-grid">
                <div class="dash-card" onclick="UI.renderEstadisticas(App.gameState)">
                    <div class="dash-card-icon">📊</div>
                    <div class="dash-card-title">Estadísticas</div>
                    <div class="dash-card-value">${player.totalPartidos} PJ</div>
                </div>
                <div class="dash-card" onclick="UI.renderNoticias()">
                    <div class="dash-card-icon">📰</div>
                    <div class="dash-card-title">Noticias</div>
                    <div class="dash-card-value">${News.obtenerNoLeidas().length} nuevas</div>
                </div>
                <div class="dash-card" onclick="UI.renderLogros()">
                    <div class="dash-card-icon">🏆</div>
                    <div class="dash-card-title">Logros</div>
                    <div class="dash-card-value">${Achievements.cantidadDesbloqueados()}/${Achievements.totalLogros()}</div>
                </div>
                <div class="dash-card" onclick="UI.renderHistorial(App.gameState)">
                    <div class="dash-card-icon">📋</div>
                    <div class="dash-card-title">Historial</div>
                    <div class="dash-card-value">${career.historialPartidos.length} partidos</div>
                </div>
            </div>

            <div class="dashboard-action">
                <button class="btn-secondary btn-glow btn-large" ${!puedeEntrenar ? 'disabled' : ''} onclick="UI.mostrarModalEntrenamiento()" style="margin-bottom: 10px; width: 100%;">
                    ${btnEntrenarText}
                </button>
                <button class="btn-primary btn-glow btn-large btn-continue" onclick="App.continuar()">
                    <span class="btn-icon">▶️</span> Continuar Carrera
                </button>
                <p class="action-hint">${this.obtenerTextoFase(career)}</p>
            </div>
        `;

        this.mostrarPantalla('screen-dashboard');
    },

    /**
     * Obtiene texto descriptivo de la fase actual
     */
    obtenerTextoFase: function(career) {
        const textos = {
            'inicio_semestre': `Preparándose para el campeonato del ${career.semestre === 1 ? '1er' : '2do'} semestre...`,
            'torneo_grupo': 'Próximo partido de fase de grupos...',
            'torneo_eliminatorias': 'Eliminatorias del campeonato...',
            'fin_torneo': 'Resultados del campeonato...',
            'entre_semestres': 'Comienza el 2° semestre...',
            'evaluacion_seleccion': 'Evaluación para la Selección INTECO...',
            'comeduc': 'Campeonato COMEDUC por comenzar...',
            'comeduc_grupo': 'Fase de grupos del COMEDUC...',
            'comeduc_eliminatorias': 'Eliminatorias del COMEDUC...',
            'fin_comeduc': 'Resultados del COMEDUC...',
            'fin_año': 'Fin del año escolar...',
            'carrera_terminada': 'Tu carrera ha terminado...'
        };
        return textos[career.fase] || 'Avanzar en tu carrera...';
    },

    // ========== COMPONENTE: PLAYER CARD ==========

    componentePlayerCard: function(player, career) {
        const statsLabels = {
            velocidad: { label: 'VEL', icon: '⚡' },
            tiro: { label: 'TIR', icon: '🎯' },
            pase: { label: 'PAS', icon: '📨' },
            defensa: { label: 'DEF', icon: '🛡️' },
            resistencia: { label: 'RES', icon: '💪' }
        };

        let statsBars = '';
        for (const [stat, info] of Object.entries(statsLabels)) {
            const valor = player.stats[stat];
            const colorClass = valor >= 70 ? 'stat-high' : (valor >= 50 ? 'stat-mid' : 'stat-low');
            statsBars += `
                <div class="stat-bar-container mini">
                    <span class="stat-label-mini">${info.label}</span>
                    <div class="stat-bar-bg">
                        <div class="stat-bar-fill ${colorClass}" style="width: ${valor}%"></div>
                    </div>
                    <span class="stat-value-mini">${valor}</span>
                </div>
            `;
        }

        const xpPercent = (player.xp / player.xpParaSiguiente * 100).toFixed(0);

        const equipo = DATOS.obtenerEquipoPorId(career.equipoActualId);
        const equipoNombre = equipo ? equipo.nombre : career.equipoActualId;

        return `
            <div class="player-card">
                <div class="player-card-header">
                    <div class="player-overall">
                        <span class="overall-number">${player.overall}</span>
                        <span class="overall-label">OVR</span>
                    </div>
                    <div class="player-info-main">
                        <div class="player-position-badge">${player.posicionAbrev}</div>
                        <h2 class="player-name">${player.nombre}</h2>
                        <div class="player-meta">
                            <span>${player.bandera} ${player.nacionalidad}</span>
                            <span>🏫 ${equipoNombre}</span>
                            <span>👕 #${player.numeroCamiseta}</span>
                            <span>🎂 ${player.edad} años</span>
                        </div>
                    </div>
                    <div class="player-level-badge">
                        <span class="level-number">Nv.${player.nivel}</span>
                    </div>
                </div>
                <div class="player-card-stats">
                    ${statsBars}
                </div>
                <div class="player-card-meta">
                    <div class="meta-item">
                        <div class="meta-label">XP</div>
                        <div class="xp-bar-bg">
                            <div class="xp-bar-fill" style="width: ${xpPercent}%"></div>
                        </div>
                        <span class="meta-value">${player.xp}/${player.xpParaSiguiente}</span>
                    </div>
                    <div class="meta-row">
                        <div class="meta-item small">
                            <span class="meta-icon">⭐</span>
                            <span class="meta-label">Reputación</span>
                            <span class="meta-value">${player.reputacion}</span>
                        </div>
                        <div class="meta-item small">
                            <span class="meta-icon">😊</span>
                            <span class="meta-label">Moral</span>
                            <span class="meta-value">${player.moral}</span>
                        </div>
                        <div class="meta-item small">
                            <span class="meta-icon">💚</span>
                            <span class="meta-label">Fitness</span>
                            <span class="meta-value">${player.estadoFisico}</span>
                        </div>
                    </div>
                    <div class="meta-row" style="margin-top: 8px;">
                        <div class="meta-item small" title="Comportamiento Escolar / Conducta">
                            <span class="meta-icon">🎒</span>
                            <span class="meta-label">Conducta</span>
                            <span class="meta-value">${player.comportamiento ?? 100}%</span>
                        </div>
                        <div class="meta-item small" style="${(player.partidosSuspendidos ?? 0) > 0 ? 'background: rgba(255, 71, 87, 0.2); border: 1px solid var(--danger);' : ''}" title="Sanción / Partidos Suspendidos">
                            <span class="meta-icon">🚫</span>
                            <span class="meta-label">Sanción</span>
                            <span class="meta-value">${(player.partidosSuspendidos ?? 0) > 0 ? `${player.partidosSuspendidos} Part.` : 'Ninguna'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== PANTALLA DE EVENTO/RESULTADO ==========

    renderEvento: function(datos) {
        const container = document.getElementById('event-content');

        switch (datos.accion) {
            case 'inicio_torneo':
                this.renderInicioTorneo(container, datos.datos);
                break;
            case 'resultado_partido':
                this.renderResultadoPartido(container, datos.datos);
                break;
            case 'clasificacion':
                this.renderClasificacion(container, datos.datos);
                break;
            case 'resultado_eliminatoria':
                this.renderResultadoEliminatoria(container, datos.datos);
                break;
            case 'fin_torneo':
                this.renderFinTorneo(container, datos.datos);
                break;
            case 'entre_semestres':
                this.renderEntreSemestres(container, datos.datos);
                break;
            case 'evaluacion_seleccion':
                this.renderEvaluacionSeleccion(container, datos.datos);
                break;
            case 'inicio_comeduc':
                this.renderInicioCOMEDUC(container, datos.datos);
                break;
            case 'fin_comeduc':
                this.renderFinCOMEDUC(container, datos.datos);
                break;
            case 'fin_año':
                this.renderFinAño(container, datos.datos);
                break;
            case 'eleccion_especialidad':
                this.renderEleccionEspecialidad(container, datos.datos);
                break;
            case 'pantalla_final':
                this.renderPantallaFinal(container, datos.datos);
                break;
            default:
                container.innerHTML = `<p>${datos.accion}</p>`;
        }

        this.mostrarPantalla('screen-event');
    },

    // ========== INICIO DE TORNEO ==========

    renderInicioTorneo: function(container, datos) {
        const torneo = datos.torneo;
        const formatoInfo = DATOS.formaciones[torneo.formato];

        let gruposHTML = '';
        torneo.grupos.forEach(grupo => {
            gruposHTML += `
                <div class="group-card">
                    <h4>${grupo.nombre}</h4>
                    <ul class="group-teams">
                        ${grupo.equipos.map(e => `
                            <li class="${e.esJugador ? 'player-team' : ''}">${e.nombre || e.abrev}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header tournament-start">
                    <h2>🏟️ ${torneo.nombre}</h2>
                    <p class="event-subtitle">Formato: ${formatoInfo.nombre} — ${formatoInfo.jugadores} jugadores</p>
                </div>
                <div class="groups-grid">
                    ${gruposHTML}
                </div>
                <div class="event-info">
                    <p>📋 Fase de grupos: 4 partidos por equipo</p>
                    <p>🏆 Clasifican los 2 primeros de cada grupo a eliminatorias</p>
                </div>
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> ¡A jugar!
                </button>
            </div>
        `;
    },

    // ========== RESULTADO DE PARTIDO ==========

    renderResultadoPartido: function(container, datos) {
        const res = datos.resultado;
        const stats = res.statsJugador;

        // Eventos del partido
        let eventosHTML = '';
        res.eventos.forEach((e, idx) => {
            const highlight = e.jugadorInvolucrado ? 'event-highlight' : '';
            eventosHTML += `
                <div class="match-event ${highlight}" style="animation-delay: ${idx * 0.1}s">
                    <span class="event-minute">${e.minuto}'</span>
                    <span class="event-desc">${e.descripcion}</span>
                </div>
            `;
        });

        // Rol del jugador
        const rolTexto = {
            'titular': '🟢 Titular',
            'suplente': '🟡 Suplente',
            'reserva': '🔴 Reserva'
        };

        const resultadoClase = stats.resultado === 'W' ? 'result-win' :
                               stats.resultado === 'D' ? 'result-draw' : 'result-loss';
        const resultadoTexto = stats.resultado === 'W' ? '¡VICTORIA!' :
                               stats.resultado === 'D' ? 'EMPATE' : 'DERROTA';

        container.innerHTML = `
            <div class="event-screen">
                <div class="match-result-header ${resultadoClase}">
                    <div class="result-badge">${resultadoTexto}</div>
                    <div class="match-scoreboard">
                        <div class="team-side">
                            <span class="team-name ${res.esEquipoLocal ? 'player-team-name' : ''}">${res.equipoLocal.nombre || res.equipoLocal.abrev}</span>
                        </div>
                        <div class="score-display">
                            <span class="score-number">${res.golesLocal}</span>
                            <span class="score-separator">-</span>
                            <span class="score-number">${res.golesVisitante}</span>
                        </div>
                        <div class="team-side">
                            <span class="team-name ${!res.esEquipoLocal ? 'player-team-name' : ''}">${res.equipoVisitante.nombre || res.equipoVisitante.abrev}</span>
                        </div>
                    </div>
                    <div class="player-role">${rolTexto[res.rolJugador]}</div>
                </div>

                ${stats.rol !== 'reserva' ? `
                <div class="player-match-stats">
                    <h3>Tu rendimiento</h3>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <span class="stat-box-value">${stats.rating.toFixed(1)}</span>
                            <span class="stat-box-label">Rating</span>
                        </div>
                        <div class="stat-box ${stats.goles > 0 ? 'stat-highlight' : ''}">
                            <span class="stat-box-value">${stats.goles}</span>
                            <span class="stat-box-label">Goles</span>
                        </div>
                        <div class="stat-box ${stats.asistencias > 0 ? 'stat-highlight' : ''}">
                            <span class="stat-box-value">${stats.asistencias}</span>
                            <span class="stat-box-label">Asistencias</span>
                        </div>
                        <div class="stat-box ${stats.mvp ? 'stat-mvp' : ''}">
                            <span class="stat-box-value">${stats.mvp ? '⭐' : '-'}</span>
                            <span class="stat-box-label">MVP</span>
                        </div>
                    </div>
                    <div class="xp-gained">
                        <span class="xp-label">XP Ganada:</span>
                        <span class="xp-amount">+${stats.xp}</span>
                    </div>
                    ${stats.tarjetasAmarillas > 0 ? `<div class="card-alert yellow">🟨 Tarjeta amarilla recibida</div>` : ''}
                    ${stats.tarjetasRojas > 0 ? `<div class="card-alert red">🟥 ¡Tarjeta roja! Expulsado</div>` : ''}
                </div>
                ` : `
                <div class="player-match-stats reserve">
                    <h3>No fuiste convocado para este partido</h3>
                    <p>El entrenador decidió dejarte en la reserva. ¡Sigue entrenando!</p>
                </div>
                `}

                <div class="match-events">
                    <h3>Eventos del partido</h3>
                    <div class="events-timeline">
                        ${eventosHTML}
                    </div>
                </div>

                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> Continuar
                </button>
            </div>
        `;
    },

    // ========== CLASIFICACIÓN ==========

    renderClasificacion: function(container, datos) {
        const torneo = datos.torneo;
        const grupo = torneo.grupos[torneo.grupoJugador];
        const standings = Tournament.obtenerStandings(grupo);

        let tablaHTML = `
            <table class="standings-table">
                <thead>
                    <tr>
                        <th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th>
                        <th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    ${standings.map((e, i) => `
                        <tr class="${e.esJugador ? 'player-row' : ''} ${i < 2 ? 'qualified-row' : 'eliminated-row'}">
                            <td>${i + 1}</td>
                            <td>${e.nombre || e.abrev}</td>
                            <td>${e.pj}</td><td>${e.pg}</td><td>${e.pe}</td>
                            <td>${e.pp}</td><td>${e.gf}</td><td>${e.gc}</td>
                            <td>${e.gf - e.gc}</td><td><strong>${e.pts}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header ${datos.clasifico ? 'classification-success' : 'classification-fail'}">
                    <h2>${datos.clasifico ? '✅ ¡CLASIFICACIÓN!' : '❌ ELIMINADO'}</h2>
                    <p>${datos.mensaje}</p>
                </div>
                <div class="standings-container">
                    <h3>Tabla Final — ${grupo.nombre}</h3>
                    ${tablaHTML}
                    <p class="standings-legend">🟢 Clasificados (Top 2) | 🔴 Eliminados</p>
                </div>
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> Continuar
                </button>
            </div>
        `;
    },

    // ========== RESULTADO ELIMINATORIA ==========

    renderResultadoEliminatoria: function(container, datos) {
        const partido = datos.partido;
        if (!partido) {
            container.innerHTML = `
                <div class="event-screen">
                    <div class="event-header">
                        <h2>Eliminatorias</h2>
                        <p>Tu equipo no participa en esta ronda.</p>
                    </div>
                    <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                        <span class="btn-icon">▶️</span> Continuar
                    </button>
                </div>
            `;
            return;
        }

        const score1 = Math.floor(partido.goles1);
        const score2 = Math.floor(partido.goles2);
        const penales = partido.penales ? ' (PEN)' : '';

        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header ${datos.jugadorGano ? 'classification-success' : 'classification-fail'}">
                    <h2>${datos.jugadorGano ? '🎉 ¡VICTORIA!' : '😔 ELIMINADOS'}</h2>
                    <div class="match-scoreboard">
                        <div class="team-side">
                            <span class="team-name">${partido.equipo1.nombre || partido.equipo1.abrev}</span>
                        </div>
                        <div class="score-display">
                            <span class="score-number">${score1}</span>
                            <span class="score-separator">-</span>
                            <span class="score-number">${score2}</span>
                        </div>
                        <div class="team-side">
                            <span class="team-name">${partido.equipo2.nombre || partido.equipo2.abrev}</span>
                        </div>
                    </div>
                    ${penales ? '<p class="penales-text">Definido en penales</p>' : ''}
                </div>
                <p class="event-message">${datos.jugadorGano ? `¡Tu equipo avanza a la siguiente ronda!` : 'Tu equipo ha sido eliminado del torneo.'}</p>
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> Continuar
                </button>
            </div>
        `;
    },

    // ========== FIN DE TORNEO ==========

    renderFinTorneo: function(container, datos) {
        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header ${datos.esCampeon ? 'champion-header' : ''}">
                    ${datos.esCampeon ? '<div class="confetti-overlay"></div>' : ''}
                    <h2>${datos.esCampeon ? '🏆 ¡CAMPEONES!' : '🏁 Torneo Finalizado'}</h2>
                    <p>${datos.mensaje}</p>
                </div>
                ${datos.esCampeon ? `
                <div class="champion-celebration">
                    <div class="trophy-icon">🏆</div>
                    <h3>¡Tu equipo es el campeón!</h3>
                    <p>+15 Reputación | +20 Moral</p>
                </div>
                ` : ''}
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> Continuar
                </button>
            </div>
        `;
    },

    // ========== ENTRE SEMESTRES ==========

    renderEntreSemestres: function(container, datos) {
        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header semester-break">
                    <h2>📚 2° Semestre</h2>
                    <p>${datos.mensaje}</p>
                </div>
                <div class="break-info">
                    <p>💚 +30 Fitness | 😊 +10 Moral</p>
                    <p>Un nuevo campeonato INTECO te espera.</p>
                </div>
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> ¡Vamos!
                </button>
            </div>
        `;
    },

    // ========== EVALUACIÓN SELECCIÓN ==========

    renderEvaluacionSeleccion: function(container, datos) {
        const d = datos.desglose;
        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header ${datos.seleccionado ? 'selection-success' : 'selection-fail'}">
                    <h2>${datos.seleccionado ? '🎖️ ¡CONVOCADO!' : '😔 No Seleccionado'}</h2>
                    <p>${datos.mensaje}</p>
                </div>
                <div class="selection-details">
                    <h3>Evaluación de Selección</h3>
                    <div class="selection-breakdown">
                        <div class="breakdown-item">
                            <span>⚽ Goles</span>
                            <span class="breakdown-value">${d.goles.toFixed(1)} / 20</span>
                        </div>
                        <div class="breakdown-item">
                            <span>👟 Asistencias</span>
                            <span class="breakdown-value">${d.asistencias.toFixed(1)} / 10</span>
                        </div>
                        <div class="breakdown-item">
                            <span>📈 Nivel</span>
                            <span class="breakdown-value">${d.nivel.toFixed(1)} / 20</span>
                        </div>
                        <div class="breakdown-item">
                            <span>⭐ Rendimiento</span>
                            <span class="breakdown-value">${d.rendimiento.toFixed(1)} / 20</span>
                        </div>
                        <div class="breakdown-item">
                            <span>🏆 Reputación</span>
                            <span class="breakdown-value">${d.reputacion.toFixed(1)} / 15</span>
                        </div>
                        <div class="breakdown-item">
                            <span>📋 Disciplina</span>
                            <span class="breakdown-value">${d.disciplina.toFixed(1)} / 15</span>
                        </div>
                        ${d.bonusAño > 0 ? `
                        <div class="breakdown-item bonus">
                            <span>🎓 Bonus Año</span>
                            <span class="breakdown-value">+${d.bonusAño}</span>
                        </div>
                        ` : ''}
                        <div class="breakdown-total">
                            <span>TOTAL</span>
                            <span class="breakdown-value">${datos.puntaje} / ${datos.umbral} requerido</span>
                        </div>
                    </div>
                </div>
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> Continuar
                </button>
            </div>
        `;
    },

    // ========== INICIO COMEDUC ==========

    renderInicioCOMEDUC: function(container, datos) {
        const torneo = datos.torneo;

        // Galería de todos los logos (desfile de participantes)
        const todosEquipos = torneo.grupos.flatMap(g => g.equipos);
        const logosHTML = todosEquipos.map(e => {
            const logoSrc = e.logo ? e.logo : null;
            return `
                <div class="comeduc-logo-item ${e.esJugador ? 'comeduc-logo-player' : ''}">
                    ${logoSrc
                        ? `<img src="${logoSrc}" alt="${e.abrev}" class="comeduc-logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                        : ''}
                    <div class="comeduc-logo-fallback" ${logoSrc ? 'style="display:none"' : ''}>
                        <span>${e.abrev}</span>
                    </div>
                    <span class="comeduc-logo-name">${e.abrev}</span>
                    ${e.esJugador ? '<span class="comeduc-logo-badge">TÚ</span>' : ''}
                </div>
            `;
        }).join('');

        // Grupos con logos
        let gruposHTML = '';
        torneo.grupos.forEach(grupo => {
            gruposHTML += `
                <div class="group-card comeduc-group">
                    <h4>${grupo.nombre}</h4>
                    <ul class="group-teams">
                        ${grupo.equipos.map(e => `
                            <li class="${e.esJugador ? 'player-team' : ''}">
                                ${e.logo
                                    ? `<img src="${e.logo}" alt="${e.abrev}" class="group-team-logo" onerror="this.style.display='none'">`
                                    : '<span class="group-team-logo-placeholder">⚽</span>'
                                }
                                <span>${e.abrev || e.nombre}</span>
                                ${e.esJugador ? '<span class="player-badge">★</span>' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header comeduc-header">
                    <h2>🏅 Campeonato COMEDUC</h2>
                    <p>${datos.mensaje}</p>
                    <p class="comeduc-subtitle">El torneo más difícil • 19 establecimientos • Fútbol 7</p>
                </div>
                <div class="comeduc-logos-section">
                    <h3 class="comeduc-logos-title">⚽ Participantes</h3>
                    <div class="comeduc-logos-grid">
                        ${logosHTML}
                    </div>
                </div>
                <div class="groups-grid">
                    ${gruposHTML}
                </div>
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> ¡Representar a INTECO!
                </button>
            </div>
        `;
    },


    // ========== FIN COMEDUC ==========

    renderFinCOMEDUC: function(container, datos) {
        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header ${datos.esCampeon ? 'comeduc-champion' : ''}">
                    ${datos.esCampeon ? '<div class="confetti-overlay"></div>' : ''}
                    <h2>${datos.esCampeon ? '🏅 ¡¡CAMPEONES COMEDUC!!' : '🏁 COMEDUC Finalizado'}</h2>
                    <p>${datos.mensaje}</p>
                </div>
                ${datos.esCampeon ? `
                <div class="champion-celebration comeduc">
                    <div class="trophy-icon">🏅</div>
                    <h3>¡La Selección INTECO es campeona del COMEDUC!</h3>
                    <p>+25 Reputación | +25 Moral | Logro Desbloqueado</p>
                </div>
                ` : ''}
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> Continuar
                </button>
            </div>
        `;
    },

    // ========== FIN DE AÑO ==========

    renderFinAño: function(container, datos) {
        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header year-end">
                    <h2>📚 Fin del Año Escolar</h2>
                    <p>${datos.mensaje}</p>
                </div>
                ${!datos.esUltimoAño ? `
                <div class="year-transition">
                    <div class="year-arrow">
                        <span class="old-year">${DATOS.años[datos.año - 1]}</span>
                        <span class="arrow">→</span>
                        <span class="new-year">${DATOS.años[datos.nuevoAño - 1]}</span>
                    </div>
                    <p>+1 Edad | Fitness recuperado | Nuevo equipo</p>
                </div>
                ` : `
                <div class="year-transition final">
                    <p>Has completado tu ciclo en INTECO. Es hora de ver tu legado.</p>
                </div>
                `}
                <button class="btn-primary btn-glow btn-large" onclick="App.volverDashboard()">
                    <span class="btn-icon">▶️</span> ${datos.esUltimoAño ? 'Ver mi legado' : 'Siguiente año'}
                </button>
            </div>
        `;
    },

    // ========== ELECCIÓN ESPECIALIDAD ==========

    renderEleccionEspecialidad: function(container, datos) {
        const especialidades = [
            { id: '3A', nombre: 'Contabilidad (3°A)', desc: 'Ganas +1 Pase y +5 Reputación', stat: 'Pase', rep: 5 },
            { id: '3B', nombre: 'Telecomunicaciones (3°B)', desc: 'Ganas +1 Velocidad y +10 Moral', stat: 'Velocidad', moral: 10 },
            { id: '3C', nombre: 'Logística (3°C)', desc: 'Ganas +1 Resistencia y +5 Reputación', stat: 'Resistencia', rep: 5 },
            { id: '3D', nombre: 'Programación (3°D)', desc: 'Ganas +1 Tiro y +10 Moral', stat: 'Tiro', moral: 10 },
            { id: '3E', nombre: 'Logística (3°E)', desc: 'Ganas +1 Defensa y +5 Reputación', stat: 'Defensa', rep: 5 }
        ];

        let opcionesHTML = especialidades.map(esp => `
            <div class="specialty-card" style="border: 1px solid #444; padding: 15px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#ffd700';" onmouseout="this.style.borderColor='#444';" onclick="App.elegirEspecialidad('${esp.id}')">
                <h3 style="margin-bottom: 5px; color: #ffd700;">${esp.nombre}</h3>
                <p style="font-size: 0.9em; color: #ccc;">${esp.desc}</p>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="event-screen">
                <div class="event-header year-end">
                    <h2>🎓 Elección de Especialidad</h2>
                    <p>${datos.mensaje}</p>
                </div>
                <div class="specialty-selection" style="text-align: left; margin-top: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">
                    ${opcionesHTML}
                </div>
            </div>
        `;
    },

    // ========== PANTALLA FINAL ==========

    renderPantallaFinal: function(container, datos) {
        const f = datos.final;
        const e = datos.estadisticas;

        container.innerHTML = `
            <div class="event-screen final-screen">
                <div class="final-header">
                    <div class="final-icon">${f.icono}</div>
                    <h1 class="final-title">${f.titulo}</h1>
                    <p class="final-desc">${f.desc}</p>
                    <div class="final-score">Puntaje Final: ${datos.puntaje}/100</div>
                </div>

                <div class="final-stats">
                    <h2>📊 Estadísticas de Carrera</h2>
                    <div class="final-stats-grid">
                        <div class="final-stat"><span class="fs-value">${e.partidosJugados}</span><span class="fs-label">Partidos</span></div>
                        <div class="final-stat"><span class="fs-value">${e.partidosGanados}</span><span class="fs-label">Victorias</span></div>
                        <div class="final-stat"><span class="fs-value">${e.goles}</span><span class="fs-label">Goles</span></div>
                        <div class="final-stat"><span class="fs-value">${e.asistencias}</span><span class="fs-label">Asistencias</span></div>
                        <div class="final-stat"><span class="fs-value">${e.mvps}</span><span class="fs-label">MVPs</span></div>
                        <div class="final-stat"><span class="fs-value">${e.nivel}</span><span class="fs-label">Nivel</span></div>
                        <div class="final-stat"><span class="fs-value">${e.overall}</span><span class="fs-label">Overall</span></div>
                        <div class="final-stat"><span class="fs-value">${e.promedioRating}</span><span class="fs-label">Rating Prom.</span></div>
                        <div class="final-stat"><span class="fs-value">${e.titulosINTECO}</span><span class="fs-label">Títulos INTECO</span></div>
                        <div class="final-stat"><span class="fs-value">${e.titulosCOMEDUC}</span><span class="fs-label">Títulos COMEDUC</span></div>
                        <div class="final-stat"><span class="fs-value">${e.vecesSeleccionado}</span><span class="fs-label">Selecciones</span></div>
                        <div class="final-stat"><span class="fs-value">${e.tarjetasAmarillas}/${e.tarjetasRojas}</span><span class="fs-label">🟨/🟥</span></div>
                    </div>
                </div>

                <div class="final-history">
                    <h3>Historial de Torneos</h3>
                    ${datos.historialTorneos.map(t => `
                        <div class="history-item ${t.esCampeon ? 'champion-item' : ''}">
                            <span>${t.esCampeon ? '🏆' : '📋'} ${t.nombre}</span>
                            <span>Campeón: ${t.campeon}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="final-actions">
                    <button class="btn-primary btn-glow btn-large" onclick="App.nuevaCarrera()">
                        🆕 Nueva Carrera
                    </button>
                    <button class="btn-secondary" onclick="UI.renderMenuPrincipal()">
                        🏠 Menú Principal
                    </button>
                </div>
            </div>
        `;
    },

    // ========== ESTADÍSTICAS ==========

    renderEstadisticas: function(gameState) {
        const container = document.getElementById('stats-content');
        const player = gameState.player;

        container.innerHTML = `
            <div class="stats-screen">
                <div class="stats-header">
                    <button class="btn-back" onclick="UI.renderDashboard(App.gameState)">← Volver</button>
                    <h2>📊 Estadísticas Completas</h2>
                </div>

                <div class="stats-section">
                    <h3>Rendimiento General</h3>
                    <div class="stats-grid-detailed">
                        <div class="stat-detail"><span class="sd-icon">⚽</span><span class="sd-label">Partidos Jugados</span><span class="sd-value">${player.totalPartidos}</span></div>
                        <div class="stat-detail"><span class="sd-icon">🏆</span><span class="sd-label">Partidos Ganados</span><span class="sd-value">${player.totalGanados}</span></div>
                        <div class="stat-detail"><span class="sd-icon">🤝</span><span class="sd-label">Empates</span><span class="sd-value">${player.totalEmpatados}</span></div>
                        <div class="stat-detail"><span class="sd-icon">💔</span><span class="sd-label">Derrotas</span><span class="sd-value">${player.totalPerdidos}</span></div>
                        <div class="stat-detail"><span class="sd-icon">🥅</span><span class="sd-label">Goles</span><span class="sd-value">${player.totalGoles}</span></div>
                        <div class="stat-detail"><span class="sd-icon">👟</span><span class="sd-label">Asistencias</span><span class="sd-value">${player.totalAsistencias}</span></div>
                        <div class="stat-detail"><span class="sd-icon">⭐</span><span class="sd-label">MVPs</span><span class="sd-value">${player.totalMVPs}</span></div>
                        <div class="stat-detail"><span class="sd-icon">📊</span><span class="sd-label">Promedio Rating</span><span class="sd-value">${player.promedioRendimiento || 'N/A'}</span></div>
                        <div class="stat-detail"><span class="sd-icon">🟨</span><span class="sd-label">Tarjetas Amarillas</span><span class="sd-value">${player.totalTarjetasAmarillas}</span></div>
                        <div class="stat-detail"><span class="sd-icon">🟥</span><span class="sd-label">Tarjetas Rojas</span><span class="sd-value">${player.totalTarjetasRojas}</span></div>
                    </div>
                </div>

                <div class="stats-section">
                    <h3>Progresión</h3>
                    <div class="stats-grid-detailed">
                        <div class="stat-detail"><span class="sd-icon">📈</span><span class="sd-label">Nivel</span><span class="sd-value">${player.nivel}</span></div>
                        <div class="stat-detail"><span class="sd-icon">✨</span><span class="sd-label">XP Total</span><span class="sd-value">${player.totalXPGanada}</span></div>
                        <div class="stat-detail"><span class="sd-icon">🌟</span><span class="sd-label">Overall</span><span class="sd-value">${player.overall}</span></div>
                        <div class="stat-detail"><span class="sd-icon">⭐</span><span class="sd-label">Reputación</span><span class="sd-value">${player.reputacion}</span></div>
                    </div>
                </div>
                
                <div class="stats-section">
                    <h3>Atributos y Habilidades</h3>
                    <p style="margin-bottom: 15px; color: #ffd700;">
                        Puntos de Habilidad Disponibles: <strong>${player.skillPoints}</strong>
                    </p>
                    <div class="stats-grid-detailed">
                        ${this.renderAtributoRow(player, 'velocidad', '⚡ Velocidad')}
                        ${this.renderAtributoRow(player, 'tiro', '🎯 Tiro')}
                        ${this.renderAtributoRow(player, 'pase', '📨 Pase')}
                        ${this.renderAtributoRow(player, 'defensa', '🛡️ Defensa')}
                        ${this.renderAtributoRow(player, 'resistencia', '💪 Resistencia')}
                    </div>
                </div>

            </div>
        `;

        this.mostrarPantalla('screen-stats');
    },

    renderAtributoRow: function(player, statKey, label) {
        const value = player.stats[statKey];
        const canUpgrade = player.skillPoints > 0 && value < 99;
        return `
            <div class="stat-detail" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="sd-label">${label}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="sd-value">${value}</span>
                    ${canUpgrade ? `<button class="btn-primary" style="padding: 2px 8px; font-size: 14px;" onclick="UI.asignarPuntoHabilidad('${statKey}')">+</button>` : ''}
                </div>
            </div>
        `;
    },

    asignarPuntoHabilidad: function(statKey) {
        if (!App.gameState) return;
        const asignado = Player.asignarPuntoHabilidad(App.gameState.player, statKey);
        if (asignado) {
            App.guardarJuego();
            UI.renderEstadisticas(App.gameState);
            UI.mostrarToast('¡Atributo mejorado!', 'success');
        }
    },

    // ========== NOTICIAS ==========

    renderNoticias: function() {
        const container = document.getElementById('news-content');
        const noticias = News.obtenerUltimas(20);
        News.marcarTodasLeidas();

        let noticiasHTML = '';
        if (noticias.length === 0) {
            noticiasHTML = '<p class="empty-message">No hay noticias aún. ¡Comienza a jugar!</p>';
        } else {
            noticiasHTML = noticias.map(n => `
                <div class="news-card ${n.leida ? '' : 'news-unread'}">
                    <div class="news-icon">${n.icono}</div>
                    <div class="news-body">
                        <h4 class="news-title">${n.titulo}</h4>
                        <p class="news-text">${n.contenido}</p>
                        <span class="news-date">${n.fecha}</span>
                    </div>
                </div>
            `).join('');
        }

        container.innerHTML = `
            <div class="news-screen">
                <div class="news-header">
                    <button class="btn-back" onclick="UI.renderDashboard(App.gameState)">← Volver</button>
                    <h2>📰 Noticias INTECO</h2>
                </div>
                <div class="news-list">
                    ${noticiasHTML}
                </div>
            </div>
        `;

        this.mostrarPantalla('screen-news');
    },

    // ========== LOGROS ==========

    renderLogros: function() {
        const container = document.getElementById('achievements-content');
        const logros = Achievements.obtenerTodos();

        const logrosHTML = logros.map(l => `
            <div class="achievement-card ${l.desbloqueado ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${l.desbloqueado ? l.icono : '🔒'}</div>
                <div class="achievement-info">
                    <h4>${l.nombre}</h4>
                    <p>${l.desbloqueado ? l.desc : '???'}</p>
                </div>
                ${l.desbloqueado ? '<div class="achievement-check">✅</div>' : ''}
            </div>
        `).join('');

        container.innerHTML = `
            <div class="achievements-screen">
                <div class="achievements-header">
                    <button class="btn-back" onclick="UI.renderDashboard(App.gameState)">← Volver</button>
                    <h2>🏆 Logros</h2>
                    <p class="achievements-count">${Achievements.cantidadDesbloqueados()} / ${Achievements.totalLogros()}</p>
                </div>
                <div class="achievements-list">
                    ${logrosHTML}
                </div>
            </div>
        `;

        this.mostrarPantalla('screen-achievements');
    },

    // ========== HISTORIAL ==========

    renderHistorial: function(gameState) {
        const container = document.getElementById('history-content');
        const historial = gameState.career.historialPartidos;

        let historialHTML = '';
        if (historial.length === 0) {
            historialHTML = '<p class="empty-message">No hay partidos en el historial aún.</p>';
        } else {
            historialHTML = historial.map((h, i) => `
                <div class="history-match-card ${h.resultado === 'W' ? 'match-win' : h.resultado === 'D' ? 'match-draw' : 'match-loss'}">
                    <div class="hm-number">#${i + 1}</div>
                    <div class="hm-info">
                        <div class="hm-top">
                            <span class="hm-tournament">${h.torneo}</span>
                            <span class="hm-result">${h.resultado === 'W' ? '✅' : h.resultado === 'D' ? '🤝' : '❌'} ${h.marcador}</span>
                        </div>
                        <div class="hm-opponent">vs ${h.oponente}</div>
                        <div class="hm-stats">
                            <span>⚽ ${h.goles}</span>
                            <span>👟 ${h.asistencias}</span>
                            <span>⭐ ${h.rating}</span>
                            <span>${h.rol === 'titular' ? '🟢' : h.rol === 'suplente' ? '🟡' : '🔴'}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        container.innerHTML = `
            <div class="history-screen">
                <div class="history-header">
                    <button class="btn-back" onclick="UI.renderDashboard(App.gameState)">← Volver</button>
                    <h2>📋 Historial de Partidos</h2>
                </div>
                <div class="history-list">
                    ${historialHTML}
                </div>
            </div>
        `;

        this.mostrarPantalla('screen-history');
    },

    // ========== NOTIFICACIONES TOAST ==========

    mostrarToast: function(mensaje, tipo) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo || 'info'}`;
        toast.innerHTML = mensaje;
        document.getElementById('toast-container').appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Muestra modal de logro desbloqueado
     */
    mostrarLogroModal: function(logro) {
        const modal = document.getElementById('modal-overlay');
        modal.innerHTML = `
            <div class="modal-content achievement-modal">
                <div class="modal-icon pulse">${logro.icono}</div>
                <h2>¡Logro Desbloqueado!</h2>
                <h3>${logro.nombre}</h3>
                <p>${logro.desc}</p>
                <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.remove('show')">
                    ¡Genial!
                </button>
            </div>
        `;
        modal.classList.add('show');
    },

    /**
     * Muestra modal de subida de nivel
     */
    mostrarNivelModal: function(nivel, skillPointsGanados) {
        const modal = document.getElementById('modal-overlay');

        modal.innerHTML = `
            <div class="modal-content level-modal">
                <div class="modal-icon pulse">📈</div>
                <h2>¡Subida de Nivel!</h2>
                <div class="new-level">Nivel ${nivel}</div>
                <div class="level-stats-gained">+${skillPointsGanados} Puntos de Habilidad</div>
                <p>Ve a Estadísticas para usarlos.</p>
                <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.remove('show')">
                    ¡Continuar!
                </button>
            </div>
        `;
        modal.classList.add('show');
    },

    // ========== ENTRENAMIENTO ==========

    mostrarModalEntrenamiento: function() {
        const modal = document.getElementById('modal-overlay');
        const player = App.gameState.player;
        let entrenamientosHTML = '';
        
        Training.tipos.forEach(t => {
            const canAfford = player.estadoFisico >= t.costo;
            entrenamientosHTML += `
                <div class="training-option" style="border: 1px solid #333; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${t.icon} ${t.nombre}</strong><br>
                            <small>${t.desc}</small>
                        </div>
                        <button class="btn-primary" ${!canAfford ? 'disabled' : ''} onclick="UI.ejecutarEntrenamiento('${t.id}')">
                            Entrenar (-${t.costo} nrg)
                        </button>
                    </div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px; text-align: left;">
                <h2>🏋️ Entrenamiento</h2>
                <p>Estado físico actual: <strong>${player.estadoFisico}</strong></p>
                <div style="margin-top: 15px;">
                    ${entrenamientosHTML}
                </div>
                <button class="btn-secondary" style="margin-top: 15px; width: 100%;" onclick="document.getElementById('modal-overlay').classList.remove('show')">Cerrar</button>
            </div>
        `;
        modal.classList.add('show');
    },

    ejecutarEntrenamiento: function(tipoId) {
        if (!App.gameState) return;
        const result = Training.entrenar(App.gameState.player, tipoId);
        
        if (result.exito) {
            App.guardarJuego();
            UI.renderDashboard(App.gameState);
            document.getElementById('modal-overlay').classList.remove('show');
            
            if (result.xpResult && result.xpResult.leveledUp) {
                setTimeout(() => UI.mostrarNivelModal(result.xpResult.newLevel, result.xpResult.skillPointsGanados), 500);
            } else {
                UI.mostrarToast(result.msj, result.tipo === 'stat' ? 'success' : 'info');
            }
        } else {
            UI.mostrarToast(result.msj, 'error');
        }
    },

    // ========== EVENTOS ALEATORIOS ==========

    eventoActual: null,

    mostrarModalEvento: function(evento) {
        this.eventoActual = evento;
        const modal = document.getElementById('modal-overlay');
        
        let opcionesHTML = '';
        evento.opciones.forEach((opc, index) => {
            opcionesHTML += `
                <button class="btn-primary" style="display: block; width: 100%; margin-bottom: 10px;" onclick="UI.resolverEvento(${index})">
                    ${opc.texto}
                </button>
            `;
        });

        modal.innerHTML = `
            <div class="modal-content event-modal">
                <h2>${evento.titulo}</h2>
                <p style="margin-bottom: 20px;">${evento.desc}</p>
                <div class="event-options">
                    ${opcionesHTML}
                </div>
            </div>
        `;
        modal.classList.add('show');
    },

    resolverEvento: function(indexOpcion) {
        if (!this.eventoActual || !App.gameState) return;
        
        const opcion = this.eventoActual.opciones[indexOpcion];
        const resultado = opcion.consecuencia(App.gameState.player);
        
        App.guardarJuego();
        
        const modal = document.getElementById('modal-overlay');
        modal.innerHTML = `
            <div class="modal-content event-modal">
                <h2>Resultado</h2>
                <p style="margin-bottom: 20px;">${resultado}</p>
                <button class="btn-primary btn-glow" onclick="document.getElementById('modal-overlay').classList.remove('show'); UI.renderDashboard(App.gameState);">
                    Continuar
                </button>
            </div>
        `;
        
        this.eventoActual = null;
    }
};

console.log('✅ ui.js cargado correctamente');
