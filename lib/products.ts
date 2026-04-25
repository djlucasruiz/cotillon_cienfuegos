export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  imageAlt: string
  badge?: string
  badgeColor?: string
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const categories: Category[] = [
  { id: "todos", name: "Todos", icon: "sparkles", color: "oklch(0.6 0.22 5)" },
  { id: "globos", name: "Globos", icon: "circle", color: "oklch(0.58 0.18 240)" },
  { id: "cotillon", name: "Cotillón", icon: "star", color: "oklch(0.72 0.2 50)" },
  { id: "disfraces", name: "Disfraces", icon: "wand", color: "oklch(0.62 0.18 145)" },
  { id: "decoracion", name: "Decoración", icon: "gift", color: "oklch(0.6 0.22 5)" },
  { id: "cumpleanos", name: "Cumpleaños", icon: "cake", color: "oklch(0.72 0.2 50)" },
  { id: "cotillon-escolar", name: "Escolar", icon: "pen", color: "oklch(0.58 0.18 240)" },
  { id: "fuegos-artificiales", name: "Fuegos Artificiales", icon: "sparkles", color: "oklch(0.65 0.18 35)" },
]

export const products: Product[] = [
  // Globos
  {
    id: "glob-001",
    name: "Pack Globos Metalizados x10",
    description: "Globos metalizados de 30cm, ideales para decorar cumpleaños y fiestas. Colores surtidos.",
    price: 2500,
    category: "globos",
    image: "https://placehold.co/400x300?text=Metallic+balloons+pack+shiny+colorful+party+decoration+assorted+colors",
    imageAlt: "Pack de 10 globos metalizados brillantes en colores surtidos para fiestas",
    badge: "Más vendido",
    badgeColor: "oklch(0.6 0.22 5)",
    featured: true,
  },
  {
    id: "glob-002",
    name: "Globo Número Dorado 80cm",
    description: "Globo número gigante dorado, ideal para decorar el número del cumpleaños.",
    price: 1800,
    category: "globos",
    image: "https://placehold.co/400x300?text=Giant+gold+number+balloon+80cm+birthday+party+decoration",
    imageAlt: "Globo número gigante dorado de 80cm para decoración de cumpleaños",
    featured: true,
  },
  {
    id: "glob-003",
    name: "Globos de Látex x50",
    description: "Bolsa de 50 globos de látex de colores vivos, perfectos para inflar con helio o aire.",
    price: 1200,
    category: "globos",
    image: "https://placehold.co/400x300?text=Latex+balloons+bag+50+units+vibrant+colors+birthday+party",
    imageAlt: "Bolsa de 50 globos de látex en colores vivos para fiestas y cumpleaños",
    badge: "Oferta",
    badgeColor: "oklch(0.72 0.2 50)",
  },
  {
    id: "glob-004",
    name: "Arco de Globos Profesional",
    description: "Kit para armar un arco de globos de 2 metros, incluye globos y estructura.",
    price: 8500,
    category: "globos",
    image: "https://placehold.co/400x300?text=Professional+balloon+arch+2+meters+colorful+party+entrance+decoration",
    imageAlt: "Kit de arco de globos profesional de 2 metros para decoración de fiestas",
  },
  // Cotillón
  {
    id: "cot-001",
    name: "Set Cotillón Completo x10",
    description: "Set completo para 10 personas: gorros, trompetas, serpentinas, confeti y anteojos.",
    price: 5200,
    category: "cotillon",
    image: "https://placehold.co/400x300?text=Complete+party+favor+set+10+people+hats+trumpets+streamers+confetti",
    imageAlt: "Set completo de cotillón para 10 personas con gorros, trompetas, serpentinas y confeti",
    badge: "Nuevo",
    badgeColor: "oklch(0.62 0.18 145)",
    featured: true,
  },
  {
    id: "cot-002",
    name: "Gorros de Cumpleaños x12",
    description: "Gorros cónicos coloridos con elástico, diseños variados para cumpleaños.",
    price: 950,
    category: "cotillon",
    image: "https://placehold.co/400x300?text=Birthday+party+hats+12+units+colorful+cone+shaped+elastic",
    imageAlt: "Pack de 12 gorros cónicos coloridos con elástico para cumpleaños",
  },
  {
    id: "cot-003",
    name: "Serpentinas de Colores x20",
    description: "Serpentinas de papel de colores vivos, 20 unidades. Imprescindibles para cualquier festejo.",
    price: 700,
    category: "cotillon",
    image: "https://placehold.co/400x300?text=Colorful+paper+streamers+20+units+vibrant+celebration+party",
    imageAlt: "Pack de 20 serpentinas de papel en colores vivos para fiestas",
    badge: "Oferta",
    badgeColor: "oklch(0.72 0.2 50)",
  },
  {
    id: "cot-004",
    name: "Confeti de Colores 200g",
    description: "Confeti de papel en formas variadas y colores brillantes. Bolsa de 200 gramos.",
    price: 600,
    category: "cotillon",
    image: "https://placehold.co/400x300?text=Colorful+paper+confetti+200g+shapes+stars+hearts+circles+bright",
    imageAlt: "Bolsa de 200g de confeti de papel en formas y colores variados",
  },
  // Disfraces
  {
    id: "dis-001",
    name: "Disfraz Superhéroe Niño",
    description: "Disfraz de superhéroe para niños de 4 a 8 años, incluye capa y máscara.",
    price: 4800,
    category: "disfraces",
    image: "https://placehold.co/400x300?text=Superhero+costume+children+4-8+years+cape+mask+colorful",
    imageAlt: "Disfraz de superhéroe para niños de 4 a 8 años con capa y máscara incluidas",
    featured: true,
  },
  {
    id: "dis-002",
    name: "Disfraz Princesa Infantil",
    description: "Hermoso vestido de princesa para nenas de 3 a 6 años, color rosa y lila.",
    price: 5500,
    category: "disfraces",
    image: "https://placehold.co/400x300?text=Princess+costume+dress+girl+pink+purple+sparkly+tiara+wand",
    imageAlt: "Vestido de princesa rosa y lila para nenas de 3 a 6 años con tiara y varita",
    badge: "Nuevo",
    badgeColor: "oklch(0.62 0.18 145)",
  },
  {
    id: "dis-003",
    name: "Kit Disfraz Adulto Carnaval",
    description: "Kit completo de carnaval para adulto: peluca, anteojos, nariz y accesorios.",
    price: 3200,
    category: "disfraces",
    image: "https://placehold.co/400x300?text=Adult+carnival+costume+kit+wig+glasses+nose+accessories+colorful",
    imageAlt: "Kit completo de disfraz de carnaval para adultos con peluca, anteojos y accesorios",
  },
  // Decoración
  {
    id: "dec-001",
    name: "Banner Happy Birthday",
    description: "Guirnalda tipo banner con letras \"Happy Birthday\", dorado y metálico.",
    price: 1100,
    category: "decoracion",
    image: "https://placehold.co/400x300?text=Happy+Birthday+banner+gold+metallic+garland+party+decoration",
    imageAlt: "Guirnalda banner Happy Birthday en letras doradas metálicas",
    badge: "Más vendido",
    badgeColor: "oklch(0.6 0.22 5)",
    featured: true,
  },
  {
    id: "dec-002",
    name: "Cortina Flecos Metálica",
    description: "Cortina de flecos metálicos para fondo de fotos y decoración. 90x200cm.",
    price: 2200,
    category: "decoracion",
    image: "https://placehold.co/400x300?text=Metallic+fringe+curtain+photo+backdrop+party+90x200cm+shiny",
    imageAlt: "Cortina de flecos metálicos para fondo de fotos de 90x200cm",
  },
  {
    id: "dec-003",
    name: "Centros de Mesa x6",
    description: "Set de 6 centros de mesa de cartón brillante, diseños variados para fiestas.",
    price: 1800,
    category: "decoracion",
    image: "https://placehold.co/400x300?text=Table+centerpieces+set+6+units+bright+cardboard+party+decorations",
    imageAlt: "Set de 6 centros de mesa de cartón brillante con diseños variados para fiestas",
  },
  // Cumpleaños
  {
    id: "cum-001",
    name: "Velas de Cumpleaños x10",
    description: "Velas de colores para torta de cumpleaños, 10 unidades con portavelas.",
    price: 450,
    category: "cumpleanos",
    image: "https://placehold.co/400x300?text=Birthday+candles+10+units+colorful+cake+candles+holder+celebration",
    imageAlt: "Pack de 10 velas de colores para torta de cumpleaños con portavelas incluidos",
    badge: "Oferta",
    badgeColor: "oklch(0.72 0.2 50)",
  },
  {
    id: "cum-002",
    name: "Platos y Vasos Temáticos x10",
    description: "Set de 10 platos y 10 vasos descartables con diseños de fiesta coloridos.",
    price: 1400,
    category: "cumpleanos",
    image: "https://placehold.co/400x300?text=Birthday+party+plates+cups+set+10+units+colorful+festive+designs",
    imageAlt: "Set de 10 platos y 10 vasos descartables con diseños de fiesta coloridos",
    featured: true,
  },
  {
    id: "cum-003",
    name: "Mantel Descartable Festivo",
    description: "Mantel plástico decorado con motivos de cumpleaños, 180x120cm.",
    price: 900,
    category: "cumpleanos",
    image: "https://placehold.co/400x300?text=Festive+disposable+tablecloth+birthday+180x120cm+colorful+plastic",
    imageAlt: "Mantel plástico descartable con motivos de cumpleaños de 180x120cm",
  },
  // Escolar
  {
    id: "esc-001",
    name: "Kit Egresados Completo",
    description: "Kit de cotillón para egresados: vincha, medalla, banda y accesorios de festejo.",
    price: 6800,
    category: "cotillon-escolar",
    image: "https://placehold.co/400x300?text=Graduation+party+kit+headband+medal+sash+accessories+celebration",
    imageAlt: "Kit completo de cotillón para egresados con vincha, medalla, banda y accesorios",
    badge: "Nuevo",
    badgeColor: "oklch(0.62 0.18 145)",
    featured: true,
  },
  {
    id: "esc-002",
    name: "Banda de Egresado",
    description: "Banda tricolor de egresado personalizable, material de tela satinada.",
    price: 1200,
    category: "cotillon-escolar",
    image: "https://placehold.co/400x300?text=Graduation+sash+tricolor+fabric+satin+personalized+school+ceremony",
    imageAlt: "Banda tricolor de egresado en tela satinada personalizable para ceremonia escolar",
  },
  // Fuegos Artificiales
  {
    id: "fue-001",
    name: "Candelitas x10",
    description: "Pack de 10 candelitas de cumpleaños con efecto chispeante, duración 45 segundos. Ideales para tortas.",
    price: 1500,
    category: "fuegos-artificiales",
    image: "https://placehold.co/400x300?text=Birthday+sparkler+candles+10+units+cake+sparkling+effect+celebration",
    imageAlt: "Pack de 10 candelitas chispeantes para tortas de cumpleaños",
    badge: "Más vendido",
    badgeColor: "oklch(0.65 0.18 35)",
    featured: true,
  },
  {
    id: "fue-002",
    name: "Bengalas x5",
    description: "Bengalas de mano de 30cm, 5 unidades. Perfectas para festejos, egresados y casamientos.",
    price: 2200,
    category: "fuegos-artificiales",
    image: "https://placehold.co/400x300?text=Hand+sparklers+30cm+5+units+wedding+graduation+celebration+sparks",
    imageAlt: "Pack de 5 bengalas de mano de 30cm para festejos y celebraciones",
    badge: "Nuevo",
    badgeColor: "oklch(0.62 0.18 145)",
  },
  {
    id: "fue-003",
    name: "Fuente de Colores",
    description: "Fuente pirotécnica de colores, efecto lluvia de chispas de 60 segundos. Uso exterior.",
    price: 3800,
    category: "fuegos-artificiales",
    image: "https://placehold.co/400x300?text=Color+fountain+firework+sparks+rain+effect+outdoor+celebration+60sec",
    imageAlt: "Fuente pirotécnica de colores con efecto lluvia de chispas de 60 segundos para exteriores",
  },
  {
    id: "fue-004",
    name: "Trompo Giratorio",
    description: "Trompo pirotécnico con efecto giratorio y colores, duración 30 segundos. Uso exterior.",
    price: 2900,
    category: "fuegos-artificiales",
    image: "https://placehold.co/400x300?text=Spinning+ground+firework+colorful+rotating+effect+outdoor+30sec",
    imageAlt: "Trompo pirotécnico giratorio con efecto de colores para uso exterior",
  },
  {
    id: "fue-005",
    name: "Voladores x6",
    description: "Pack de 6 voladores con efecto de destellos de colores. Uso exterior en espacios abiertos.",
    price: 3500,
    category: "fuegos-artificiales",
    image: "https://placehold.co/400x300?text=Skyrocket+fireworks+pack+6+units+colorful+flashes+outdoor+open+space",
    imageAlt: "Pack de 6 voladores con destellos de colores para espacios abiertos",
    badge: "Oferta",
    badgeColor: "oklch(0.72 0.2 50)",
  },
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
