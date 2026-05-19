# VendorList 🏪

Red social para negocios — Publica, conecta y vende.

## Estructura del proyecto

```
vendorlist/
├── index.html              ← Feed principal
├── css/
│   └── main.css            ← Estilos globales
├── js/
│   ├── firebase-config.js  ← ⚠️ Configura aquí Firebase
│   ├── auth.js             ← Manejo de sesión
│   ├── feed.js             ← Carga publicaciones
│   └── post.js             ← Crear publicaciones
└── pages/
    ├── login.html          ← Inicio de sesión
    ├── register.html       ← Registro de negocios
    ├── profile.html        ← Perfil + catálogo
    └── explore.html        ← Explorar negocios
```

## 🚀 Configuración paso a paso

### 1. Firebase (base de datos en la nube)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un proyecto nuevo: **vendorlist**
3. En **Authentication** → habilita **Email/Password**
4. En **Firestore Database** → crea base de datos en modo producción
5. En **Storage** → activa el almacenamiento ------
6. Ve a **Configuración del proyecto** → **Tus apps** → agrega una **app web**
7. Copia el objeto `firebaseConfig` y pégalo en `js/firebase-config.js`

### 2. Reglas de Firestore

Copia estas reglas en **Firestore → Reglas**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Negocios: cualquiera puede leer, solo el dueño edita
    match /businesses/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    // Posts: cualquiera puede leer, solo negocios autenticados crean
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null; // para likes
      allow delete: if request.auth != null && request.auth.uid == resource.data.businessId;
    }
    // Productos: lectura pública, escritura solo del dueño
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.businessId;
    }
  }
}
```

### 3. Reglas de Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Índices de Firestore

Ve a **Firestore → Índices** y crea estos índices compuestos:

| Colección | Campo 1 | Campo 2 | Tipo |
|-----------|---------|---------|------|
| posts | businessCategory (ASC) | createdAt (DESC) | Compuesto |
| posts | businessId (ASC) | createdAt (DESC) | Compuesto |
| products | businessId (ASC) | createdAt (DESC) | Compuesto |

### 5. GitHub Pages

1. Sube todos los archivos a tu repositorio de GitHub
2. Ve a **Settings → Pages**
3. En **Source** selecciona tu rama (`main`) y carpeta (`/ (root)`)
4. ¡Tu sitio estará en `https://tuusuario.github.io/vendorlist/`!

## 📦 Colecciones en Firestore

### `businesses/{uid}`
```json
{
  "name": "Panadería La Estrella",
  "category": "restaurantes",
  "description": "Los mejores panes de la ciudad",
  "email": "contacto@ejemplo.com",
  "phone": "+52 81 0000 0000",
  "website": "https://ejemplo.com",
  "logoUrl": "https://...",
  "coverUrl": "https://...",
  "createdAt": "timestamp"
}
```

### `posts/{id}`
```json
{
  "businessId": "uid_del_negocio",
  "businessName": "Panadería La Estrella",
  "businessCategory": "restaurantes",
  "businessLogoUrl": "https://...",
  "text": "¡Nuevos panes recién horneados!",
  "mediaUrl": "https://storage.../...",
  "mediaType": "photo",
  "likes": ["uid1", "uid2"],
  "createdAt": "timestamp"
}
```

### `products/{id}`
```json
{
  "businessId": "uid_del_negocio",
  "name": "Pan de Elote",
  "description": "Hecho con maíz fresco",
  "price": 35.00,
  "currency": "MXN",
  "imageUrl": "https://...",
  "available": true,
  "createdAt": "timestamp"
}
```

## ✅ Funcionalidades incluidas

- 🔐 Registro e inicio de sesión para negocios
- 📰 Feed de publicaciones en tiempo real
- 📸 Publicar texto, fotos y videos
- ❤️ Sistema de likes
- 🏪 Perfil de negocio con información completa
- 📦 Catálogo de productos con precios
- 🔍 Explorar y filtrar negocios por categoría
- 📱 Diseño responsivo para móviles

## 🔮 Próximas mejoras sugeridas

- Sistema de comentarios en posts
- Mensajería entre negocios y clientes
- Notificaciones push
- Carrito de compras
- Integración con WhatsApp Business API
- Panel de analíticas para negocios
