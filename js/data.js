/**
 * data.js - Datos estáticos del juego "Camino a la Leyenda INTECO"
 * Contiene toda la información constante: equipos, colegios, logros, etc.
 */

const DATOS = {
    // ========== NACIONALIDADES ==========
    nacionalidades: [
        // América
        'Argentina', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia',
        'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Estados Unidos', 'Guatemala',
        'Haití', 'Honduras', 'México', 'Nicaragua', 'Panamá',
        'Paraguay', 'Perú', 'República Dominicana', 'Uruguay', 'Venezuela',
        // Europa
        'Alemania', 'España', 'Francia', 'Inglaterra', 'Italia', 'Portugal',
        // Asia / África
        'Corea del Sur', 'Japón', 'Marruecos', 'Nigeria', 'Senegal'
    ],

    // Banderas para cada nacionalidad
    banderas: {
        'Argentina': '🇦🇷', 'Bolivia': '🇧🇴', 'Brasil': '🇧🇷', 'Canadá': '🇨🇦', 'Chile': '🇨🇱',
        'Colombia': '🇨🇴', 'Costa Rica': '🇨🇷', 'Cuba': '🇨🇺', 'Ecuador': '🇪🇨',
        'El Salvador': '🇸🇻', 'Estados Unidos': '🇺🇸', 'Guatemala': '🇬🇹', 'Haití': '🇭🇹', 'Honduras': '🇭🇳',
        'México': '🇲🇽', 'Nicaragua': '🇳🇮', 'Panamá': '🇵🇦', 'Paraguay': '🇵🇾',
        'Perú': '🇵🇪', 'República Dominicana': '🇩🇴', 'Uruguay': '🇺🇾', 'Venezuela': '🇻🇪',
        'Alemania': '🇩🇪', 'España': '🇪🇸', 'Francia': '🇫🇷', 'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Italia': '🇮🇹', 'Portugal': '🇵🇹',
        'Corea del Sur': '🇰🇷', 'Japón': '🇯🇵', 'Marruecos': '🇲🇦', 'Nigeria': '🇳🇬', 'Senegal': '🇸🇳'
    },

    // ========== POSICIONES ==========
    posiciones: ['Arquero', 'Defensa', 'Mediocampista', 'Delantero'],

    posicionesAbrev: {
        'Arquero': 'ARQ',
        'Defensa': 'DEF',
        'Mediocampista': 'MED',
        'Delantero': 'DEL'
    },

    // ========== EQUIPOS POR AÑO (20 equipos) ==========
    equipos: {
        1: [
            { id: '1A', nombre: '1°A', año: 1 },
            { id: '1B', nombre: '1°B', año: 1 },
            { id: '1C', nombre: '1°C', año: 1 },
            { id: '1D', nombre: '1°D', año: 1 },
            { id: '1E', nombre: '1°E', año: 1 }
        ],
        2: [
            { id: '2A', nombre: '2°A', año: 2 },
            { id: '2B', nombre: '2°B', año: 2 },
            { id: '2C', nombre: '2°C', año: 2 },
            { id: '2D', nombre: '2°D', año: 2 },
            { id: '2E', nombre: '2°E', año: 2 }
        ],
        3: [
            { id: '3A', nombre: '3°A (Contabilidad)', año: 3, especialidad: 'Contabilidad' },
            { id: '3B', nombre: '3°B (Telecomunicaciones)', año: 3, especialidad: 'Telecomunicaciones' },
            { id: '3C', nombre: '3°C (Logística)', año: 3, especialidad: 'Logística' },
            { id: '3D', nombre: '3°D (Programación)', año: 3, especialidad: 'Programación' },
            { id: '3E', nombre: '3°E (Logística)', año: 3, especialidad: 'Logística' }
        ],
        4: [
            { id: '4A', nombre: '4°A (Contabilidad)', año: 4, especialidad: 'Contabilidad' },
            { id: '4B', nombre: '4°B (Telecomunicaciones)', año: 4, especialidad: 'Telecomunicaciones' },
            { id: '4C', nombre: '4°C (Logística)', año: 4, especialidad: 'Logística' },
            { id: '4D', nombre: '4°D (Programación)', año: 4, especialidad: 'Programación' },
            { id: '4E', nombre: '4°E (Logística)', año: 4, especialidad: 'Logística' }
        ]
    },

    // ========== ESTABLECIMIENTOS COMEDUC (19 colegios) ==========
    comeduc: [
        { id: 'inteco',      nombre: 'Instituto Tecnológico y Comercial Recoleta',              abrev: 'INTECO',       logo: 'img/logos/inteco.png' },
        { id: 'achiga',      nombre: 'Colegio Técnico Profesional Achiga-Comeduc',              abrev: 'Achiga',       logo: 'img/logos/achiga.png' },
        { id: 'penaflor',    nombre: 'Colegio Comercial de Peñaflor',                          abrev: 'C. Peñaflor',  logo: 'img/logos/penaflor.png' },
        { id: 'hurtado',     nombre: 'Instituto Comercial Padre Alberto Hurtado',               abrev: 'P. Hurtado',   logo: 'img/logos/hurtado.png' },
        { id: 'insuco',      nombre: 'Instituto Superior de Comercio Bicentenario Insuco N°2',  abrev: 'INSUCO',       logo: 'img/logos/insuco.png' },
        { id: 'gonzalez',    nombre: 'Liceo Comercial Gabriel González Videla',                 abrev: 'G. González',  logo: 'img/logos/gonzalez.png' },
        { id: 'correa',      nombre: 'Liceo Comercial Luis Correa Prieto',                      abrev: 'L. Correa',    logo: 'img/logos/correa.png' },
        { id: 'molina',      nombre: 'Liceo Comercial Molina Lavín',                            abrev: 'Molina Lavín', logo: 'img/logos/molina.png' },
        { id: 'sanbernardo', nombre: 'Liceo Comercial San Bernardo',                            abrev: 'San Bernardo', logo: 'img/logos/sanbernardo.png' },
        { id: 'huidobro',    nombre: 'Liceo Comercial Vate Vicente Huidobro',                   abrev: 'Huidobro',     logo: 'img/logos/huidobro.png' },
        { id: 'clavel',      nombre: 'Liceo Técnico Clelia Clavel Dinator',                     abrev: 'C. Clavel',    logo: 'img/logos/clavel.png' },
        { id: 'blest',       nombre: 'Liceo Técnico Clotario Blest Riffo',                      abrev: 'C. Blest',     logo: 'img/logos/blest.png' },
        { id: 'narbona',     nombre: 'Liceo Técnico José María Narbona Cortés',                 abrev: 'Narbona',      logo: 'img/logos/narbona.png' },
        { id: 'condemarin',  nombre: 'Liceo Técnico Mabel Condemarín Grimberg',                 abrev: 'Condemarín',   logo: 'img/logos/condemarin.png' },
        { id: 'vina',        nombre: 'Instituto Comercial Bicentenario de Viña del Mar',        abrev: 'Viña del Mar', logo: 'img/logos/vina.png' },
        { id: 'rancagua',    nombre: 'Liceo Bicentenario Técnico de Rancagua',                  abrev: 'Rancagua',     logo: 'img/logos/rancagua.png' },
        { id: 'tolup',       nombre: 'Liceo Técnico Bicentenario Felisa Tolup',                 abrev: 'F. Tolup',     logo: 'img/logos/tolup.png' },
        { id: 'terrier',     nombre: 'Instituto Politécnico Bicentenario Juan Terrier Dailly',  abrev: 'J. Terrier',   logo: 'img/logos/terrier.png' },
        { id: 'perez',       nombre: 'Instituto Superior de Comercio Fernando Pérez Becerra',   abrev: 'F. Pérez',     logo: 'img/logos/perez.png' }
    ],

    // ========== FORMACIONES ==========
    formaciones: {
        futbol5: {
            nombre: 'Fútbol 5',
            jugadores: 5,
            duracion: 40, // minutos
            formacion: { arquero: 1, defensa: 2, mediocampista: 1, delantero: 1 }
        },
        futbol7: {
            nombre: 'Fútbol 7',
            jugadores: 7,
            duracion: 60, // minutos
            formacion: { arquero: 1, defensa: 2, mediocampista: 2, delantero: 2 }
        }
    },

    // ========== STATS INICIALES POR POSICIÓN ==========
    statsIniciales: {
        'Arquero': {
            velocidad: [35, 50], tiro: [25, 40], pase: [40, 55],
            defensa: [55, 70], resistencia: [45, 60]
        },
        'Defensa': {
            velocidad: [40, 55], tiro: [30, 45], pase: [40, 55],
            defensa: [55, 70], resistencia: [45, 60]
        },
        'Mediocampista': {
            velocidad: [45, 60], tiro: [40, 55], pase: [50, 65],
            defensa: [40, 55], resistencia: [50, 65]
        },
        'Delantero': {
            velocidad: [50, 65], tiro: [55, 70], pase: [40, 55],
            defensa: [25, 40], resistencia: [45, 60]
        }
    },

    // ========== RECOMPENSAS DE XP ==========
    xpRecompensas: {
        gol: 30,
        asistencia: 20,
        mvp: 50,
        victoria: 25,
        empate: 10,
        derrota: 5,
        tarjetaAmarilla: -5,
        tarjetaRoja: -15,
        porteriaInvicta: 20,
        titular: 10,
        suplente: 5
    },

    // ========== XP POR NIVEL ==========
    xpPorNivel: function(nivel) {
        return Math.floor(100 * Math.pow(1.15, nivel - 1));
    },

    // ========== LOGROS ==========
    logros: [
        { id: 'primer_gol', nombre: 'Primer Gol', desc: 'Anota tu primer gol en un partido oficial', icono: '⚽', tipo: 'goles', valor: 1 },
        { id: 'goles_10', nombre: 'Goleador', desc: 'Alcanza los 10 goles en tu carrera', icono: '🔥', tipo: 'goles', valor: 10 },
        { id: 'goles_25', nombre: 'Artillero', desc: 'Alcanza los 25 goles en tu carrera', icono: '💥', tipo: 'goles', valor: 25 },
        { id: 'goles_50', nombre: 'Máquina de Goles', desc: 'Alcanza los 50 goles en tu carrera', icono: '👑', tipo: 'goles', valor: 50 },
        { id: 'campeon_inteco', nombre: 'Campeón INTECO', desc: 'Gana un campeonato INTECO con tu curso', icono: '🏆', tipo: 'campeonato', valor: 'inteco' },
        { id: 'campeon_comeduc', nombre: 'Campeón COMEDUC', desc: 'Gana el campeonato COMEDUC con la Selección INTECO', icono: '🏅', tipo: 'campeonato', valor: 'comeduc' },
        { id: 'convocado_seleccion', nombre: 'Seleccionado', desc: 'Sé convocado a la Selección INTECO', icono: '🎖️', tipo: 'seleccion', valor: true },
        { id: 'mvp_torneo', nombre: 'MVP del Torneo', desc: 'Sé elegido como el jugador más valioso de un torneo', icono: '⭐', tipo: 'mvp', valor: true },
        { id: 'leyenda_inteco', nombre: 'Leyenda INTECO', desc: 'Completa tu carrera como Leyenda del INTECO', icono: '🌟', tipo: 'leyenda', valor: true }
    ],

    // ========== AÑOS ESCOLARES ==========
    años: ['1° Medio', '2° Medio', '3° Medio', '4° Medio'],

    // ========== NOMBRES Y APELLIDOS PARA NPCs ==========
    nombresNPC: [
        'Matías', 'Sebastián', 'Nicolás', 'Felipe', 'Diego', 'Tomás', 'Benjamín',
        'Martín', 'Lucas', 'Joaquín', 'Vicente', 'Agustín', 'Maximiliano', 'Cristóbal',
        'Ignacio', 'Andrés', 'Daniel', 'Gabriel', 'Alejandro', 'Francisco',
        'Camilo', 'Samuel', 'Rafael', 'Emilio', 'Pablo', 'Santiago', 'Eduardo',
        'Rodrigo', 'Carlos', 'Fernando', 'Héctor', 'Óscar', 'Javier', 'Manuel',
        'Renato', 'Bruno', 'Álvaro', 'Esteban', 'Gonzalo', 'Patricio', 'Claudio'
    ],

    apellidosNPC: [
        'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras',
        'Silva', 'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes',
        'Hernández', 'García', 'Garrido', 'Bravo', 'Reyes', 'Núñez',
        'Araya', 'Espinoza', 'Vergara', 'Castro', 'Pizarro', 'Cortés', 'Figueroa',
        'Tapia', 'Vega', 'Flores', 'Campos', 'Riquelme', 'Vargas', 'Vera'
    ],

    nombresNPCMujeres: [
        'Sofía', 'Martina', 'Isidora', 'Florencia', 'Emilia', 'Antonella', 'Valentina',
        'Catalina', 'María', 'Constanza', 'Javiera', 'Fernanda', 'Gabriela', 'Camila',
        'Francisca', 'Josefa', 'Pía', 'Belén', 'Scarlett', 'Amanda', 'Valeria', 'Daniela',
        'Natalia', 'Ignacia', 'Agustina', 'Laura', 'Carolina', 'Mariana', 'Estefanía',
        'Elena', 'Victoria', 'Paula', 'Sara', 'Renata', 'Isabella', 'Mia'
    ],

    alumnosInteco: {
        '1A': {
            hombres: [
                'Benjamín Aillal', 'Matias Aldana', 'Tomás Córdova', 'David Figueroa',
                'Daniel Garrido', 'Ignacio Garrido', 'Alex González', 'Joaquín Méndez',
                'Emanuel Muñoz', 'Santiago Pérez', 'Owen Puentes', 'Aaron Quenallata',
                'Zair Robles', 'Richard Rodríguez', 'Jordan Ruiz', 'Alejandro Silva',
                'Diego Torres', 'Jordan Ulloa', 'Elías Urtubía', 'Dilan Villaroel',
                'Elías Contreras', 'Adriel Cotrina'
            ],
            mujeres: [
                'Jany Barreto', 'Daniela González', 'Tracy Huang', 'Dixsy Ojeda',
                'Sofía Osorio', 'Sara Piñero', 'Jordana Pizarro', 'Alondra Ramos',
                'Rose Saint Phard', 'Sofía Tapia', 'Priscila Torres', 'María Vásquez',
                'Keyla Vedia', 'Paula Villamar', 'Faibeth Durán', 'Emilene Orellana',
                'Antonella Vásquez'
            ]
        },
        '1B': {
            hombres: [
                'Dean Becar', 'Cristóbal Bravo', 'Dylan Chávez', 'Cristhian Coello',
                'Benjamín Godoy', 'Bastián Huenulef', 'Jonathan Julcamoro', 'Diego López',
                'Felipe Martínez', 'Aníbal Pacheco', 'Joaquín Riquelme', 'Sandor Rodríguez',
                'Dayron Senador', 'Vicente Sepúlveda', 'Moisés Seura', 'Joiberth Valor',
                'Steven Salazar'
            ],
            mujeres: [
                'Antonella Ancatén', 'Macy Balladares', 'Florencia Cáceres', 'Yorleit Choque',
                'Romina Huaman', 'Daysi Melgarejo', 'Fernanda Montalvo', 'Renata Mura',
                'Francisca Obreque', 'Afka Ríos', 'Gabrielis Rodriguez', 'Anahis Sáez',
                'Antonia Sandoval', 'Valerie Simphard', 'Florencia Vergara', 'Nayra Zambra'
            ]
        },
        '1C': {
            hombres: [
                'Vicente Baeza', 'Kaletd Baldera', 'Bastian Cabellos', 'Jesús Carrión',
                'Martín Cartes', 'Sebastian Correa', 'Álvaro Cortés', 'Joaquin Espinoza',
                'Isaias Flores', 'Carlos Guerrero', 'Elías Gutiérrez', 'Aaron Joseate',
                'Wandel Mondiere', 'Vicente Neira', 'Vicente Ortiz', 'Diego Pereira',
                'Samuel Poquioma', 'Tomás Reveco', 'Dayro Sepúlveda', 'Gael Tambo',
                'Kevin Vásquez', 'Sebastián Zúñiga'
            ],
            mujeres: [
                'Marthina Alarcón', 'Isidora Alarcón', 'Mayte Alarcón', 'Valeria Clavijo',
                'Ariela Cueva', 'Fabiana Díaz', 'Emily Figueroa', 'Antonella Forti',
                'Somer Luzardo', 'Ámbar Morales', 'Krishna Quezada', 'Angela Ramos',
                'Anelis Salas', 'Sarah Sosa', 'Florencia Troncoso', 'Zharick Urbano'
            ]
        },
        '1D': {
            hombres: [
                'Adrian Colmenares', 'Bastián Espinoza', 'Joaquin Gatica', 'Franco González',
                'Vicente Ibarra', 'Cristobal Inostroza', 'Arley Inostroza', 'Wilson Lazo',
                'Dilan López', 'Dilan Micolta', 'Felipe Neira', 'Ezekiel Núñez',
                'Mathias Oliva', 'Martín Pizarro', 'Benjamín Ramos', 'Alexis Riquelme',
                'Bastián Rodríguez', 'Mesac Salas', 'Richard Sepúlveda', 'Leyker Soto'
            ],
            mujeres: [
                'Dominique Cofré', 'Ayelen Condori', 'Erika Garrido', 'Selena Gómez',
                'Marley Morales', 'Ashley Neira', 'Karin Pérez', 'Martina Rojas',
                'Isidora Sáez', 'Marie Saint Phard', 'Briana Taboada', 'Javiera Tolosa',
                'Mariel Umalla', 'Grissel Vallejos', 'Marianyelith Vargas', 'Emilia Vicencio',
                'Valentina Vidal', 'Naydelin Yarango'
            ]
        },
        '1E': {
            hombres: [
                'Victor Alva', 'Kendry Arias', 'Jordan Caro', 'Martín Castillo',
                'Ian Cerpa', 'Jarley Cevallos', 'Martín Lillo', 'Andrés Meriño',
                'Gael Millan', 'Yaim Ortega', 'Cristóbal Pavez', 'Octavio Pineda',
                'Máximo Poblete', 'Sebastián Ramirez', 'Tomás Ramírez', 'Valentín Ravera',
                'Felipe Rea', 'Tomás Retamal', 'Jorge Rodríguez', 'Cristobal Toro',
                'Matías Tovar', 'Giordano Valenzuela', 'Benjamín Vargas', 'Dayiro Vasquez',
                'Jairo Zamora', 'Carlos Aguilera', 'Jean Vidal', 'Angel Torres'
            ],
            mujeres: [
                'Aurora Gonzáles', 'Winyerli Mendoza', 'Sandra Oliden', 'Zara Pérez',
                'Josefa Pérez', 'Agustina Ramírez', 'Idimar Salas', 'Agustina Salinas',
                'Isidora Ulloa', 'Catalina Muñoz', 'Sofía Mallea', 'Pía Figueras',
                'Valentina Sosa'
            ]
        },
        '2A': {
            hombres: [
                'Gaspar Aguilera', 'Daniel Alvarado', 'Matías Canto', 'Vladimir Chávez',
                'Jonathan De Los Santos', 'Nicolás Figueroa', 'Ian Gálvez', 'Samuel Ghersi',
                'Tomás González', 'Fabián Herrera', 'Jesús Huaranca', 'Cristóbal Murillo',
                'Xahir Paz', 'Israel Ramirez', 'Nicolás Riquelme', 'Martín Sánchez',
                'Diego Seguel', 'Jerez Taboada', 'Ismael Torres', 'Luis Trejo',
                'Sebastián Urquiaga', 'David Valladares', 'Benjamín Yactayo', 'Renato Yentzen'
            ],
            mujeres: [
                'Maytte Becerra', 'Martina Catalán', 'Catalina Escanella', 'Sofía Fontealba',
                'Laura Galvan', 'Lauren Galvan', 'Martina Lagos', 'Anna Manrrique',
                'Ignacia Medina', 'Evoleth Milla', 'Joarlenis Pereira', 'Najharí Rodríguez',
                'Florencia Rueda', 'Francisca Suazo', 'Madison Torero'
            ]
        },
        '2B': {
            hombres: [
                'Santiago Aguero', 'Angelo Alvarado', 'Álvaro Barrera', 'Jairo Cabosmalon',
                'Nicolás Campora', 'Martín Córdova', 'Joaquín Gómez', 'Emiliano González',
                'Vicente González', 'Sergio Hernández', 'Abdón Isamit', 'Mario Lizama',
                'Xavi Macalupu', 'Matías Maricura', 'Jhoser Mego', 'Juan Mejias',
                'Ian Olivera', 'Talib Pizarro', 'Diogo Raymondi', 'Cesar Riveros',
                'Juan Rojo', 'Gustavo Sachahuaman', 'Luciano Silva', 'Máximo Silva',
                'Alfonso Sotelo', 'Alonso Vásquez', 'Vicente Vásquez', 'Jean Manzano'
            ],
            mujeres: [
                'Gabriela Altuve', 'Martina Cordova', 'Alexandra Gómez', 'Emilia Medel',
                'Saray Mosquera', 'Ambar Nahuelhuan', 'Sofia Navarrete', 'Jhendely Osorio',
                'Luzdary Quintana', 'Valeria Silvestre', 'Emilia Toro', 'Claudia Velasquez'
            ]
        },
        '2C': {
            hombres: [
                'Alejandro Aranda', 'Vicente Badilla', 'Raúl Calfiman', 'Dante Chávez',
                'Oscar Conde', 'Matías Contreras', 'Dayro Cotos', 'Mateo Donoso',
                'Diego Figueroa', 'Vincent Iturra', 'Fabián Lugo', 'Heider Manrique',
                'Basilio Martínez', 'Daniel Mendez', 'Maximiliano Mondaca', 'Jared Pizarro',
                'Alfonso Portuondo', 'Jeick Ramirez', 'Joaquín Rojas', 'Jean Simphard',
                'Germán Suárez', 'Josmar Umbria', 'Gaspar Vergara', 'Matías Villagrán',
                'Benjamín Villalobos', 'Nawel Cortés', 'José Dalgo', 'José Pérez'
            ],
            mujeres: [
                'Maricielo Arroyo', 'Ignacia Astete', 'Mía Espinoza', 'Noelia Figueroa',
                'Génesis Riquelme', 'Scarlett Sepúlveda', 'Nicole Torres', 'Mayline Vargas',
                'Avril Zarate', 'Zumiko Zavaleta', 'Agustina Cabello'
            ]
        },
        '2D': {
            hombres: [
                'Dedier Alarcon', 'Mauro Alva', 'Matías Bórquez', 'Dante Bustos',
                'Darell Cordova', 'Franklin De La Cruz', 'Johann Donoso', 'Diego Figueroa',
                'Vicente González', 'Alejandro Huaman', 'Omar Laguna', 'Vincent Ortega',
                'Mateo Pinilla', 'Daniel Pinto', 'Jack Ramírez', 'Jorge Rozas',
                'Mateo Ruiz', 'Dilan Toro', 'Dennis Torres', 'Martín Troncoso',
                'Joaquin Iturra', 'Yohandry Figuera'
            ],
            mujeres: [
                'Ashlie Allende', 'Paola Apaza', 'Maria Cisterna', 'Fernanda Figueroa',
                'Gabriela González', 'Javiera Grandon', 'Nataly Lastra', 'Alison Muriel',
                'Geraldine Oyanedel', 'Anthonella Rincon', 'Anaís Rodríguez', 'Juliana Segovia',
                'Kairi Sepúlveda', 'Mailen Valdes', 'Maite Morales'
            ]
        },
        '2E': {
            hombres: [
                'Carlos Alvarez', 'Jhon Bazan', 'Fernando Bustamante', 'Vicente Carrasco',
                'Ricardo Cisternas', 'Cristopher Conde', 'Alexis Contreras', 'Ángel Crespo',
                'Antonio Díaz', 'Justin Díaz', 'Duberney Espinoza', 'Jonás Figueroa',
                'Mario Gálvez', 'Sebastián García', 'Lucian Guzmán', 'Benjamín Huaman',
                'Amaro Jerez', 'Ricardo Ledesma', 'Jesús Masias', 'Luis Montaño',
                'Christian Ponce', 'Jeyko Rodríguez', 'Cristopher Salloni', 'Vicente Santana',
                'Marvin Santillan', 'Edward Uribe', 'Ezequiel Vargas', 'Cristóbal Villablanca'
            ],
            mujeres: [
                'Ayline Cisternas', 'Antonella Cornelio', 'Martina Espinoza', 'Cielo Gutierrez',
                'Constanza Huala', 'Ishta Ide', 'Valentina López', 'Fernanda Oliva',
                'Constanza Pinto', 'Luana Santur', 'Isabella Trujillo', 'Aracely Vedia'
            ]
        },
        '3A': {
            hombres: [
                'Jhostyn Acosta', 'Lukas Astroza', 'Dereck Avila', 'Dylan Bizarro',
                'Dylan Cortés', 'Jeremy Cuellar', 'Martín Hernández', 'Matías Herrera',
                'Marco Hinojosa', 'Leonardo Lujan', 'Mijael Mamani', 'Franco Marchant',
                'Benjamín Medina', 'Eliseo Norambuena', 'Jasiel Nuñez', 'Andrew Olivares',
                'Vicente Peralta', 'Gaspar Rivas', 'Josua Rodriguez', 'Rafael Rosas',
                'Octavio Toribio', 'Lucas Valdivia', 'Tomas Zamorano', 'Carlos Higuera'
            ],
            mujeres: [
                'Nabat Ancalle', 'Maida Araya', 'Bianca Arnechino', 'Nayely Asencios',
                'Annaís Astete', 'Catherine Bejares', 'Karla Castañeda', 'Avril Gómez',
                'Maria Mejia', 'Keily Méndez', 'Constanza Onetto', 'Jazmín Quispe',
                'Massiel Saenz', 'Tayra Toscano', 'Anais Yana'
            ]
        },
        '3B': {
            hombres: [
                'Matías Arrué', 'Mauricio Castillo', 'Andrés Cavieres', 'Philippe Cortes',
                'André Falcón', 'Johans Filumil', 'Ivan Gallardo', 'Samir Gonzalez',
                'Emilio Inostroza', 'Brandon Jaramillo', 'Benjamín León', 'Lelis Lucio',
                'Matias Maldonado', 'Gabriel Milla', 'Lukas Moral', 'Máximo Morales',
                'Héctor Neira', 'Abel Pacheco', 'Angel Salas', 'Christian Salvo',
                'Martín Saravia', 'Benjamín Sepúlveda', 'Alonso Sereño', 'Benjamín Varela',
                'Alonso Vergara', 'Dann Fuenmayor', 'Brayan Cardenas'
            ],
            mujeres: [
                'Bianka Cadena', 'Fernanda Guevara', 'Sophia Oliva', 'Catalina Pacheco',
                'Angeline Peñafiel', 'Emily Peters', 'Mariely Poche', 'Francoise Zúñiga'
            ]
        },
        '3C': {
            hombres: [
                'Lucas Araya', 'Benjamín Ayala', 'Enzo Cadenillas', 'Benjamín Cruz',
                'Matias Espinoza', 'Tomás Fuentealba', 'Stiven Gomez', 'Thiago Guado',
                'Sebastián Hernández', 'Erick Mantilla', 'Neicer Matamoros', 'Javier Méndez',
                'Simón Muñoz', 'Jorge Neciosup', 'Francisco Olivos', 'Leonardo Palomino',
                'Vicente Pino', 'Maximiliano Piñero', 'Diego Sinisterra', 'Jhordan Vásquez',
                'Esteban Venegas', 'Alex González'
            ],
            mujeres: [
                'Martina Araya', 'Sofía Astete', 'Constanza Barboza', 'Barbara Cardenas',
                'Samira Cardenas', 'Jael Cardona', 'Belén Castillo', 'Lia Cavieres',
                'Hitomi Futalef', 'Megan Futalef', 'Alizon Gomez', 'Yenifer Guzman',
                'Francheska Mendez', 'Fernanda Merino', 'Valeria Muñoz', 'Samantha Quevedo',
                'Adriana Ramos', 'Sofia Sacsa', 'Moiseivis Salamanca', 'Abigail Vega',
                'Davielys Yajure'
            ]
        },
        '3D': {
            hombres: [
                'Maximiliano Astudillo', 'Luis Birkelbach', 'Luis Bustos', 'Lucas Campos',
                'Jackson Carpio', 'Jean Castaño', 'Jheyner Coz', 'Dairo Cruz',
                'Matias Del Canto', 'Andre Delgado', 'Jorge Fernández', 'Franco Gómez',
                'Aaron Gomez', 'André Gonzáles', 'Ian González', 'Leandro Herrera',
                'Alfredo Jara', 'Joseph Leon', 'Gonzalo Lucero', 'Damián Meza',
                'Octavio Morales', 'Eloy Orellana', 'Angel Quiroz', 'Carlos Quispe',
                'Javier Reyes', 'Kevin Saldías', 'Santiago Solis', 'Willy Teran',
                'Giovanny Torres', 'Diego Urra', 'Bastian Vargas', 'Bryan Zurita'
            ],
            mujeres: [
                'Jazminne Angarita', 'Lettice Meza', 'Luciana Montiel', 'Ketlen Quispe',
                'María Sira', 'Evelyn Vidal'
            ]
        },
        '3E': {
            hombres: [
                'Yovanni Arellano', 'Misael Cáceres', 'Steven Calderon', 'Diego Cubillos',
                'Jorge Garrido', 'Hederth Henostroza', 'Erick Huacho', 'Sebastián Hurtado',
                'Lucas Ibarra', 'Maximiliano Ocampo', 'Benjamín Palma', 'Martín Rojas',
                'Joaquín Sandoval', 'Christián Soto', 'Josué Torres', 'Alonso Trina',
                'Alonso Uribe', 'Amaro Vega', 'Dayron Vicente', 'Luciano Villegas',
                'Máximo Morales'
            ],
            mujeres: [
                'Pascale Barrientos', 'Isidora Campos', 'Bélen Conde', 'Amanda Corales',
                'Gabriela Dotis', 'Bianca González', 'Yasuri Herrera', 'Sharon Huaccha',
                'Mauren Hurtado', 'Ignacia Lazo', 'Fernanda Olivos', 'Belén Osses',
                'Valeria Rafael', 'Lidia Rivera', 'Lizeth Rodríguez', 'Ayelén Soto'
            ]
        },
        '4A': {
            hombres: [
                'Leandro Arcia', 'Jose Avilez', 'George Barreto', 'José Fernandez',
                'Sebastian Guerra', 'Adan Hermosilla', 'Gaston Herrera', 'Miguel Huanca',
                'Denzel Kliebs', 'Cesar Llenque', 'Andri Manrrique', 'José Olivares',
                'Benjamín Pineda', 'Sebastian Ruiz', 'Yeffry Silva', 'Benjamín Silva',
                'Sebastián Soto', 'Ian Soto', 'Steven Verdi'
            ],
            mujeres: [
                'Constanza Acevedo', 'Bárbara Araya', 'Valentina Barrios', 'Mia Becerra',
                'Mathy Campora', 'Isidora Catalan', 'Scarlet Dalgo', 'Kerla Dorsainvil',
                'Maria Espinoza', 'María Flores', 'Massiel Gomez', 'Sofia Mendoza',
                'Angélica Micolta', 'Matilda Ramirez', 'Mia Reyes', 'Denisse Rodríguez',
                'Valeria Rojas', 'Maithe Rojas', 'Joselin Silva', 'Leeyha Torres',
                'Darlyng Troncoso', 'Maria Venegas'
            ]
        },
        '4B': {
            hombres: [
                'Eavan Arias', 'Gibson Arroyo', 'Joel Becerra', 'Vicente Bueno',
                'Luis Caicedo', 'Didier Carrasco', 'Omar Castillo', 'Jesús Céspedes',
                'Albeiro Correa', 'Byron Correa', 'Carlos Diez', 'Matías Fuentes',
                'Lucas Galaz', 'Ignacio Grandón', 'Damian Guzmán', 'Marcelo Inostroza',
                'Edwar Rafael', 'Fabián Rodríguez', 'Renato Usseglio'
            ],
            mujeres: [
                'Anelis Alarcón', 'Kiara Arteaga', 'Amelie Bravo', 'Valeria Celis',
                'Anais De La Fuente', 'Diosangel Rodríguez', 'Anahis Yañez'
            ]
        },
        '4C': {
            hombres: [
                'Jesús Calderon', 'Maximiliano Diaz', 'David Fernandez', 'Johan Franco',
                'Davis Giron', 'Lian Llancapan', 'Joaquín Lovazzano', 'Dylan Lucero',
                'Samuel Luzardo', 'Francisco Opazo', 'Nahbit Opitz', 'Leonardo Palacios',
                'Cristóbal Palma', 'Ian Peralta', 'Felipe Rebolledo', 'José Roa',
                'Albeyro Rodriguez', 'Gonzalo Rodríguez', 'Eliú Romero', 'Bastian Rozas',
                'Randy Salazar', 'Matias Santibañez', 'Matias Uribe', 'Ismael Valbuena',
                'Edgard Vivanco'
            ],
            mujeres: [
                'Andrea Bastidas', 'Valentina Campano', 'Greysi Castañeda', 'Valentina Fuentes',
                'Valentina García', 'Constanza Gómez', 'Yanira Maldonado', 'Sofia Navarro',
                'Lesly Nole', 'Cristine Olivares', 'Elizabeth Paillaleo', 'Trinidad Ramírez',
                'Isidora Saavedra', 'Liz Siles', 'Genesis Cabral'
            ]
        },
        '4D': {
            hombres: [
                'Benjamín Adriazola', 'Luciano Alarcón', 'Natanael Castro', 'Barac Escobar',
                'Daniel Ghersi', 'Maximiliano González', 'Amaro Lavanderos', 'Amaro Lezana',
                'Kevin Llanca', 'Martin Moreira', 'Esteban Muñoz', 'Maximiliano Opazo',
                'Vicente Peña', 'Kevin Ramírez', 'Fernando Rodriguez', 'Manuel Rodríguez',
                'Raúl Sánchez', 'Arnold Suarez', 'Abdiel Torrealba', 'Ignacio Ulloa',
                'Matías Ulloa', 'Jeshua Useche'
            ],
            mujeres: [
                'Scarlett Castillo', 'Hellen Del Valle', 'Florencia Opazo', 'Zoe Rivera',
                'Bethel ST Paul'
            ]
        },
        '4E': {
            hombres: [
                'Martín Adriazola', 'Joaquin Arce', 'Cristofer Benitez', 'Jose Choque',
                'Miguel Crespo', 'Leandro Criollo', 'Thomas Domke', 'Renato Figueroa',
                'Bruno Fuentes', 'Edward Gallardo', 'Gabriel González', 'Juan Guarin',
                'Aoni Nuñez', 'Jean Parra', 'Ricardo Ramirez', 'Vicente Ramírez',
                'Freidder Ramos', 'Gerson Rodriguez', 'Daniel Santander', 'Angel Toledo',
                'José Urbina'
            ],
            mujeres: [
                'Fathima Arroyo', 'Magdalena Catalán', 'Belén Figueroa', 'Antonella Gutierrez',
                'Sharay Herrera', 'Djenica Joseph', 'Eymi Lara', 'Josefina Maldonado',
                'Scarlett Martínez', 'Michelle Meneses', 'Sofia Morales', 'Isidora Norambuena',
                'Michelle Paredes', 'Catalina Pineda', 'Janys Plasencia', 'Ana Quispe',
                'Allison Rebolledo', 'Rosanyelin Santana', 'Lina Sol', 'Daira Torres'
            ]
        }
    },

    // ========== COLORES DE EQUIPOS ==========
    coloresEquipos: {
        '1A': '#e74c3c', '1B': '#3498db', '1C': '#2ecc71', '1D': '#f39c12', '1E': '#9b59b6',
        '2A': '#e74c3c', '2B': '#3498db', '2C': '#2ecc71', '2D': '#f39c12', '2E': '#9b59b6',
        '3A': '#e74c3c', '3B': '#3498db', '3C': '#2ecc71', '3D': '#f39c12', '3E': '#9b59b6',
        '4A': '#e74c3c', '4B': '#3498db', '4C': '#2ecc71', '4D': '#f39c12', '4E': '#9b59b6'
    },

    // ========== MENSAJES DE NOTICIAS ==========
    plantillasNoticias: {
        resultado: [
            '⚽ {equipo1} {score1} - {score2} {equipo2}. {detalle}',
            '📰 Jornada emocionante: {equipo1} {score1} - {score2} {equipo2}',
            '🏟️ {equipo1} se enfrenta a {equipo2} con resultado {score1}-{score2}'
        ],
        gol: [
            '¡{jugador} marca un golazo para {equipo}!',
            'Gran definición de {jugador} en el partido contra {rival}',
            '{jugador} no para de marcar goles para {equipo}'
        ],
        convocatoria: [
            '📋 ¡{jugador} ha sido convocado a la Selección INTECO!',
            '🎖️ La Selección INTECO llama a {jugador} para el COMEDUC',
            '⭐ {jugador} cumple el sueño de vestir la camiseta de la Selección INTECO'
        ],
        mvp: [
            '⭐ {jugador} elegido MVP del partido contra {rival}',
            '🌟 Actuación estelar de {jugador}: MVP indiscutible',
            '👏 {jugador} se lleva el premio al mejor jugador del encuentro'
        ],
        campeon: [
            '🏆 ¡{equipo} se consagra campeón del {torneo}!',
            '🎉 {equipo} levanta el trofeo del {torneo}',
            '👑 {equipo} es el nuevo rey del {torneo}'
        ],
        lesion: [
            '🏥 {jugador} sufre una molestia física y pierde condición',
            '⚠️ {jugador} recibe un golpe durante el entrenamiento',
            '😰 Alerta: {jugador} presenta molestias musculares'
        ]
    },

    // ========== FINALES POSIBLES ==========
    finales: {
        jugadorCurso: {
            titulo: 'Jugador del Curso',
            desc: 'Has sido reconocido como el mejor jugador de tu curso durante tu carrera en INTECO.',
            icono: '🎓',
            reqMin: 30 // puntaje mínimo
        },
        figuraEspecialidad: {
            titulo: 'Figura de la Especialidad',
            desc: 'Tu talento ha brillado no solo en la cancha sino también como referente de tu especialidad.',
            icono: '💼',
            reqMin: 50
        },
        capitanSeleccion: {
            titulo: 'Capitán de la Selección INTECO',
            desc: 'Has liderado a la Selección INTECO como su capitán, dejando huella en cada torneo.',
            icono: '©️',
            reqMin: 70
        },
        campeonCOMEDUC: {
            titulo: 'Campeón COMEDUC',
            desc: 'Levantaste la copa más importante del circuito escolar COMEDUC.',
            icono: '🏆',
            reqMin: 85
        },
        leyendaINTECO: {
            titulo: 'Leyenda INTECO',
            desc: '¡Tu nombre quedará grabado para siempre en la historia del Instituto Tecnológico y Comercial Recoleta!',
            icono: '🌟',
            reqMin: 95
        }
    }
};

// Función utilitaria para obtener todos los equipos como array plano
DATOS.obtenerTodosLosEquipos = function() {
    const todos = [];
    for (let año = 1; año <= 4; año++) {
        todos.push(...this.equipos[año]);
    }
    return todos;
};

// Función para obtener equipo por ID
DATOS.obtenerEquipoPorId = function(id) {
    const todos = this.obtenerTodosLosEquipos();
    return todos.find(e => e.id === id) || null;
};

// Función para generar nombre NPC aleatorio
DATOS.generarNombreNPC = function(equipoId, genero) {
    const nombres = (genero === 'Mujer') ? this.nombresNPCMujeres : this.nombresNPC;
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = this.apellidosNPC[Math.floor(Math.random() * this.apellidosNPC.length)];
    return `${nombre} ${apellido}`;
};

// Función para obtener todos los alumnos de INTECO de un género específico
DATOS.obtenerAlumnosIntecoPorGenero = function(genero) {
    const list = [];
    const key = (genero === 'Mujer') ? 'mujeres' : 'hombres';
    for (const curso in this.alumnosInteco) {
        list.push(...this.alumnosInteco[curso][key]);
    }
    return list;
};

// Función para obtener los equipos del año del jugador
DATOS.obtenerEquiposDelAño = function(año) {
    return this.equipos[año] || [];
};

console.log('✅ data.js cargado correctamente');
