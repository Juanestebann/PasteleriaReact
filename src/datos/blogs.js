// Noticias del blog (las mismas de blogs.html, blog-detalle-1.html y blog-detalle-2.html de la Ev1).
// Antes cada noticia era una página HTML aparte; ahora son datos y una sola página las dibuja.

const blogs = [
    {
        id: 'cheftalks-2026',
        categoria: 'Gastronomía',
        fecha: '4 de junio de 2026',
        titulo: 'Carolina Bazán inauguró las ChefTalks! 2026 en Duoc UC',
        resumen:
            'La reconocida chef Carolina “China” Bazán dio inicio a las ChefTalks! 2026 de Duoc UC, compartiendo su trayectoria, aprendizajes y experiencia en el mundo de la gastronomía junto a estudiantes y docentes.',
        introduccion:
            'La reconocida chef Carolina “China” Bazán participó en el inicio de las ChefTalks! 2026, una instancia destinada a compartir experiencias, aprendizajes y distintas miradas sobre el mundo de la gastronomía.',
        imagen: 'https://www.duoc.cl/wp-content/uploads/2026/06/compressed-Conce.jpg',
        secciones: [
            {
                titulo: 'Una experiencia para compartir conocimientos',
                parrafos: [
                    'Las ChefTalks! buscan acercar a estudiantes y docentes a profesionales destacados de la gastronomía, generando espacios en los que puedan conocer experiencias reales relacionadas con la cocina y el desarrollo profesional.',
                    'En esta oportunidad, Carolina Bazán compartió parte de su trayectoria, sus experiencias dentro de la industria gastronómica y diferentes aprendizajes que ha adquirido durante su carrera.',
                ],
            },
            {
                titulo: 'La importancia de aprender desde la experiencia',
                parrafos: [
                    'Este tipo de encuentros permite complementar la formación académica con experiencias provenientes directamente del mundo profesional.',
                    'Para quienes se están formando en gastronomía, conocer las experiencias de chefs y profesionales del área puede aportar nuevas perspectivas sobre creatividad, trabajo en equipo, innovación y desarrollo dentro de la cocina.',
                ],
            },
            {
                titulo: 'Gastronomía y nuevas generaciones',
                parrafos: [
                    'Actividades como las ChefTalks! también buscan motivar a nuevas generaciones interesadas en la gastronomía, acercándolas a referentes del rubro y mostrando diferentes caminos de desarrollo profesional.',
                ],
            },
        ],
        fuente: 'https://www.duoc.cl/?noticia_post_type=carolina-bazan-inauguro-las-cheftalks-2026-en-duoc-uc',
        // Versión corta que se muestra en el Inicio (mismos textos de index.html de la Ev1)
        inicio: {
            etiqueta: 'Gastronomía',
            titulo: 'Carolina Bazán inauguró las ChefTalks! 2026',
            resumen:
                'La reconocida chef compartió su experiencia y trayectoria profesional, acercando a estudiantes y docentes a nuevas miradas sobre la gastronomía.',
        },
    },
    {
        id: 'melipilla-en-copas',
        categoria: 'Gastronomía local',
        fecha: '28 de enero de 2026',
        titulo: 'Duoc UC Melipilla aporta experiencia gastronómica en feria vinícola “Melipilla en Copas”',
        resumen:
            'Docentes de Gastronomía de Duoc UC participaron en la feria “Melipilla en Copas”, realizando maridajes junto a viñas locales y destacando los sabores, aromas y productos de la provincia.',
        introduccion:
            'Docentes del área de Gastronomía de Duoc UC participaron en “Melipilla en Copas”, una actividad que reunió gastronomía, vinos y productos locales en una experiencia enfocada en destacar la identidad de la provincia.',
        imagen: 'https://www.duoc.cl/wp-content/uploads/2026/01/Duoc-UC-1.jpg',
        secciones: [
            {
                titulo: 'Gastronomía y vino en un mismo encuentro',
                parrafos: [
                    'La feria “Melipilla en Copas” reunió a productores, viñas, emprendedores y representantes del mundo gastronómico en una actividad orientada a mostrar parte de la identidad culinaria y vitivinícola de la provincia.',
                    'En esta instancia, docentes de Gastronomía de Duoc UC participaron aportando sus conocimientos y experiencia en diferentes preparaciones y propuestas gastronómicas.',
                ],
            },
            {
                titulo: 'Maridajes con productos de la zona',
                parrafos: [
                    'Una de las actividades destacadas fue la realización de maridajes entre distintas preparaciones y vinos de productores locales.',
                    'Este tipo de experiencias permite combinar sabores, aromas y texturas, mostrando cómo la gastronomía puede complementar y potenciar las características de diferentes vinos.',
                ],
            },
            {
                titulo: 'Una oportunidad para destacar la identidad local',
                parrafos: [
                    'La participación en actividades como “Melipilla en Copas” permite fortalecer la relación entre la gastronomía, los productores locales y la comunidad.',
                    'Además, genera espacios para difundir productos de la provincia y valorar el trabajo de quienes participan en el desarrollo gastronómico y vitivinícola de la zona.',
                ],
            },
        ],
        fuente: 'https://www.duoc.cl/?noticia_post_type=duoc-uc-melipilla-aporta-experiencia-gastronomica-en-feria-vinicola-melipilla-en-copas',
        inicio: {
            etiqueta: 'Melipilla en Copas',
            titulo: 'Duoc UC Melipilla en “Melipilla en Copas”',
            resumen:
                'Docentes de Gastronomía participaron en una feria que reunió vinos, productos locales y propuestas culinarias para destacar la identidad de la provincia.',
        },
    },
]

// Busca una noticia por su id (el que va en la URL /blogs/:id). Devuelve null si no existe.
export function obtenerBlog(id) {
    return blogs.find((blog) => blog.id === id) ?? null
}

export default blogs