/**
 * events.js - Sistema de Eventos Aleatorios de Carrera para "Camino a la Leyenda INTECO"
 */

const Events = {
    lista: [
        {
            id: 'fiesta_curso',
            titulo: '🎉 Fiesta de Curso',
            desc: 'Tus compañeros están organizando una junta esta tarde, pero tienes un partido importante pronto.',
            opciones: [
                {
                    texto: 'Ir a la junta',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, 15);
                        Player.actualizarFitness(player, -25);
                        return 'Te divertiste mucho y la moral está alta, pero estás bastante cansado. (+15 Moral, -25 Energía)';
                    }
                },
                {
                    texto: 'Quedarse descansando',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, -10);
                        Player.actualizarFitness(player, 15);
                        return 'Te perdiste la actividad, pero estás a tope físicamente. (-10 Moral, +15 Energía)';
                    }
                }
            ]
        },
        {
            id: 'entrenamiento_extra',
            titulo: '⚽ Entrenamiento Extra',
            desc: 'El profe te pide que te quedes después de clases para practicar técnica individual.',
            opciones: [
                {
                    texto: 'Quedarse a practicar',
                    consecuencia: (player) => {
                        Player.actualizarFitness(player, -20);
                        player.stats.pase = Math.min(99, player.stats.pase + 1);
                        player.overall = Player.calcularOverall(player.stats, player.posicion);
                        return 'El esfuerzo extra rindió frutos, tu técnica mejoró. (+1 Pase, -20 Energía)';
                    }
                },
                {
                    texto: 'Irse a casa',
                    consecuencia: (player) => {
                        Player.actualizarReputacion(player, -5);
                        return 'El profe notó tu falta de compromiso. (-5 Reputación)';
                    }
                }
            ]
        },
        {
            id: 'entrevista_liceo',
            titulo: '🎤 Entrevista del Centro de Alumnos',
            desc: 'La radio del colegio quiere hacerte una pequeña nota sobre el equipo.',
            opciones: [
                {
                    texto: 'Dar la entrevista',
                    consecuencia: (player) => {
                        Player.actualizarReputacion(player, 10);
                        return 'Hablaste bien del equipo y subió tu popularidad. (+10 Reputación)';
                    }
                },
                {
                    texto: 'Rechazarla',
                    consecuencia: (player) => {
                        return 'Preferiste mantener un perfil bajo. (Sin cambios)';
                    }
                }
            ]
        },
        {
            id: 'penal_ultimo_minuto',
            titulo: '🥅 ¡Penal en el último minuto!',
            desc: 'El marcador está empatado en el último minuto de un partido decisivo. El árbitro cobra penal a favor de tu liceo y todos se apartan para dejarte a ti la responsabilidad de patearlo.',
            opciones: [
                {
                    texto: 'Asegurar: Patear fuerte al centro',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, 10);
                        Player.actualizarReputacion(player, 10);
                        player.stats.tiro = Math.min(99, player.stats.tiro + 1);
                        player.overall = Player.calcularOverall(player.stats, player.posicion);
                        return '¡Decidiste asegurar! El arquero vuela hacia un lado y la pelota entra limpia por el medio. ¡GOOOOOL! Todo el liceo corea tu nombre. (+10 Moral, +10 Reputación, +1 Tiro)';
                    }
                },
                {
                    texto: 'Colocarla: Definir con clase al ángulo',
                    consecuencia: (player) => {
                        const acierto = player.stats.tiro > 65 || Math.random() < 0.6;
                        if (acierto) {
                            Player.actualizarMoral(player, 15);
                            Player.actualizarReputacion(player, 15);
                            player.stats.tiro = Math.min(99, player.stats.tiro + 2);
                            player.overall = Player.calcularOverall(player.stats, player.posicion);
                            return '¡Qué definición soberbia! Pusiste la pelota en la escuadra imposible para el arquero. ¡GOOOOLAZO! Te felicitan todos tus compañeros. (+15 Moral, +15 Reputación, +2 Tiro)';
                        } else {
                            Player.actualizarMoral(player, -15);
                            Player.actualizarReputacion(player, -5);
                            return 'Intentaste ajustar demasiado el remate y el balón chocó con la base del vertical externo, yéndose fuera. ¡Qué mala suerte! (-15 Moral, -5 Reputación)';
                        }
                    }
                },
                {
                    texto: 'Arriesgar: Patear a lo Panenka',
                    consecuencia: (player) => {
                        const exito = Math.random() < 0.4;
                        if (exito) {
                            Player.actualizarMoral(player, 25);
                            Player.actualizarReputacion(player, 25);
                            player.stats.tiro = Math.min(99, player.stats.tiro + 3);
                            player.overall = Player.calcularOverall(player.stats, player.posicion);
                            return '¡Una locura total! Picaste la pelota con una frialdad increíble, el arquero se tiró al suelo y vio cómo entraba suavemente. ¡Es el video más visto en el Instagram del liceo! (+25 Moral, +25 Reputación, +3 Tiro)';
                        } else {
                            Player.actualizarMoral(player, -25);
                            Player.actualizarReputacion(player, -15);
                            player.comportamiento = Math.max(0, player.comportamiento - 10);
                            return '¡Qué humillación! El arquero ni se movió de su posición y atrapó el balón con total facilidad. El DT se agarra la cabeza furioso y tus compañeros no te lo perdonan. (-25 Moral, -15 Reputación, -10 Comportamiento)';
                        }
                    }
                }
            ]
        },
        {
            id: 'pelea_dt',
            titulo: '🤬 Tensión con el DT',
            desc: 'El Director Técnico decide sustituirte a pesar de que sentías que estabas jugando un gran partido. Al pasar por el banco, te pide explicaciones por tus malos gestos.',
            opciones: [
                {
                    texto: 'Mantener la calma: Aceptar la decisión y apoyar al equipo',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, -5);
                        Player.actualizarReputacion(player, 5);
                        player.comportamiento = Math.min(100, player.comportamiento + 10);
                        return 'Demostraste madurez y profesionalismo. Aunque quedaste con algo de frustración, el DT y el equipo valoran tu compostura. (-5 Moral, +5 Reputación, +10 Comportamiento)';
                    }
                },
                {
                    texto: 'Reclamar enojado: Discutir cara a cara con el DT',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, 10);
                        Player.actualizarReputacion(player, -10);
                        player.comportamiento = Math.max(0, player.comportamiento - 15);
                        player.partidosSuspendidos = (player.partidosSuspendidos || 0) + 1;
                        return '¡Se armó la polémica! Le gritaste al DT que no sabe de fútbol y pateaste un bidón de agua. Como castigo por tu indisciplina, ¡el DT te suspende del próximo partido! (+10 Moral, -10 Reputación, -15 Comportamiento, 1 Partido Suspendido)';
                    }
                },
                {
                    texto: 'Ignorarlo: Caminar directo al camarín sin mirarlo',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, -10);
                        Player.actualizarReputacion(player, -5);
                        player.comportamiento = Math.max(0, player.comportamiento - 10);
                        if (Math.random() < 0.5) {
                            player.partidosSuspendidos = (player.partidosSuspendidos || 0) + 1;
                            return 'Hiciste como si no existiera y te fuiste directo a las duchas. Al DT le pareció una falta de respeto intolerable y decidió suspenderte para el próximo encuentro. (-10 Moral, -5 Reputación, -10 Comportamiento, 1 Partido Suspendido)';
                        }
                        return 'Hiciste como si no existiera y te fuiste directo a las duchas. Tus compañeros comentan tu mala actitud en los pasillos. (-10 Moral, -5 Reputación, -10 Comportamiento)';
                    }
                }
            ]
        },
        {
            id: 'pelea_profesor',
            titulo: '🏫 Confrontación con un Profesor',
            desc: 'Un profesor te llama fuertemente la atención en medio del patio del liceo porque andas con buzo y no traes el uniforme completo, amenazando con anotarte en el libro y no dejarte jugar el campeonato.',
            opciones: [
                {
                    texto: 'Pedir disculpas: Aceptar el error y prometer cambiarte',
                    consecuencia: (player) => {
                        Player.actualizarMoral(player, -10);
                        player.comportamiento = Math.min(100, player.comportamiento + 15);
                        return 'Te tragaste el orgullo y pediste disculpas amablemente. El inspector te dejó ir con una advertencia verbal, salvando tu derecho a jugar. (-10 Moral, +15 Comportamiento)';
                    }
                },
                {
                    texto: 'Reclamar y discutir: Argumentar que el buzo es del equipo de fútbol',
                    consecuencia: (player) => {
                        player.comportamiento = Math.max(0, player.comportamiento - 20);
                        Player.actualizarReputacion(player, 10);
                        player.partidosSuspendidos = (player.partidosSuspendidos || 0) + 2;
                        return '¡Se calentó el patio! Te pusiste a discutir de mala manera, alzándole la voz al profesor. Te anotaron en el libro de clases y el inspector te suspendió con 2 partidos sin jugar el torneo del liceo. (-20 Comportamiento, +10 Reputación, 2 Partidos Suspendidos)';
                    }
                },
                {
                    texto: 'Arrancar: Salir corriendo antes de que te pida la libreta',
                    consecuencia: (player) => {
                        const atrapado = Math.random() < 0.6;
                        if (atrapado) {
                            player.comportamiento = Math.max(0, player.comportamiento - 25);
                            player.partidosSuspendidos = (player.partidosSuspendidos || 0) + 1;
                            return '¡Mala idea! Corriste, pero otro inspector te vio y te interceptó en la entrada. Te citaron con tu apoderado y el DT te suspendió un partido por indisciplinado. (-25 Comportamiento, 1 Partido Suspendido)';
                        } else {
                            Player.actualizarMoral(player, 15);
                            player.comportamiento = Math.max(0, player.comportamiento - 5);
                            return '¡Fuga exitosa! Te metiste entre la multitud de alumnos y lograste escapar sin que supieran tu nombre. Salvaste por esta vez, pero andas con cuidado. (+15 Moral, -5 Comportamiento)';
                        }
                    }
                }
            ]
        }
    ],

    obtenerEventoAleatorio: function() {
        // 15% de probabilidad de que ocurra un evento al intentar avanzar
        if (Math.random() > 0.15) return null;

        const index = Math.floor(Math.random() * this.lista.length);
        return this.lista[index];
    }
};

console.log('✅ events.js cargado correctamente');
