/**
 * Catalogue de démonstration Paralelo 8 Norte.
 *
 * Rédigé en espagnol du Venezuela, tutoiement, sans emoji. Chaque pièce porte
 * son encart « la referencia » : un détail vérifiable, puis une adresse au
 * lecteur — c'est la forme éditoriale que fixe le design system.
 *
 * Aucun produit n'a d'image : la marque n'a fourni aucune photo, et l'interface
 * retombe partout sur la réserve #E9F0F4 légendée. Les mockups Printful les
 * remplaceront.
 */

export type SeedCategory = 'accesorios' | 'posters-deco' | 'textil'

export type SeedUniverse = 'aventura' | 'cultura' | 'naturaleza' | 'origen'

export type SeedProduct = {
  category: SeedCategory
  /** Slugs d'options couleur. Sa présence fait du produit un produit à variantes. */
  colors?: string[]
  composition: string
  description: string
  /** Stock des produits sans variantes. */
  inventory?: number
  /** Tailles en rupture, pour voir l'état désactivé des chips. */
  outOfStock?: string[]
  /** En centimes. */
  price: number
  reference: string
  sizes?: string[]
  slug: string
  title: string
  universe: SeedUniverse
}

export const SIZES = [
  { label: 'XS', value: 'xs' },
  { label: 'S', value: 's' },
  { label: 'M', value: 'm' },
  { label: 'L', value: 'l' },
  { label: 'XL', value: 'xl' },
  { label: 'XXL', value: 'xxl' },
]

/**
 * Les slugs doivent rester ceux de `src/components/p8/colorHex.ts` : c'est lui
 * qui donne aux pastilles leur couleur.
 */
export const COLORS = [
  { label: 'Azul profundo', value: 'azul-profundo' },
  { label: 'Blanco', value: 'blanco' },
  { label: 'Celeste', value: 'celeste' },
  { label: 'Negro', value: 'negro' },
  { label: 'Dorado', value: 'dorado' },
]

const ALL_SIZES = SIZES.map((size) => size.value)

export const CATEGORIES: { slug: SeedCategory; title: string }[] = [
  { slug: 'textil', title: 'Textil' },
  { slug: 'accesorios', title: 'Accesorios' },
  { slug: 'posters-deco', title: 'Pósters & deco' },
]

export const PRODUCTS: SeedProduct[] = [
  {
    category: 'textil',
    colors: ['azul-profundo', 'negro'],
    composition:
      '80% algodón, 20% poliéster. Lava del revés a 30°. Nada de secadora y no planches encima de la impresión.',
    description:
      'Corte oversize, capucha forrada y el perfil del Ávila impreso delante; las coordenadas 8°N en la espalda. Impresión frente y dorso.',
    outOfStock: ['xxl'],
    price: 4500,
    reference:
      '2765 son los metros del Pico Naiguatá, el punto más alto del Ávila. Si alguna vez subiste a Sabas Nieves un domingo, este hoodie es tuyo.',
    sizes: ALL_SIZES,
    slug: 'hoodie-avila-2765',
    title: 'Hoodie Ávila 2765',
    universe: 'naturaleza',
  },
  {
    category: 'textil',
    colors: ['blanco', 'negro'],
    composition: '100% algodón peinado. Lava del revés a 30°.',
    description:
      'Camiseta de corte recto con la frase impresa en el pecho en tipografía condensada. Unisex.',
    price: 2900,
    reference:
      '«No joda» no se traduce: se siente. Es sorpresa, molestia y cariño en dos palabras, según cómo lo digas.',
    sizes: ALL_SIZES,
    slug: 'camiseta-no-joda',
    title: 'Camiseta No joda',
    universe: 'cultura',
  },
  {
    category: 'accesorios',
    composition: '100% algodón. Limpia a mano.',
    description:
      'Gorra de seis paneles, visera curva y cierre metálico ajustable. Bordado frontal.',
    inventory: 40,
    price: 2500,
    reference:
      '8° norte es la latitud que cruza Venezuela de punta a punta. La llevas puesta sin tener que explicarla.',
    slug: 'gorra-8-norte',
    title: 'Gorra 8°N',
    universe: 'origen',
  },
  {
    category: 'accesorios',
    composition: '100% algodón, 220 g/m². Lava a 30°.',
    description:
      'Bolso de tela con asas largas y costura reforzada. Aguanta el mercado del sábado.',
    inventory: 60,
    price: 2200,
    reference:
      'Palabra que sirve para todo: insulto, saludo y admiración. Aquí va en letras grandes y sin pedir permiso.',
    slug: 'tote-conoemadre',
    title: 'Tote Coñoemadre',
    universe: 'cultura',
  },
  {
    category: 'textil',
    colors: ['blanco', 'celeste'],
    composition: '100% algodón peinado. Lava del revés a 30°.',
    description:
      'Camiseta con el mapa de la ruta impreso a una tinta en la espalda y el logotipo pequeño delante.',
    price: 2900,
    reference:
      'La 4 es la carretera que baja a la costa entre curvas y neblina. Si te mareaste en el asiento de atrás, ya sabes de qué hablamos.',
    sizes: ALL_SIZES,
    slug: 'camiseta-ruta-4',
    title: 'Camiseta Ruta 4',
    universe: 'aventura',
  },
  {
    category: 'textil',
    colors: ['azul-profundo', 'negro'],
    composition: '80% algodón, 20% poliéster. Lava del revés a 30°.',
    description: 'Sudadera de cuello redondo, interior perchado y puños acanalados. Corte holgado.',
    price: 4900,
    reference:
      'El nombre de la marca es una coordenada, no una metáfora. Es el paralelo donde empieza todo esto.',
    sizes: ALL_SIZES,
    slug: 'sudadera-8-norte',
    title: 'Sudadera 8 Norte',
    universe: 'origen',
  },
  {
    category: 'accesorios',
    composition: 'Cerámica esmaltada. Apta para lavavajillas, no para microondas por el acabado.',
    description: 'Taza de cerámica de 330 ml con ilustración a una tinta.',
    inventory: 25,
    price: 1500,
    reference:
      'Aceitunas, pasas y la discusión anual sobre si van o no van. En diciembre eso no se negocia.',
    slug: 'mug-pan-de-jamon',
    title: 'Mug Pan de jamón',
    universe: 'cultura',
  },
  {
    category: 'posters-deco',
    composition: 'Papel mate de 200 g. Se envía enrollado en tubo.',
    description:
      'Lámina de 50 × 70 cm, impresión del perfil del Ávila a tres tintas. Se vende sin marco.',
    inventory: 30,
    price: 1800,
    reference:
      'La misma montaña que te dice hacia dónde queda el norte cuando te pierdes en Caracas.',
    slug: 'poster-avila',
    title: 'Póster Ávila',
    universe: 'naturaleza',
  },
  {
    category: 'textil',
    colors: ['blanco', 'azul-profundo'],
    composition: '100% algodón peinado. Lava del revés a 30°.',
    description: 'Camiseta con la silueta del pico impresa en el pecho y la altitud en la manga.',
    price: 2900,
    reference:
      'El pico más alto de la cordillera de la Costa. Subirlo toma un día entero; ponerte la camiseta, dos segundos.',
    sizes: ALL_SIZES,
    slug: 'camiseta-naiguata',
    title: 'Camiseta Naiguatá',
    universe: 'naturaleza',
  },
  {
    category: 'accesorios',
    composition: '100% algodón. Limpia a mano.',
    description: 'Gorra de cinco paneles, visera plana y correa textil. Bordado lateral.',
    inventory: 35,
    price: 2500,
    reference:
      'Sabas Nieves es donde empieza la subida y donde todo el mundo se detiene a recuperar el aire.',
    slug: 'gorra-sabas',
    title: 'Gorra Sabas',
    universe: 'naturaleza',
  },
  {
    category: 'accesorios',
    composition: '100% algodón, 220 g/m². Lava a 30°.',
    description: 'Bolso de tela con el perfil de la cordillera serigrafiado a lo ancho.',
    inventory: 45,
    price: 2200,
    reference:
      'La cordillera de la Costa corre pegada al mar durante seiscientos kilómetros. Es la línea que ves al fondo de cualquier foto.',
    slug: 'tote-cordillera',
    title: 'Tote Cordillera',
    universe: 'naturaleza',
  },
  {
    category: 'textil',
    colors: ['celeste', 'blanco'],
    composition: '100% algodón peinado. Lava del revés a 30°.',
    description: 'Camiseta con una ilustración de la bahía impresa a dos tintas en la espalda.',
    price: 2900,
    reference:
      'A Choroní se llega después de la montaña, y siempre vale la pena. El agua está fría los primeros diez segundos.',
    sizes: ALL_SIZES,
    slug: 'camiseta-playa-grande',
    title: 'Camiseta Playa Grande',
    universe: 'aventura',
  },
  {
    category: 'posters-deco',
    composition: 'Papel mate de 200 g. Se envía enrollado en tubo.',
    description:
      'Lámina de 50 × 70 cm con las coordenadas compuestas en tipografía de gran tamaño.',
    // Volontairement en rupture : c'est l'exemplaire qui montre l'état « agotado ».
    inventory: 0,
    price: 1800,
    reference: '8°00′N 66°00′O. Si las buscas en un mapa, caes justo en el medio del país.',
    slug: 'poster-coordenadas',
    title: 'Póster Coordenadas',
    universe: 'origen',
  },
  {
    category: 'accesorios',
    composition: '65% poliéster, 35% algodón. Limpia a mano.',
    description: 'Gorra de seis paneles en tejido técnico, visera curva y cierre de hebilla.',
    inventory: 20,
    price: 2500,
    reference:
      'El tepuy más famoso de la Gran Sabana: seis días de caminata y una meseta que parece otro planeta.',
    slug: 'gorra-roraima',
    title: 'Gorra Roraima',
    universe: 'aventura',
  },
]
