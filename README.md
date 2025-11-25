# Inventario - Estructura de diseño básica

Este repositorio contiene la estructura básica de la interfaz para un sistema de gestión de inventario.

Páginas incluidas (diseño, sin lógica backend):

- `index.html` — Dashboard (resumen, alertas de stock)
- `productos.html` — Tabla de productos con estados (bajo, medio, ok)
- `categorias.html` — Listado de categorías
- `agregarProducto.html` — Formulario para agregar un producto (validación cliente)
- `agregrarProducto.html` — (archivo original preservado si existía)
- `login.php` — Plantilla de formulario de autenticación (PHP) — sin verificación real

Assets:

- `assets/css/styles.css` — estilos personalizados mínimos
- `assets/js/validation.js` — validaciones cliente para `agregarProducto.html`

Siguientes pasos recomendados:

1. Implementar endpoints backend en PHP para:
   - Autenticación (login, manejo de sesiones)
   - CRUD de productos y categorías (con almacenamiento en BD)
2. Conectar formularios para enviar datos via POST y devolver JSON para operaciones asíncronas.
3. Añadir protección CSRF y validaciones server-side además de las client-side.
4. Añadir plantillas PHP comunes (header/footer) y/o usar un micro-framework para organizar la app.

Patrones y consideraciones implementadas:

- Diseño responsivo con Bootstrap (grid y utilidades flexbox)
- Separación de assets (CSS/JS)
- Validación cliente como primera barrera de UX
- Plantilla de login en PHP para integrar autenticación posteriormente

Si quieres, implemento ahora la conexión básica con la base de datos y la lógica PHP para autenticar y listar productos (sólo cuando confirmes).