
/*
 * C01 - Catálogo de productos
 */

export const productosIniciales = [
    {
        codigo: "TC001",
        nombre: "Torta Cuadrada de Chocolate",
        precio: 45000,
        imagen: "/img/Torta Cuadrada de Chocolate.png",
        descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
        categoria: "cuadradas",
        stock: 10,
        stockCritico: 3
    },
    {
        codigo: "TC002",
        nombre: "Torta Cuadrada de Frutas",
        precio: 50000,
        imagen: "/img/Torta Cuadrada de Frutas.png",
        descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
        categoria: "cuadradas",
        stock: 2,
        stockCritico: 5
    },
    {
        codigo: "TT001",
        nombre: "Torta Circular de Vainilla",
        precio: 40000,
        imagen: "/img/Torta Circular de Vainilla.png",
        descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
        categoria: "circulares",
        stock: 12,
        stockCritico: 4
    },
    {
        codigo: "TT002",
        nombre: "Torta Circular de Manjar",
        precio: 42000,
        imagen: "/img/Torta Circular de Manjar.png",
        descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
        categoria: "circulares",
        stock: 4,
        stockCritico: 4
    },
    {
        codigo: "PI001",
        nombre: "Mousse de Chocolate",
        precio: 5000,
        imagen: "/img/Mousse de Chocolate.png",
        descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
        categoria: "individuales",
        stock: 20,
        stockCritico: 5
    },
    {
        codigo: "PI002",
        nombre: "Tiramisú Clásico",
        precio: 5500,
        imagen: "/img/Tiramisú Clásico.png",
        descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
        categoria: "individuales",
        stock: 3,
        stockCritico: 5
    },
    {
        codigo: "PSA001",
        nombre: "Torta Sin Azúcar de Naranja",
        precio: 48000,
        imagen: "/img/Torta Sin Azúcar de Naranja.png",
        descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
        categoria: "sin-azucar",
        stock: 7,
        stockCritico: 3
    },
    {
        codigo: "PSA002",
        nombre: "Cheesecake Sin Azúcar",
        precio: 47000,
        imagen: "/img/Cheesecake Sin Azúcar.png",
        descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
        categoria: "sin-azucar",
        stock: 2,
        stockCritico: 3
    },
    {
        codigo: "PT001",
        nombre: "Empanada de Manzana",
        precio: 3000,
        imagen: "/img/Empanada de Manzana.png",
        descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
        categoria: "tradicional",
        stock: 25,
        stockCritico: 8
    },
    {
        codigo: "PT002",
        nombre: "Tarta de Santiago",
        precio: 6000,
        imagen: "/img/Tarta de Santiago.png",
        descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos.",
        categoria: "tradicional",
        stock: 8,
        stockCritico: 3
    },
    {
        codigo: "PG001",
        nombre: "Brownie Sin Gluten",
        precio: 4000,
        imagen: "/img/Brownie Sin Gluten.png",
        descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
        categoria: "sin-gluten",
        stock: 4,
        stockCritico: 5
    },
    {
        codigo: "PG002",
        nombre: "Pan Sin Gluten",
        precio: 3500,
        imagen: "/img/Pan Sin Gluten.png",
        descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
        categoria: "sin-gluten",
        stock: 15,
        stockCritico: 5
    },
    {
        codigo: "PV001",
        nombre: "Torta Vegana de Chocolate",
        precio: 50000,
        imagen: "/img/Torta Vegana de Chocolate.png",
        descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
        categoria: "veganos",
        stock: 6,
        stockCritico: 3
    },
    {
        codigo: "PV002",
        nombre: "Galletas Veganas de Avena",
        precio: 4500,
        imagen: "/img/Galletas Veganas de Avena.png",
        descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
        categoria: "veganos",
        stock: 18,
        stockCritico: 6
    },
    {
        codigo: "TE001",
        nombre: "Torta Especial de Cumpleaños",
        precio: 55000,
        imagen: "/img/Torta Especial de Cumpleaños.png",
        descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
        categoria: "especiales",
        stock: 2,
        stockCritico: 2
    },
    {
        codigo: "TE002",
        nombre: "Torta Especial de Boda",
        precio: 60000,
        imagen: "/img/Torta Especial de Boda.png",
        descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
        categoria: "especiales",
        stock: 5,
        stockCritico: 2
    }
];
