# Academia de Física — CECYT 1

Sitio web estático para la Academia de Física. Diseñado para que **un no-técnico pueda actualizar todo el contenido** editando un solo archivo.

---

## ¿Cómo funciona?

```
fis-academia/
├── index.html          ← Estructura de la página (NO editar)
├── css/styles.css      ← Diseño visual (NO editar)
├── js/main.js          ← Lógica del sitio (NO editar)
├── data/
│   └── contenido.json  ← ✅ AQUÍ se edita TODO el contenido
├── archivos/           ← Carpeta para subir PDFs, Word, etc.
└── vercel.json         ← Configuración de Vercel (NO editar)
```

**Regla de oro: solo edita `data/contenido.json`.**

---

## Editar el contenido

### Abrir el archivo

Abre `data/contenido.json` con el Bloc de notas, Notepad++ o VS Code.

El archivo tiene esta estructura general:

```json
{
  "sitio":    { ... },   ← Título y subtítulo del sitio
  "menu":     [ ... ],   ← Ítems del menú lateral
  "paginas":  { ... },   ← Contenido de cada sección
  "widgets":  { ... }    ← Avisos, noticias y eventos del sidebar
}
```

---

### Cambiar el título del sitio

```json
"sitio": {
  "titulo":    "Academia de Física",
  "subtitulo": "CECYT 1 · Turno Matutino"
}
```

Cambia los textos entre comillas.

---

### Agregar un aviso importante (widget)

Localiza la sección `"avisos"` dentro de `"widgets"`:

```json
"avisos": {
  "titulo": "📢 Avisos Importantes",
  "items": [
    {
      "texto":   "Examen parcial el próximo lunes 10 de marzo.",
      "fecha":   "2025-03-05",
      "urgente": true
    },
    {
      "texto":   "Nuevo material disponible en Física I.",
      "fecha":   "2025-03-01",
      "urgente": false
    }
  ]
}
```

- `"urgente": true` muestra una barra naranja en el aviso.
- La fecha usa el formato `"AAAA-MM-DD"` (año-mes-día).
- Para **agregar** un aviso, copia el bloque `{ "texto":…, "fecha":…, "urgente":… }` y pégalo dentro de `"items"`, separado por una coma.
- Para **eliminar** un aviso, borra ese bloque completo (desde `{` hasta `}`).

---

### Agregar una noticia

Localiza `"noticias"` dentro de `"widgets"`:

```json
"noticias": {
  "titulo": "📰 Noticias Recientes",
  "items": [
    {
      "titulo": "Título de la noticia",
      "texto":  "Descripción breve de la noticia.",
      "fecha":  "2025-03-10"
    }
  ]
}
```

Agrega más objetos `{ "titulo":…, "texto":…, "fecha":… }` dentro de `"items"`.

---

### Agregar un evento próximo

Localiza `"eventos"` dentro de `"widgets"`:

```json
"eventos": {
  "titulo": "📅 Próximos Eventos",
  "items": [
    { "nombre": "Segundo Parcial Física I", "fecha": "2025-04-28", "tipo": "examen"   },
    { "nombre": "Entrega Práctica 3",       "fecha": "2025-02-14", "tipo": "entrega"  },
    { "nombre": "Asesoría especial",         "fecha": "2025-02-10", "tipo": "asesoria" }
  ]
}
```

El campo `"tipo"` puede ser: `examen`, `entrega` o `asesoria` (cambia el color del punto).

---

### Agregar un material descargable (PDF, Word, video)

1. **Sube el archivo** a la carpeta `archivos/` del proyecto.
2. Localiza la unidad o práctica en `contenido.json`.
3. Agrega un objeto al array `"materiales"`:

```json
{
  "titulo": "Guía de Estudio Parcial 1",
  "tipo":   "pdf",
  "url":    "archivos/mi-guia.pdf"
}
```

Para un video de YouTube:

```json
{
  "titulo": "Video explicativo — Cinemática",
  "tipo":   "video",
  "url":    "https://www.youtube.com/watch?v=ID_DEL_VIDEO"
}
```

Tipos disponibles: `pdf`, `docx`, `xlsx`, `pptx`, `video`, `zip`.

---

### Cambiar información del profesor

Localiza `"paginas" → "contacto" → "profesor"`:

```json
"profesor": {
  "nombre":           "Prof. María García López",
  "email":            "fisica@cecyt1.ipn.mx",
  "telefono":         "55 1234 5678 (ext. 2201)",
  "oficina":          "Edificio B, Cubículo 201",
  "horario_atencion": "Lunes a Viernes · 13:00 – 15:00 h"
}
```

---

### Activar el formulario de contacto

1. Ve a [formspree.io](https://formspree.io) y crea una cuenta gratuita.
2. Crea un nuevo formulario → copia tu **Form ID** (algo como `xpzgkqrw`).
3. En `contenido.json`, localiza:
   ```json
   "formspree_id": "YOUR_FORMSPREE_ID"
   ```
4. Reemplaza `YOUR_FORMSPREE_ID` con tu ID:
   ```json
   "formspree_id": "xpzgkqrw"
   ```
5. Guarda y despliega. Los mensajes llegarán a tu correo registrado en Formspree.

---

### Agregar o cambiar fechas de exámenes

Localiza `"paginas" → "evaluaciones" → "examenes"`:

```json
{
  "nombre":  "Tercer Parcial — Física I",
  "fecha":   "2025-05-19",
  "temas":   "Energía y trabajo",
  "grupos":  "1FM1, 1FM2"
}
```

---

## Cómo ver el sitio localmente

Necesitas un servidor web local (no basta con abrir el archivo HTML directamente en el navegador, porque el archivo JSON no cargará).

**Opción 1 — Con Node.js** (recomendada):
```bash
# Instala una sola vez:
npm install -g http-server

# Ejecuta desde la carpeta del proyecto:
npx http-server .
```
Luego abre `http://localhost:8080` en tu navegador.

**Opción 2 — Con VS Code**: instala la extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.

---

## Subir a Vercel (gratis)

1. Crea cuenta en [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. Sube el proyecto a un repositorio de GitHub:
   ```bash
   git add .
   git commit -m "Mi sitio de física"
   git push
   ```
3. En Vercel: **Add New Project** → selecciona el repositorio.
4. Sin cambiar nada, haz clic en **Deploy**.
5. Vercel generará una URL pública (p. ej. `academia-fisica.vercel.app`).

Para **actualizar** el sitio después: edita `contenido.json`, haz commit y push → Vercel lo redespliega automáticamente en ~30 segundos.

---

## Checklist antes de publicar

- [ ] Reemplazaste `YOUR_FORMSPREE_ID` con tu ID real (o lo dejaste así si no usarás formulario).
- [ ] Cambiaste los datos del profesor en `"contacto" → "profesor"`.
- [ ] Actualizaste las fechas de exámenes para el semestre real.
- [ ] Subiste los PDFs a la carpeta `archivos/` y actualizaste las URLs en el JSON.
- [ ] Probaste el sitio localmente antes de publicar.

---

## Soporte

Si el sitio no carga, revisa:
1. Que el JSON esté correctamente formateado (sin comas extra, sin comillas faltantes). Puedes pegarlo en [jsonlint.com](https://jsonlint.com) para validarlo.
2. Que estés usando un servidor local, no abriendo el archivo directamente.
3. Que los nombres de los archivos en `"url"` coincidan exactamente con los archivos en la carpeta `archivos/`.
