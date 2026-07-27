export const navLinks = [
  { label: 'EVENTOS', href: '#eventos' },
  { label: 'VIANDAS', href: '#viandas' },
  { label: 'FREEZER READY', href: '#freezer-ready' },
  { label: 'CONTACTO', href: '#contacto' },
];

export const philosophy = {
  scriptTitleLines: ['Somos', 'lo que', 'comemos'],
  body:
    'Creemos en el equilibrio entre disfrutar y cuidarse. Cocinamos con ingredientes reales y de calidad para acompañarte todos los días y también en tus momentos más inolvidables. Porque comer bien no es lujo, es una forma de vivir.',
};

export const services = {
  title: 'Tres formas de acompañarte.',
  intro: 'Elegí la propuesta que mejor se adapte a tu momento.',
  items: [
    {
      number: '01',
      title: 'EVENTOS',
      description: [
        'Comidas privadas, catering y celebraciones a medida,',
        'con el chef en tu casa.',
      ],
      href: '#eventos',
      image: '/images/foto-eventos.jpeg',
      secondaryImage: '/assets/manos-vitta.png',
      imageKey: 'eventos',
      alt: 'Manos vertiendo aceite de oliva sobre aceitunas en una mesa',
    },
    {
      number: '02',
      title: 'VIANDAS',
      description: [
        'Comidas elaboradas por un chef, listas para todos los días.',
        'Prácticas, abundantes y reales.',
      ],
      href: '#viandas',
      image: '/images/foto-viandas.png',
      secondaryImage: '/assets/ramen.png',
      imageKey: 'viandas',
      alt: 'Ensalada fresca con palta, tomates y quinoa en un bowl blanco',
    },
    {
      number: '03',
      title: 'FREEZER READY',
      description: [
        'Platos elaborados para conservar, calentar y disfrutar',
        'cuando quieras.',
      ],
      href: '#freezer-ready',
      image: '/images/foto-freezer-ready-horizontal.png',
      secondaryImage: '/assets/milanesa.png',
      imageKey: 'freezer',
      alt: 'Tres bandejas de aluminio listas para congelar',
    },
  ],
};

export const events = {
  title: 'Eventos',
  paragraphs: [
    'Creamos experiencias gastronómicas pensadas para cada ocasión. Desde encuentros privados hasta celebraciones especiales, diseñamos un menú a medida para que solo tengas que disfrutar.',
    'Cada evento empieza con una conversación. Contanos tu idea y diseñemos juntos una experiencia gastronómica a medida.',
  ],
  cta: 'COORDINAR EVENTO',
};

export const viandasIntro = {
  title: 'Viandas',
  subtitleLines: [
    'Elegí el formato que mejor se adapte a tu semana.',
    'Comida real, lista para disfrutar cuando la necesites.',
  ],
  blocks: [
    {
      heading: 'PORCIONES',
      body: 'Cada preparación se porciona por peso para asegurar una cantidad abundante en cada pedido.',
      bodyLines: [
        'Cada preparación se porciona por peso para',
        'asegurar una cantidad abundante en cada pedido.',
      ],
      detail: [
        { weight: '250 g', label: 'Individual abundante' },
        { weight: '500 g', label: 'Para 2–3 personas' },
      ],
    },
    {
      heading: 'PREPARACIÓN',
      body: '20 minutos de horno y listo para disfrutar.',
      bodyLines: ['20 minutos de horno', 'y listo para disfrutar.'],
    },
    {
      heading: 'ENTREGA',
      body: 'Las comidas se entregan con la guarnición separada para conservar mejor cada preparación.',
      bodyLines: [
        'Las comidas se entregan con la guarnición',
        'separada para conservar mejor cada preparación.',
      ],
      note: 'Ensaladas en frascos retornables.',
    },
    {
      heading: 'CONSERVACIÓN',
      body: 'Hasta 4 días en heladera y hasta 3 meses en el freezer.',
      bodyLines: ['Hasta 4 días en heladera', 'y hasta 3 meses en el freezer.'],
    },
  ],
};

export const viandasGlutenInfo = {
  title: 'OPCIONES SIN TACC',
  body:
    'Todos nuestros platos están disponibles en versión Sin TACC. Indicá la opción al realizar tu pedido.',
};

export const freezerGlutenInfo = {
  title: 'OPCIONES SIN TACC',
  body:
    'Todos nuestros productos pueden pedirse en versión Sin TACC, salvo las pastas. Indicá la opción elegida al realizar tu pedido.',
};

export const viandasMenuPart1 = {
  title: 'Menú',
  columns: [
    {
      categories: [
        {
          name: 'CARNES',
          prices: ['$19.900 · Individual abundante (250 g)', '$37.900 · 2-3 personas (500 g)'],
          items: [
            'Roast beef braseado',
            'Pastel de papa',
            'Ternera al vino tinto',
            'Osobuco braseado',
            'Vacío braseado',
            'Albóndigas',
          ],
        },
        {
          name: 'CERDOS',
          prices: ['$17.900 · Individual abundante (250 g)', '$33.900 · 2-3 personas (500 g)'],
          items: ['Cerdo agridulce', 'Solomillo', 'Bondiola braseada'],
        },
      ],
    },
    {
      categories: [
        {
          name: 'POLLOS',
          prices: ['$16.900 · Individual abundante (250 g)', '$31.900 · 2-3 personas (500 g)'],
          items: [
            'Pollo al curry',
            'Pata muslo',
            'Pollo teriyaki',
            'Pollo mostaza y miel',
            'Pollo con vegetales asados',
          ],
        },
        {
          name: 'PESCADOS',
          prices: ['$20.900 · Individual abundante (250 g)', '$39.900 · 2-3 personas (500 g)'],
          items: [
            'Salmón teriyaki',
            'Salmón a las hierbas',
            'Merluza gratinada',
            'Trucha al limón',
          ],
        },
      ],
    },
    {
      categories: [
        {
          name: 'TARTAS & QUICHES',
          prices: ['$15.900 · Individual (4 porciones)', '$24.900 · Familiar (8 porciones)'],
          items: [
            'Puerro, panceta y queso',
            'Espinaca',
            'Jamón y queso',
            'Capresse',
            'Atún',
            'Calabaza y brie',
            'Pollo desmenuzado',
          ],
        },
        {
          name: 'SOPAS',
          prices: ['$13.900 · Individual', '$21.900 · Familiar'],
          items: ['Cebolla', 'Papa y puerro', 'Calabaza'],
        },
      ],
    },
  ],
};

export const viandasMenuPart2 = {
  columns: [
    {
      name: 'GUARNICIONES',
      prices: ['$9.900 · Individual', '$18.900 · 2-3 personas'],
      items: [
        'Papas a la crema',
        'Tortilla de papa',
        'Papas fritas',
        'Papines',
        'Papas rústicas',
        'Puré de papa',
        'Puré de boniato',
        'Arroz pilaf',
        'Arroz yamaní',
        'Cous cous',
        'Quinoa',
      ],
    },
    {
      name: 'ENSALADAS',
      prices: ['$15.900 · Individual abundante'],
      note: 'Todas nuestras ensaladas se entregan en recipientes de vidrio herméticos retornables.',
      items: [
        {
          name: 'Mediterránea',
          ingredients: 'Lechuga, tomate cherry, pepino, morrón, aceitunas negras, queso feta y orégano.',
        },
        {
          name: 'De estación',
          ingredients: 'Mix de verdes, zanahoria, remolacha, rabanitos, naranja, semillas y frutos secos.',
        },
        {
          name: 'De lentejas',
          ingredients: 'Lentejas, morrón, cebolla morada, tomate, perejil y limón.',
        },
        {
          name: 'Toscana',
          ingredients: 'Rúcula, tomates secos, mozzarella, albahaca, aceitunas y parmesano.',
        },
        {
          name: 'De quinoa',
          ingredients: 'Quinoa, palta, tomate cherry, cebolla morada y camarones.',
        },
        {
          name: 'César',
          ingredients: 'Lechuga romana, pollo, crutones, parmesano y aderezo césar.',
        },
      ],
    },
  ],
  footer: {
    title: 'Hablemos.',
    body: 'Contanos qué estás imaginando y diseñemos juntos una experiencia a medida.',
    cta: 'CONTACTO',
  },
};

export const viandasMenu = {
  title: viandasMenuPart1.title,
  primaryCategories: [
    viandasMenuPart1.columns[0].categories[0],
    viandasMenuPart1.columns[1].categories[0],
    viandasMenuPart1.columns[2].categories[0],
    viandasMenuPart1.columns[0].categories[1],
    viandasMenuPart1.columns[1].categories[1],
    viandasMenuPart1.columns[2].categories[1],
  ],
  wideCategories: viandasMenuPart2.columns,
};

export const freezerIntro = {
  title: 'Freezer Ready',
  subtitleLines: [
    'Elaborados y congelados en su punto',
    'para conservar todo su sabor y calidad.',
  ],
  items: [
    { name: 'Milanesas', minimum: '1 kg', glutenFree: true },
    { name: 'Empanadas', minimum: '1 docena', glutenFree: true },
    { name: 'Pastas', minimum: '1 caja', glutenFree: false },
  ],
};

export const freezerMenu = {
  title: 'Menú',
  columns: [
    {
      name: 'EMPANADAS',
      price: '$36.000 · 1 docena',
      items: ['Carne cuchillo', 'Jamon y Queso', 'Pollo', 'Bondiola', 'Calabaza, Nuez y Roque'],
    },
    {
      name: 'PASTAS',
      price: '$17.900 · 1 caja (400g)',
      items: [
        'Gnoccis de papa',
        'Gnoccis Souffles',
        'Ravioles Jamon y Muzza',
        'Ravioles Ricotta y Espinaca',
        'Sorrentinos Jamon y Muzza',
        'Sorrentinos Ricotta y Espinaca',
      ],
    },
    {
      name: 'MILANESAS',
      items: [
        { label: 'Carne', price: '$23.900 · 1 kg' },
        { label: 'Pollo', price: '$19.900 · 1 kg' },
      ],
    },
    {
      name: 'SALSAS',
      price: '$12.900 · 500g',
      items: ['Pomodoro', 'Bolognesa', 'Crema de hongos', 'Crema de puerro'],
    },
  ],
};

export const contact = {
  title: 'Contacto',
  body: 'Contanos qué estás imaginando y diseñemos juntos una experiencia a medida.',
  cta: 'ESCRIBINOS POR WHATSAPP',
};
