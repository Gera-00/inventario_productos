# 📦 Sistema de Inventario de Productos

Un sistema completo de gestión de inventario desarrollado en PHP con MySQL, que incluye autenticación, CRUD completo, gestión de movimientos de stock y una interfaz moderna y responsiva.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Login seguro** con validación de credenciales
- **Manejo de sesiones** PHP con validación en cada página
- **Logout automático** con limpieza de sesión
- **Protección de rutas** - Solo usuarios autenticados pueden acceder

### 📊 Gestión de Productos
- ✅ **CRUD completo**: Crear, leer, actualizar y eliminar productos
- 🔍 **Búsqueda avanzada** con filtros por categoría y estado de stock
- 📈 **Estados de stock**: Crítico (≤5), Bajo (6-15), Normal (>15)
- 💰 **Gestión de precios** con formato de moneda
- 🏷️ **Categorización** de productos

### 🏷️ Gestión de Categorías
- ✅ **CRUD de categorías** con validación de integridad
- 📊 **Estadísticas por categoría**: productos, stock total, valor promedio
- 🔒 **Protección de eliminación** - No permite eliminar categorías con productos
- 👁️ **Visualización detallada** de productos por categoría

### 📦 Control de Inventario
- ➕ **Entradas de stock** - Agregar inventario
- ➖ **Salidas de stock** - Registrar ventas o pérdidas
- 🛡️ **Validación de stock** - Previene stock negativo
- 📊 **Historial de movimientos** en tiempo real

### 🎨 Interfaz de Usuario
- 📱 **Diseño responsivo** con Bootstrap 5.3.2
- 🎯 **Modales interactivos** para todas las operaciones
- ⚡ **Validación en tiempo real** con JavaScript
- 🔔 **Notificaciones** de éxito y error
- 🎨 **Iconos Bootstrap** para mejor UX

## 🏗️ Estructura del Proyecto

```
inventario_productos/
├── 📁 assets/
│   ├── 📁 css/
│   │   └── styles.css          # Estilos personalizados
│   ├── 📁 js/
│   │   ├── login.js            # Validación de login
│   │   ├── productos.js        # Gestión de productos
│   │   ├── categorias.js       # Gestión de categorías
│   │   └── agregarProducto.js  # Validación de formularios
│   └── 📁 img/                 # Imágenes del sistema
├── 📁 bd/
│   └── inventario_productos.sql # Script de base de datos
├── 📁 includes/
│   └── validar_sesion.php      # Middleware de autenticación
├── 📁 src/
│   ├── 📁 php/                 # Backend PHP
│   │   ├── conexion.php        # Configuración de BD
│   │   ├── login.php           # Autenticación
│   │   ├── logout.php          # Cierre de sesión
│   │   ├── guardar.php         # Crear productos
│   │   ├── editarProducto.php  # Actualizar productos
│   │   ├── delete.php          # Eliminar productos
│   │   ├── movimientos.php     # Entradas y salidas
│   │   ├── guardarCategoria.php    # Crear categorías
│   │   ├── editarCategoria.php     # Actualizar categorías
│   │   ├── eliminarCategoria.php   # Eliminar categorías
│   │   ├── obtenerProducto.php     # Datos de producto
│   │   ├── obtenerCategoria.php    # Datos de categoría
│   │   └── obtenerProductosCategoria.php # Productos por categoría
│   └── 📁 views/               # Frontend PHP
│       ├── home.php            # Dashboard principal
│       ├── productos.php       # Listado de productos
│       ├── categorias.php      # Gestión de categorías
│       └── agregarProducto.php # Formulario de productos
├── index.html                  # Página de bienvenida
└── README.md                   # Documentación
```

## 🚀 Instalación y Configuración

### 📋 Requisitos Previos
- **XAMPP/WAMP/LAMP** (Apache + MySQL + PHP 7.4+)
- **Navegador web moderno** con soporte para ES6+
- **MySQL 5.7+** o **MariaDB 10.2+**

### ⚙️ Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Gera-00/inventario_productos.git
   cd inventario_productos
   ```

2. **Configurar la base de datos**
   - Iniciar XAMPP y activar Apache + MySQL
   - Abrir phpMyAdmin (http://localhost/phpmyadmin)
   - Importar el archivo `bd/inventario_productos.sql`
   - Verificar que se creó la base de datos `inventario_productos`

3. **Configurar la conexión** (opcional)
   - Editar `src/php/conexion.php` si es necesario
   - Configurar: servidor, usuario, contraseña y base de datos

4. **Acceder al sistema**
   - Abrir: `http://localhost/inventario_productos`
   - **Usuario por defecto**: `admin`
   - **Contraseña por defecto**: `password`

## 🎯 Funcionalidades Detalladas

### 🔐 Sistema de Login
- Formulario con validación JavaScript
- Verificación de credenciales en PHP
- Manejo seguro de sesiones
- Redirección automática según el estado de sesión

### 📦 Gestión de Productos
#### ➕ Agregar Productos
- Formulario con validación en tiempo real
- Selección de categoría dinámica
- Validación de campos: nombre, categoría, stock, precio
- Prevención de productos duplicados

#### 📋 Listar Productos
- Tabla responsive con todos los productos
- Filtros por: nombre, categoría, estado de stock
- Estados visuales: Crítico, Bajo, Normal
- Contador de resultados filtrados

#### ✏️ Editar Productos
- Modal con formulario prellenado
- Validación de nombres únicos
- Actualización en tiempo real
- Confirmación visual de cambios

#### 🗑️ Eliminar Productos
- Modal de confirmación con advertencias
- Validación de existencia antes de eliminar
- Feedback visual del proceso

#### 📊 Entradas y Salidas
- Modal interactivo para movimientos de stock
- Validación de cantidades disponibles
- Cálculo automático de stock resultante
- Prevención de stock negativo

### 🏷️ Gestión de Categorías
#### 📊 Dashboard de Categorías
- Estadísticas generales del sistema
- Tabla con información detallada por categoría
- Filtros avanzados por productos y stock

#### ➕ Agregar Categorías
- Modal con validación de nombres únicos
- Creación instantánea vía AJAX
- Feedback inmediato al usuario

#### ✏️ Editar Categorías
- Carga asíncrona de datos
- Validación de nombres únicos
- Información de productos asociados

#### 🗑️ Eliminar Categorías
- Protección contra eliminación con productos
- Advertencias claras sobre restricciones
- Validación de integridad referencial

#### 👁️ Ver Productos por Categoría
- Modal detallado con estadísticas
- Lista completa de productos de la categoría
- Búsqueda interna de productos
- Enlaces a formularios de agregado

## 🛠️ Tecnologías Utilizadas

### Backend
- **PHP 7.4+** - Lógica del servidor
- **MySQL** - Base de datos relacional
- **MySQLi** - Interfaz de base de datos con prepared statements

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos personalizados
- **Bootstrap 5.3.2** - Framework responsive
- **JavaScript ES6+** - Interactividad del cliente
- **Bootstrap Icons** - Iconografía moderna

### Seguridad
- **Prepared Statements** - Prevención de SQL injection
- **Validación de sesiones** - Control de acceso
- **Sanitización de datos** - Prevención de XSS
- **Validación dual** - Cliente y servidor

## 📊 Base de Datos

### Tablas Principales
```sql
Usuarios
├── id (Primary Key)
├── nombre
├── usuario
└── contrasenia

Categorias
├── id (Primary Key)
└── nombre

Productos
├── id (Primary Key)
├── nombre
├── id_categoria (Foreign Key)
├── stock
└── precio
```

### Datos de Prueba
- **Usuario administrador** pre-configurado
- **Categorías de ejemplo** incluidas
- **Productos de muestra** para testing

## 🔧 Configuración Avanzada

### Personalización de Base de Datos
Editar `src/php/conexion.php`:
```php
$conexion = mysqli_connect(
    'localhost',    // Servidor
    'root',         // Usuario
    '',             // Contraseña
    'inventario_productos'  // Base de datos
);
```

### Estilos Personalizados
- Modificar `assets/css/styles.css` para personalizar la apariencia
- Todos los componentes usan clases de Bootstrap para fácil customización

## 🚀 Características Técnicas

### Arquitectura
- **Separación de responsabilidades** - Backend/Frontend claramente divididos
- **Modularidad** - Cada funcionalidad en archivos separados
- **Reutilización** - Componentes y funciones reutilizables

### Validaciones
- **Frontend**: JavaScript con validación en tiempo real
- **Backend**: PHP con prepared statements y validaciones robustas
- **Base de datos**: Restricciones de integridad referencial

### Experiencia de Usuario
- **Feedback inmediato** - Notificaciones de éxito/error
- **Loading states** - Indicadores de carga durante operaciones
- **Confirmaciones** - Modales para acciones destructivas
- **Navegación intuitiva** - Estructura clara y consistente

## 📈 Próximas Mejoras

- [ ] **Dashboard avanzado** con gráficos y métricas
- [ ] **Reportes** en PDF/Excel
- [ ] **Historial de movimientos** detallado
- [ ] **Sistema de usuarios** con roles y permisos
- [ ] **API REST** para integraciones
- [ ] **Notificaciones automáticas** de stock bajo
- [ ] **Backup automático** de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Gerardo** - [Gera-00](https://github.com/Gera-00)

---

⭐ **¡Dale una estrella al proyecto si te ha sido útil!** ⭐