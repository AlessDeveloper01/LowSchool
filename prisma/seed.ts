// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma-20260804010000/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Helper para no repetir el create+link cada vez
async function linkVariantGroup(productoId: string, grupoVarianteId: string) {
  return prisma.productoGrupoVariante.create({
    data: { productoId, grupoVarianteId },
  });
}
async function linkExtraGroup(productoId: string, grupoExtraId: string) {
  return prisma.productoGrupoExtra.create({
    data: { productoId, grupoExtraId },
  });
}

async function main() {
  // ---------- CATEGORÍAS ----------

  await prisma.productoGrupoVariante.deleteMany();
  await prisma.productoGrupoExtra.deleteMany();
  await prisma.variante.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.grupoVariante.deleteMany();
  await prisma.grupoExtra.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();

  const catBebidas = await prisma.categoria.create({
    data: { nombre: "Bebidas" },
  });
  const catMicheladas = await prisma.categoria.create({
    data: { nombre: "Micheladas" },
  });
  const catCocteleria = await prisma.categoria.create({
    data: { nombre: "Coctelería" },
  });
  const catCervezas = await prisma.categoria.create({
    data: { nombre: "Cervezas" },
  });
  const catLicores = await prisma.categoria.create({
    data: { nombre: "Copas de Licor" },
  });
  const catMezcal = await prisma.categoria.create({
    data: { nombre: "Mezcal de la Casa" },
  });
  const catAntojitos = await prisma.categoria.create({
    data: { nombre: "Antojitos Oaxaqueños" },
  });
  const catDesayunos = await prisma.categoria.create({
    data: { nombre: "Desayunos en Paquetes" },
  });
  const catOmelets = await prisma.categoria.create({
    data: { nombre: "Omelets" },
  });
  const catDeLaCasa = await prisma.categoria.create({
    data: { nombre: "De la Casa" },
  });
  const catRegion = await prisma.categoria.create({
    data: { nombre: "Comida de la Región" },
  });
  const catTlayudas = await prisma.categoria.create({
    data: { nombre: "Tlayudas" },
  });
  const catParrilla = await prisma.categoria.create({
    data: { nombre: "De la Parrilla" },
  });
  const catComidaMar = await prisma.categoria.create({
    data: { nombre: "Comida del Mar" },
  });
  const catCocteles = await prisma.categoria.create({
    data: { nombre: "Cocteles" },
  });
  const catEnsaladas = await prisma.categoria.create({
    data: { nombre: "Ensaladas" },
  });
  const catCaldos = await prisma.categoria.create({
    data: { nombre: "Caldos" },
  });
  const catPastas = await prisma.categoria.create({
    data: { nombre: "Pastas" },
  });
  const catCamarones = await prisma.categoria.create({
    data: { nombre: "Camarones" },
  });
  const catPulpo = await prisma.categoria.create({ data: { nombre: "Pulpo" } });
  const catMojarras = await prisma.categoria.create({
    data: { nombre: "Mojarras" },
  });
  const catFiletes = await prisma.categoria.create({
    data: { nombre: "Filetes" },
  });
  const catEspecialidades = await prisma.categoria.create({
    data: { nombre: "Especialidades" },
  });
  const catPostres = await prisma.categoria.create({
    data: { nombre: "Postres" },
  });
  const catInfantil = await prisma.categoria.create({
    data: { nombre: "Menú Infantil" },
  });

  // ---------- GRUPO DE EXTRAS (reutilizable) ----------
  const grupoGuarniciones = await prisma.grupoExtra.create({
    data: {
      nombre: "Guarniciones",
      minimo: 0,
      maximo: null,
      obligatorio: false,
      extras: {
        create: [
          { nombre: "Tortillas", precio: 25 },
          { nombre: "Totopos", precio: 25 },
          { nombre: "Guacamole", precio: 50 },
          { nombre: "Cebollitas", precio: 50 },
          { nombre: "Nopalitos", precio: 50 },
          { nombre: "Chiles de agua", precio: 50 },
        ],
      },
    },
  });

  // =========================================================
  // GRUPOS DE VARIANTES — todos en modo SUMA (precio = delta)
  // =========================================================

  // Cerveza dentro de michelada: delta consistente de +10 en las 7 variedades
  const grupoCervezaMichelada = await prisma.grupoVariante.create({
    data: {
      nombre: "Cerveza (Michelada)",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Corona", precio: 0, predeterminado: true },
          { nombre: "Victoria", precio: 0 },
          { nombre: "Negra Modelo", precio: 10 },
          { nombre: "Modelo Cristal", precio: 10 },
          { nombre: "Pacífico", precio: 10 },
        ],
      },
    },
  });

  const grupoSaborMichelada = await prisma.grupoVariante.create({
    data: {
      nombre: "Sabor de Michelada",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Tradicional", precio: 0, predeterminado: true },
          { nombre: "Suero", precio: 0 },
          { nombre: "Cubana", precio: 5 },
          { nombre: "Mango", precio: 5 },
          { nombre: "Maracuyá", precio: 5 },
          { nombre: "Tamarindo", precio: 5 },
          { nombre: "Clamato", precio: 5 },
        ],
      },
    },
  });

  // Cerveza como bebida individual: delta +5
  const grupoTipoCerveza = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo de Cerveza",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Corona", precio: 0, predeterminado: true },
          { nombre: "Victoria", precio: 0 },
          { nombre: "Negra Modelo", precio: 5 },
          { nombre: "Modelo Cristal", precio: 5 },
          { nombre: "Pacífico", precio: 5 },
        ],
      },
    },
  });

  // Carne de tlayuda: Tasajo/Cecina/Chorizo mismo precio, Combinada +15
  const grupoCarneTlayuda = await prisma.grupoVariante.create({
    data: {
      nombre: "Carne Tlayuda",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Tasajo", precio: 0, predeterminado: true },
          { nombre: "Cecina", precio: 0 },
          { nombre: "Chorizo", precio: 0 },
          { nombre: "Combinada", precio: 15 },
        ],
      },
    },
  });

  // Costalitos: Pulpo/Camarón mismo precio
  const grupoProteinaCostalitos = await prisma.grupoVariante.create({
    data: {
      nombre: "Proteína Costalitos",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Pulpo", precio: 0, predeterminado: true },
          { nombre: "Camarón", precio: 0 },
        ],
      },
    },
  });

  // Tostadas: Camarón/Pulpo/Ceviche mismo precio, Aguachile +20, Combinada +10
  const grupoProteinaTostada = await prisma.grupoVariante.create({
    data: {
      nombre: "Proteína Tostada",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Camarón", precio: 0, predeterminado: true },
          { nombre: "Pulpo", precio: 0 },
          { nombre: "Ceviche", precio: 0 },
          { nombre: "Aguachile", precio: 20 },
          { nombre: "Combinada", precio: 10 },
        ],
      },
    },
  });

  // Aguachile de camarón: Verde/Negro mismo precio
  const grupoColorAguachile = await prisma.grupoVariante.create({
    data: {
      nombre: "Color Aguachile",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Verde", precio: 0, predeterminado: true },
          { nombre: "Negro", precio: 0 },
        ],
      },
    },
  });

  // Ensalada: Camarón/Pulpo mismo precio, Combinada +10
  const grupoProteinaEnsalada = await prisma.grupoVariante.create({
    data: {
      nombre: "Proteína Ensalada",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Camarón", precio: 0, predeterminado: true },
          { nombre: "Pulpo", precio: 0 },
          { nombre: "Combinada", precio: 10 },
        ],
      },
    },
  });

  // Preparación Camarones: base 190 (Al ajo / Mantequilla), +10 chipotle/diabla/ajillo, +20 empanizados
  const grupoPrepCamarones = await prisma.grupoVariante.create({
    data: {
      nombre: "Preparación Camarones",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Al ajo", precio: 0, predeterminado: true },
          { nombre: "A la mantequilla", precio: 0 },
          { nombre: "Al chipotle", precio: 10 },
          { nombre: "A la diabla", precio: 10 },
          { nombre: "Al ajillo", precio: 10 },
          { nombre: "Empanizados", precio: 20 },
        ],
      },
    },
  });

  // Preparación Pulpo: base 190, +5 el resto
  const grupoPrepPulpo = await prisma.grupoVariante.create({
    data: {
      nombre: "Preparación Pulpo",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Al ajo", precio: 0, predeterminado: true },
          { nombre: "Al chipotle", precio: 5 },
          { nombre: "A la diabla", precio: 5 },
          { nombre: "Al ajillo", precio: 5 },
        ],
      },
    },
  });

  // Preparación Mojarra: base 205, +5 el resto
  const grupoPrepMojarra = await prisma.grupoVariante.create({
    data: {
      nombre: "Preparación Mojarra (700g)",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Al ajo - Frita", precio: 0, predeterminado: true },
          { nombre: "Al chipotle", precio: 5 },
          { nombre: "A la diabla", precio: 5 },
          { nombre: "Al ajillo", precio: 5 },
          { nombre: "A la mexicana", precio: 5 },
        ],
      },
    },
  });

  // Preparación Filete: base 160 (Ajo / Plancha), +10 empanizado, +15 chipotle/diabla, +20 mexicana
  const grupoPrepFilete = await prisma.grupoVariante.create({
    data: {
      nombre: "Preparación Filete",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Al ajo", precio: 0, predeterminado: true },
          { nombre: "A la plancha", precio: 0 },
          { nombre: "Empanizado", precio: 10 },
          { nombre: "Al chipotle", precio: 15 },
          { nombre: "A la diabla", precio: 15 },
          { nombre: "A la mexicana", precio: 20 },
        ],
      },
    },
  });

  // Tamaño de coctel: aquí sí se queda REEMPLAZA porque cada tamaño es un total distinto,
  // no un "extra" sobre el chico.
  const grupoTipoCoctel = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo de Coctel",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Ostión", precio: 0, predeterminado: true },
          { nombre: "Pulpo", precio: 0 },
          { nombre: "Camarón", precio: 0 },
          { nombre: "Ceviche de Pescado", precio: 0 },
          { nombre: "Vuelve a la Vida", precio: 0 },
          { nombre: "Campechado", precio: 0 },
        ],
      },
    },
  });

  const grupoTamanoCoctel = await prisma.grupoVariante.create({
    data: {
      nombre: "Tamaño Coctel",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Chico", precio: 95, predeterminado: true },
          { nombre: "Mediano", precio: 150 },
          { nombre: "Grande", precio: 195 },
        ],
      },
    },
  });

  // Relleno para desayunos en paquete (delta 0, mismo precio sin importar carne)
  const grupoRelleno = await prisma.grupoVariante.create({
    data: {
      nombre: "Relleno (Tasajo/Cecina/Chorizo)",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Tasajo", precio: 0, predeterminado: true },
          { nombre: "Cecina", precio: 0 },
          { nombre: "Chorizo", precio: 0 },
        ],
      },
    },
  });

  // Huevos al gusto (delta 0)
  const grupoHuevosGusto = await prisma.grupoVariante.create({
    data: {
      nombre: "Huevos al Gusto",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Mexicana", precio: 0, predeterminado: true },
          { nombre: "Chorizo", precio: 0 },
          { nombre: "Jamón", precio: 0 },
          { nombre: "Salchicha", precio: 0 },
        ],
      },
    },
  });

  // ---------- BEBIDAS ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Soda Italiana (frutos rojos, manzana, violeta, mora azul)",
        precioBase: 70,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Vaso de Naranjada o Limonada",
        precioBase: 40,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Jarra de Naranjada o Limonada",
        precioBase: 150,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Jarra de Agua de Horchata",
        precioBase: 150,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Jarra de Agua de Sabor",
        precioBase: 135,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Vaso de Agua de Sabor",
        precioBase: 35,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Vaso de Horchata",
        precioBase: 40,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Refresco (Pepsi, Manzanita, Piña, Mineral)",
        precioBase: 35,
        categoriaId: catBebidas.id,
      },
      { nombre: "Coca Cola", precioBase: 45, categoriaId: catBebidas.id },
      {
        nombre: "Agua Chica (600 ml)",
        precioBase: 20,
        categoriaId: catBebidas.id,
      },
      { nombre: "Jugo Verde", precioBase: 50, categoriaId: catBebidas.id },
      { nombre: "Jugo de Naranja", precioBase: 55, categoriaId: catBebidas.id },
      {
        nombre: "Malteada de Fresa",
        precioBase: 75,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Frappé de Oreo / Chokis",
        precioBase: 75,
        categoriaId: catBebidas.id,
      },
      { nombre: "Café Americano", precioBase: 50, categoriaId: catBebidas.id },
      { nombre: "Café de Olla", precioBase: 35, categoriaId: catBebidas.id },
      {
        nombre: "Chocolate de Agua",
        precioBase: 40,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Chocolate de Leche",
        precioBase: 50,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Chocolate de Leche Deslactosada",
        precioBase: 55,
        categoriaId: catBebidas.id,
      },
      {
        nombre: "Té (Poleo, Canela, Hierbabuena)",
        precioBase: 40,
        categoriaId: catBebidas.id,
      },
    ],
  });

  // ---------- MICHELADAS: 1 producto por sabor, cerveza como variante SUMA ----------
  const michelada = await prisma.producto.create({
    data: {
      nombre: "Michelada",
      precioBase: 65,
      modoPrecio: "SUMA",
      categoriaId: catMicheladas.id,
    },
  });
  await linkVariantGroup(michelada.id, grupoSaborMichelada.id);
  await linkVariantGroup(michelada.id, grupoCervezaMichelada.id);

  // ---------- CERVEZA (bebida individual) ----------
  const cerveza = await prisma.producto.create({
    data: {
      nombre: "Cerveza",
      precioBase: 38,
      modoPrecio: "SUMA",
      categoriaId: catCervezas.id,
    },
  });
  await linkVariantGroup(cerveza.id, grupoTipoCerveza.id);

  // ---------- COCTELERÍA ----------
  // ================= COCTELERÍA: variantes de sabor =================
  const grupoSaborMargarita = await prisma.grupoVariante.create({
    data: {
      nombre: "Sabor Margarita",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Clásica", precio: 0, predeterminado: true },
          { nombre: "Frutos Rojos", precio: 10 },
          { nombre: "Maracuyá", precio: 10 },
        ],
      },
    },
  });
  const margarita = await prisma.producto.create({
    data: {
      nombre: "Margarita",
      precioBase: 100,
      modoPrecio: "SUMA",
      categoriaId: catCocteleria.id,
    },
  });
  await linkVariantGroup(margarita.id, grupoSaborMargarita.id);

  const grupoSaborMezcalina = await prisma.grupoVariante.create({
    data: {
      nombre: "Sabor Mezcalina",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Frutos Rojos", precio: 0, predeterminado: true },
          { nombre: "Maracuyá", precio: 0 },
        ],
      },
    },
  });
  const mezcalina = await prisma.producto.create({
    data: {
      nombre: "Mezcalina",
      precioBase: 110,
      modoPrecio: "SUMA",
      categoriaId: catCocteleria.id,
    },
  });
  await linkVariantGroup(mezcalina.id, grupoSaborMezcalina.id);

  const grupoTipoJarrito = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo Jarrito",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Oaxaqueño", precio: 0, predeterminado: true },
          { nombre: "Loco", precio: 0 },
        ],
      },
    },
  });
  const jarrito = await prisma.producto.create({
    data: {
      nombre: "Jarrito",
      precioBase: 110,
      modoPrecio: "SUMA",
      categoriaId: catCocteleria.id,
    },
  });
  await linkVariantGroup(jarrito.id, grupoTipoJarrito.id);

  const grupoTipoMojito = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo Mojito",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Cubano", precio: 0, predeterminado: true },
          { nombre: "Oaxaqueño", precio: 0 },
        ],
      },
    },
  });
  const mojito = await prisma.producto.create({
    data: {
      nombre: "Mojito",
      precioBase: 100,
      modoPrecio: "SUMA",
      categoriaId: catCocteleria.id,
    },
  });
  await linkVariantGroup(mojito.id, grupoTipoMojito.id);

  const grupoTipoGinTonic = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo Gin Tonic",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Frutos Rojos", precio: 0, predeterminado: true },
          { nombre: "Blue", precio: 0 },
        ],
      },
    },
  });
  const ginTonic = await prisma.producto.create({
    data: {
      nombre: "Gin Tonic",
      precioBase: 100,
      modoPrecio: "SUMA",
      categoriaId: catCocteleria.id,
    },
  });
  await linkVariantGroup(ginTonic.id, grupoTipoGinTonic.id);

  // Únicos, sin variante de sabor
  await prisma.producto.createMany({
    data: [
      { nombre: "Piña Colada", precioBase: 110, categoriaId: catCocteleria.id },
      {
        nombre: "Media de Seda",
        precioBase: 110,
        categoriaId: catCocteleria.id,
      },
      {
        nombre: "Conga (Fruta Natural)",
        precioBase: 100,
        categoriaId: catCocteleria.id,
      },
      {
        nombre: "Sex on the Beach",
        precioBase: 100,
        categoriaId: catCocteleria.id,
      },
    ],
  });

  // ---------- COPAS DE LICOR ----------
  const grupoMarcaVodka = await prisma.grupoVariante.create({
    data: {
      nombre: "Marca Vodka",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Oso Negro", precio: 0, predeterminado: true },
          { nombre: "Absolut Azul", precio: 15 },
          { nombre: "Smirnoff", precio: 15 },
        ],
      },
    },
  });
  const vodka = await prisma.producto.create({
    data: {
      nombre: "Vodka",
      precioBase: 60,
      modoPrecio: "SUMA",
      categoriaId: catLicores.id,
    },
  });
  await linkVariantGroup(vodka.id, grupoMarcaVodka.id);

  const grupoMarcaWhisky = await prisma.grupoVariante.create({
    data: {
      nombre: "Marca Whisky",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Etiqueta Roja", precio: 0, predeterminado: true },
          { nombre: "Buchanas 12 Años", precio: 35 },
          { nombre: "Etiqueta Negra", precio: 45 },
        ],
      },
    },
  });
  const whisky = await prisma.producto.create({
    data: {
      nombre: "Whisky",
      precioBase: 85,
      modoPrecio: "SUMA",
      categoriaId: catLicores.id,
    },
  });
  await linkVariantGroup(whisky.id, grupoMarcaWhisky.id);

  const grupoMarcaTequila = await prisma.grupoVariante.create({
    data: {
      nombre: "Marca Tequila",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Cabrito", precio: 0, predeterminado: true },
          { nombre: "Don Julio Reposado", precio: 40 },
        ],
      },
    },
  });
  const tequila = await prisma.producto.create({
    data: {
      nombre: "Tequila",
      precioBase: 70,
      modoPrecio: "SUMA",
      categoriaId: catLicores.id,
    },
  });
  await linkVariantGroup(tequila.id, grupoMarcaTequila.id);

  const grupoMarcaBrandy = await prisma.grupoVariante.create({
    data: {
      nombre: "Marca Brandy",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Azteca de Oro", precio: 0, predeterminado: true },
          { nombre: "Torres 10", precio: 15 },
        ],
      },
    },
  });
  const brandy = await prisma.producto.create({
    data: {
      nombre: "Brandy",
      precioBase: 65,
      modoPrecio: "SUMA",
      categoriaId: catLicores.id,
    },
  });
  await linkVariantGroup(brandy.id, grupoMarcaBrandy.id);

  const grupoTipoDigestivo = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo Digestivo",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Anís Dulce", precio: 0, predeterminado: true },
          { nombre: "Anís Seco", precio: 0 },
          { nombre: "Copa de Menta", precio: 0 },
          { nombre: "Kahlúa", precio: 0 },
          { nombre: "Sambuca", precio: 0 },
          { nombre: "Licor 43", precio: 10 },
        ],
      },
    },
  });
  const digestivo = await prisma.producto.create({
    data: {
      nombre: "Digestivo / Aperitivo",
      precioBase: 70,
      modoPrecio: "SUMA",
      categoriaId: catLicores.id,
    },
  });
  await linkVariantGroup(digestivo.id, grupoTipoDigestivo.id);

  // Individuales: bebidas distintas entre sí, no variantes de una misma
  await prisma.producto.createMany({
    data: [
      { nombre: "Bacardí Blanco", precioBase: 80, categoriaId: catLicores.id },
      { nombre: "Clericot", precioBase: 100, categoriaId: catLicores.id },
      { nombre: "Desarmador", precioBase: 100, categoriaId: catLicores.id },
      { nombre: "Paloma", precioBase: 100, categoriaId: catLicores.id },
      { nombre: "Charro Negro", precioBase: 100, categoriaId: catLicores.id },
      { nombre: "Sangría", precioBase: 100, categoriaId: catLicores.id },
      { nombre: "Azulito", precioBase: 100, categoriaId: catLicores.id },
      {
        nombre: "Fondo de Bikini",
        precioBase: 100,
        categoriaId: catLicores.id,
      },
      { nombre: "Acuario", precioBase: 100, categoriaId: catLicores.id },
      { nombre: "Mangoneada", precioBase: 100, categoriaId: catLicores.id },
      {
        nombre: "Lambrusco (Botella)",
        precioBase: 450,
        categoriaId: catLicores.id,
      },
    ],
  });

  // ---------- MEZCAL DE LA CASA (Toromocho) ----------
  const grupoTipoMezcal = await prisma.grupoVariante.create({
    data: {
      nombre: "Tipo Mezcal",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Espadín", precio: 0, predeterminado: true },
          { nombre: "De Poleo", precio: 5 },
          { nombre: "De Cedrón", precio: 5 },
          { nombre: "Tobalá", precio: 5 },
          { nombre: "Reposado", precio: 5 },
          { nombre: "Pechuga", precio: 5 },
          { nombre: "Añejo", precio: 5 },
          { nombre: "Gusano", precio: 5 },
          { nombre: "Flor de Rosita", precio: 15 },
        ],
      },
    },
  });
  const mezcal = await prisma.producto.create({
    data: {
      nombre: "Mezcal de la Casa (Toromocho)",
      precioBase: 45,
      modoPrecio: "SUMA",
      categoriaId: catMezcal.id,
    },
  });
  await linkVariantGroup(mezcal.id, grupoTipoMezcal.id);

  // ================= ANTOJITOS: Empanadas =================
  const grupoRellenoEmpanada = await prisma.grupoVariante.create({
    data: {
      nombre: "Relleno de Empanada",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Flor de Calabaza", precio: 0, predeterminado: true },
          { nombre: "Champiñón", precio: 0 },
          { nombre: "Verde", precio: 0 },
          { nombre: "Amarillo", precio: 0 },
          { nombre: "Epazote", precio: 0 },
          { nombre: "Choriqueso", precio: 20 },
          { nombre: "Chapulines y Quesillo", precio: 30 },
        ],
      },
    },
  });
  const empanada = await prisma.producto.create({
    data: {
      nombre: "Empanada",
      precioBase: 70,
      modoPrecio: "SUMA",
      categoriaId: catAntojitos.id,
    },
  });
  await linkVariantGroup(empanada.id, grupoRellenoEmpanada.id);

  // ================= ANTOJITOS: Memelitas (4) =================
  const grupoRellenoMemelita = await prisma.grupoVariante.create({
    data: {
      nombre: "Relleno Memelitas",
      obligatorio: true,
      variantes: {
        create: [
          { nombre: "Queso", precio: 0, predeterminado: true },
          { nombre: "Quesillo", precio: 5 },
          { nombre: "Carne y Quesillo (Tasajo/Cecina/Chorizo)", precio: 20 },
        ],
      },
    },
  });
  const memelitas = await prisma.producto.create({
    data: {
      nombre: "Memelitas (4)",
      precioBase: 80,
      modoPrecio: "SUMA",
      categoriaId: catAntojitos.id,
    },
  });
  await linkVariantGroup(memelitas.id, grupoRellenoMemelita.id);

  // ---------- DE LA CASA ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Omelet Oaxaqueño",
        descripcion: "Flor de calabaza, chapulines y quesillo",
        precioBase: 150,
        categoriaId: catDeLaCasa.id,
      },
      {
        nombre: "Omelet La Perla",
        descripcion: "Pollo y Mole",
        precioBase: 150,
        categoriaId: catDeLaCasa.id,
      },
      {
        nombre: "Cazuela Oaxaqueña",
        descripcion: "3 carnes en salsa morita",
        precioBase: 150,
        categoriaId: catDeLaCasa.id,
      },
      {
        nombre: "Huevos Divorciados",
        precioBase: 150,
        categoriaId: catDeLaCasa.id,
      },
      {
        nombre: "Enchiladas Suizas",
        descripcion: "Rellenas de pollo y gratinadas con queso manchego",
        precioBase: 150,
        categoriaId: catDeLaCasa.id,
      },
      {
        nombre: "Trilogía Oaxaqueña",
        descripcion: "3 Tacos rellenos de pollo (Suizas/Coloradito/Mole negro)",
        precioBase: 180,
        categoriaId: catDeLaCasa.id,
      },
    ],
  });

  // ---------- DESAYUNOS EN PAQUETES ----------
  const desayunosPaquete = [
    "Enchiladas de Coloradito",
    "Chilaquiles Verdes",
    "Chilaquiles Rojos",
    "Entomatadas",
  ];
  for (const nombre of desayunosPaquete) {
    const p = await prisma.producto.create({
      data: {
        nombre,
        precioBase: 150,
        categoriaId: catDesayunos.id,
        modoPrecio: "SUMA",
      },
    });
    await linkVariantGroup(p.id, grupoRelleno.id);
  }
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Tacos Enchilados (Rellenos de pollo)",
        precioBase: 150,
        categoriaId: catDesayunos.id,
      },
      {
        nombre: "Enchiladas Suizas (Rellenas de pollo)",
        precioBase: 150,
        categoriaId: catDesayunos.id,
      },
    ],
  });

  // ---------- OMELETS ----------
  const huevosGusto = await prisma.producto.create({
    data: {
      nombre: "Huevos al Gusto",
      precioBase: 150,
      categoriaId: catOmelets.id,
    },
  });
  await linkVariantGroup(huevosGusto.id, grupoHuevosGusto.id);

  await prisma.producto.createMany({
    data: [
      {
        nombre: "Omelet Vegetariano",
        precioBase: 150,
        categoriaId: catOmelets.id,
      },
      {
        nombre: "Omelet de Jamón",
        precioBase: 150,
        categoriaId: catOmelets.id,
      },
      {
        nombre: "Omelet de Quesillo",
        precioBase: 150,
        categoriaId: catOmelets.id,
      },
    ],
  });

  // ---------- COMIDA DE LA REGIÓN ----------
  await prisma.producto.createMany({
    data: [
      { nombre: "Sopa Azteca", precioBase: 80, categoriaId: catRegion.id },
      {
        nombre: "Consomé de Pollo",
        descripcion: "Arroz y verduras",
        precioBase: 80,
        categoriaId: catRegion.id,
      },
      {
        nombre: "Caldo de Pollo",
        descripcion: "Arroz y verduras",
        precioBase: 100,
        categoriaId: catRegion.id,
      },
      {
        nombre: "Canasto Oaxaqueño",
        descripcion:
          "4 Empanaditas / 4 Memelitas / Chapulines / Cecina / Chorizo / Chicharrón / Queso / Quesillo / Chiles de agua / Cebollitas / Nopalitos / Frijoles / Tortillas y Pico de gallo. Incluye 6 tortillas",
        precioBase: 360,
        categoriaId: catRegion.id,
      },
      {
        nombre: "Parrillada Oaxaqueña",
        descripcion:
          "Tasajo / Cecina / Chorizo / Queso / Quesillo / Cebollitas / Nopalitos / Chiles de agua / Ensalada verde / Frijoles y Tortillas. Incluye 6 tortillas",
        precioBase: 400,
        categoriaId: catRegion.id,
      },
    ],
  });

  // ---------- DE LA PARRILLA ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Arrachera Marinada (300g)",
        descripcion: "Incluye ensalada, guacamole y papas a la francesa",
        precioBase: 250,
        categoriaId: catParrilla.id,
      },
      {
        nombre: "Orden de Carne Asada",
        descripcion:
          "Elección: Tasajo / Cecina / Chorizo. Acompañado de chiquimemelita, frijoles y ensalada",
        precioBase: 120,
        categoriaId: catParrilla.id,
      },
    ],
  });

  // ---------- TLAYUDAS ----------
  const tlayuda = await prisma.producto.create({
    data: {
      nombre: "Tlayuda",
      precioBase: 120,
      modoPrecio: "SUMA",
      categoriaId: catTlayudas.id,
    },
  });
  await linkVariantGroup(tlayuda.id, grupoCarneTlayuda.id);

  // Se quedan separadas: son un formato distinto (más pequeño / sin carne), no una variante de proteína
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Tlayuda de Asiento y Queso",
        precioBase: 50,
        categoriaId: catTlayudas.id,
      },
      {
        nombre: "Tlayuda de Mole y Queso",
        precioBase: 80,
        categoriaId: catTlayudas.id,
      },
    ],
  });

  // ---------- COMIDA DEL MAR ----------
  const costalitos = await prisma.producto.create({
    data: {
      nombre: "Costalitos (3pz)",
      precioBase: 160,
      modoPrecio: "SUMA",
      categoriaId: catComidaMar.id,
    },
  });
  await linkVariantGroup(costalitos.id, grupoProteinaCostalitos.id);

  const tostadas = await prisma.producto.create({
    data: {
      nombre: "Tostadas (3pz)",
      precioBase: 160,
      modoPrecio: "SUMA",
      categoriaId: catComidaMar.id,
    },
  });
  await linkVariantGroup(tostadas.id, grupoProteinaTostada.id);

  const aguachile = await prisma.producto.create({
    data: {
      nombre: "Aguachile de Camarón (c/8 camarones)",
      precioBase: 200,
      modoPrecio: "SUMA",
      categoriaId: catComidaMar.id,
    },
  });
  await linkVariantGroup(aguachile.id, grupoColorAguachile.id);

  // ---------- COCTELES (tamaño se queda REEMPLAZA) ----------
  const coctel = await prisma.producto.create({
    data: {
      nombre: "Coctel",
      precioBase: 0,
      modoPrecio: "SUMA",
      categoriaId: catCocteles.id,
    },
  });
  await linkVariantGroup(coctel.id, grupoTipoCoctel.id);
  await linkVariantGroup(coctel.id, grupoTamanoCoctel.id);

  // ---------- ENSALADAS ----------
  const ensalada = await prisma.producto.create({
    data: {
      nombre: "Ensalada",
      precioBase: 190,
      modoPrecio: "SUMA",
      categoriaId: catEnsaladas.id,
    },
  });
  await linkVariantGroup(ensalada.id, grupoProteinaEnsalada.id);

  // ---------- CALDOS ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Caldo de Camarón",
        precioBase: 150,
        categoriaId: catCaldos.id,
      },
      { nombre: "Cazuela 7 Mares", precioBase: 190, categoriaId: catCaldos.id },
      {
        nombre: "Cazuela 7 Mares Gratinado con Queso Manchego",
        precioBase: 200,
        categoriaId: catCaldos.id,
      },
    ],
  });

  // ---------- PASTAS ----------
  await prisma.producto.createMany({
    data: [
      { nombre: "Espagueti Rojo", precioBase: 80, categoriaId: catPastas.id },
      { nombre: "Espagueti Blanco", precioBase: 80, categoriaId: catPastas.id },
      {
        nombre: "Espagueti a los Tres Quesos con Camarón",
        precioBase: 160,
        categoriaId: catPastas.id,
      },
      {
        nombre: "Espagueti a los Tres Quesos",
        precioBase: 140,
        categoriaId: catPastas.id,
      },
    ],
  });

  // ---------- CAMARONES (base 190, SUMA) ----------
  const camarones = await prisma.producto.create({
    data: {
      nombre: "Camarones",
      precioBase: 190,
      modoPrecio: "SUMA",
      categoriaId: catCamarones.id,
    },
  });
  await linkVariantGroup(camarones.id, grupoPrepCamarones.id);
  await linkExtraGroup(camarones.id, grupoGuarniciones.id);

  // ---------- PULPO (base 190, SUMA) ----------
  const pulpo = await prisma.producto.create({
    data: {
      nombre: "Pulpo",
      precioBase: 190,
      modoPrecio: "SUMA",
      categoriaId: catPulpo.id,
    },
  });
  await linkVariantGroup(pulpo.id, grupoPrepPulpo.id);
  await linkExtraGroup(pulpo.id, grupoGuarniciones.id);

  // ---------- MOJARRA (base 205, SUMA) ----------
  const mojarra = await prisma.producto.create({
    data: {
      nombre: "Mojarra (700g)",
      precioBase: 205,
      modoPrecio: "SUMA",
      categoriaId: catMojarras.id,
    },
  });
  await linkVariantGroup(mojarra.id, grupoPrepMojarra.id);
  await linkExtraGroup(mojarra.id, grupoGuarniciones.id);

  // ---------- FILETE (base 160, SUMA) ----------
  const filete = await prisma.producto.create({
    data: {
      nombre: "Filete",
      precioBase: 160,
      modoPrecio: "SUMA",
      categoriaId: catFiletes.id,
    },
  });
  await linkVariantGroup(filete.id, grupoPrepFilete.id);
  await linkExtraGroup(filete.id, grupoGuarniciones.id);

  await prisma.producto.create({
    data: {
      nombre: "Filete Relleno de Mariscos",
      precioBase: 240,
      categoriaId: catFiletes.id,
    },
  });

  // ---------- ESPECIALIDADES ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Camarones Estilo La Perla",
        precioBase: 250,
        categoriaId: catEspecialidades.id,
      },
      {
        nombre: "Piña Rellena de Mariscos",
        precioBase: 350,
        categoriaId: catEspecialidades.id,
      },
      {
        nombre: "Molcajetazo",
        precioBase: 650,
        categoriaId: catEspecialidades.id,
      },
      {
        nombre: "Molcajetazo Mar y Tierra",
        precioBase: 600,
        categoriaId: catEspecialidades.id,
      },
      {
        nombre: "Filete a la Hawaiana",
        precioBase: 220,
        categoriaId: catEspecialidades.id,
      },
      {
        nombre: "Mariscada",
        descripcion: "Incluye: Mojarra / Filete / Pulpo / Camarones",
        precioBase: 1000,
        categoriaId: catEspecialidades.id,
      },
    ],
  });

  // ---------- POSTRES ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Cheesecake de Zarzamora",
        precioBase: 60,
        categoriaId: catPostres.id,
      },
      {
        nombre: "Durazno con Crema",
        precioBase: 60,
        categoriaId: catPostres.id,
      },
      {
        nombre: "Durazno con Rompope",
        precioBase: 60,
        categoriaId: catPostres.id,
      },
      { nombre: "Plátanos Fritos", precioBase: 60, categoriaId: catPostres.id },
      {
        nombre: "Plátanos al Horno",
        precioBase: 60,
        categoriaId: catPostres.id,
      },
    ],
  });

  // ---------- MENÚ INFANTIL ----------
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Hamburguesa Sencilla",
        precioBase: 110,
        categoriaId: catInfantil.id,
      },
      {
        nombre: "Hamburguesa Hawaiana",
        precioBase: 130,
        categoriaId: catInfantil.id,
      },
      {
        nombre: "Hamburguesa Especial",
        precioBase: 160,
        categoriaId: catInfantil.id,
      },
      {
        nombre: "Dedos de Pescado",
        precioBase: 130,
        categoriaId: catInfantil.id,
      },
      {
        nombre: "Dedos de Queso",
        precioBase: 120,
        categoriaId: catInfantil.id,
      },
      { nombre: "Nuggets", precioBase: 120, categoriaId: catInfantil.id },
      { nombre: "Pan Francés", precioBase: 100, categoriaId: catInfantil.id },
      { nombre: "Hot Cakes", precioBase: 100, categoriaId: catInfantil.id },
      {
        nombre: "Malteada de Fresa (Infantil)",
        precioBase: 75,
        categoriaId: catInfantil.id,
      },
      { nombre: "Chocomilk", precioBase: 70, categoriaId: catInfantil.id },
      {
        nombre: "Sodas Italianas (Infantil)",
        precioBase: 70,
        categoriaId: catInfantil.id,
      },
      {
        nombre: "Frappé de Oreo (Infantil)",
        precioBase: 75,
        categoriaId: catInfantil.id,
      },
      {
        nombre: "Frappé de Chokis (Infantil)",
        precioBase: 75,
        categoriaId: catInfantil.id,
      },
    ],
  });

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
