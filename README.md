# Academia de Física — CECYT 1

Sitio web estático para la Academia de Física del CECYT 1. Diseñado para que **el contenido se actualice editando un solo archivo JSON**, sin tocar código.

---

## Estructura del proyecto

```
fis-academia/
├── index.html            ← Esqueleto HTML (no editar)
├── css/
│   └── styles.css        ← Estilos visuales (no editar)
├── js/
│   └── main.js           ← Lógica del sitio (no editar)
├── data/
│   └── contenido.json    ← ÚNICO archivo que se edita para cambiar contenido
├── archivos/             ← Carpeta donde se suben los PDFs, Word, etc.
├── vercel.json           ← Configuración de deploy en Vercel (no editar)
└── package.json          ← Metadatos del proyecto (no editar)
```

**Regla de oro: para cualquier cambio de contenido, edita solo `data/contenido.json`.**

---

## Correr el sitio localmente

El sitio necesita un servidor web local porque carga el JSON con `fetch()`. Abrir `index.html` directamente en el navegador no funcionará.

### Opción recomendada — http-server con caché desactivado

```bash
npx http-server -c-1
```

Luego abre `http://localhost:8080` en el navegador.

> El flag `-c-1` desactiva el caché del servidor. Sin él, el navegador puede mostrarte una versión antigua aunque hayas guardado cambios. Si aun así no ves los cambios, usa `Ctrl + Shift + R` para forzar recarga completa.

### Alternativa — Live Server (VS Code)

Instala la extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*. Se recarga automáticamente al guardar archivos.

---

## Estructura de `contenido.json`

```json
{
  "sitio":   { ... },    ← Título y subtítulo del sitio
  "menu":    [ ... ],    ← Ítems del menú lateral
  "paginas": { ... },    ← Contenido de Inicio, Física I–IV y Horarios
  "widgets": { ... }     ← Avisos, noticias, eventos y contacto del sidebar
}
```

Cada sección se documenta abajo.

---

## Editar el título y subtítulo del sitio

```json
"sitio": {
  "titulo":    "Academia de Física",
  "subtitulo": "CECYT 1 · Turno Matutino",
  "descripcion": "Texto breve de descripción (solo para metadatos)"
}
```

El `titulo` aparece en el header, el footer y la pestaña del navegador.

---

## Editar el menú lateral

```json
"menu": [
  { "id": "inicio",   "label": "Inicio"    },
  { "id": "fisica1",  "label": "Física I"  },
  { "id": "fisica2",  "label": "Física II" },
  { "id": "fisica3",  "label": "Física III"},
  { "id": "fisica4",  "label": "Física IV" },
  { "id": "horarios", "label": "Horarios"  }
]
```

- `"id"` debe coincidir exactamente con una clave dentro de `"paginas"`.
- `"label"` es el texto visible en el menú.
- El orden en el array es el orden en el menú.

---

## Editar la página de Inicio

```json
"paginas": {
  "inicio": {
    "titulo": "Bienvenida",
    "aviso": {
      "titulo": "Aviso Importante",
      "texto":  "Texto del aviso que aparece resaltado al entrar."
    },
    "bienvenida": "Texto de presentación visible debajo del aviso.",
    "accesos_rapidos": [
      { "label": "Ir a Física I",      "seccion": "fisica1"  },
      { "label": "Consultar Horarios", "seccion": "horarios" }
    ]
  }
}
```

- Para ocultar el aviso, elimina el bloque `"aviso": { ... }` completo.
- `"seccion"` en los accesos rápidos debe coincidir con un `"id"` del menú.

---

## Editar materiales de Física I, II, III o IV

Cada sección de física tiene unidades, y cada unidad tiene materiales:

```json
"fisica1": {
  "titulo":      "Física I",
  "descripcion": "Descripción breve del curso.",
  "unidades": [
    {
      "nombre":      "Unidad 1 — Cinemática",
      "descripcion": "Descripción de los temas de la unidad.",
      "materiales": [
        { "titulo": "Guía Teórica",          "tipo": "pdf",   "url": "archivos/f1-u1-guia.pdf" },
        { "titulo": "Video explicativo",     "tipo": "video", "url": "https://www.youtube.com/watch?v=XXXXX" },
        { "titulo": "Formulario de repaso",  "tipo": "docx",  "url": "archivos/f1-u1-formulario.docx" }
      ]
    }
  ]
}
```

### Tipos de material disponibles

| Valor en `"tipo"` | Uso |
|---|---|
| `pdf` | Archivo PDF |
| `video` | Enlace a YouTube u otro video |
| `docx` | Documento Word |
| `xlsx` | Hoja de cálculo Excel |
| `pptx` | Presentación PowerPoint |
| `zip` | Archivo comprimido |

### Agregar un nuevo material

1. Copia el archivo a la carpeta `archivos/` del proyecto.
2. Agrega un objeto al array `"materiales"` de la unidad correspondiente:

```json
{ "titulo": "Ejercicios Parcial 2", "tipo": "pdf", "url": "archivos/f1-u2-ejercicios.pdf" }
```

Asegúrate de que el nombre del archivo en `"url"` sea exactamente igual al archivo en la carpeta `archivos/`.

### Agregar una nueva unidad

Copia el bloque completo de una unidad existente (desde `{` hasta `}`) dentro del array `"unidades"` y modifica el contenido. Separa cada unidad con una coma.

---

## Editar Horarios

```json
"horarios": {
  "titulo":      "Horarios",
  "descripcion": "Horarios de clases y asesorías académicas",
  "semestre":    "Semestre 2025-2",
  "clases": [
    { "dia": "Lunes", "hora": "07:00 – 08:30", "materia": "Física I", "grupo": "1FM1", "salon": "A-201" }
  ],
  "asesorias": [
    { "dia": "Lunes", "hora": "13:00 – 14:00", "lugar": "Sala de Maestros · Edificio B" }
  ],
  "nota": "Texto opcional que aparece al pie de la sección de horarios."
}
```

- Para agregar un horario de clase, copia un objeto de `"clases"` y modifica los valores.
- Para eliminar uno, borra ese objeto completo (desde `{` hasta `}`) incluyendo la coma que lo separa del siguiente.
- `"nota"` es opcional; si no quieres nota al pie, puedes dejarlo vacío (`"nota": ""`).

---

## Editar los widgets del sidebar derecho

### Avisos importantes

```json
"avisos": {
  "titulo": "Avisos Importantes",
  "items": [
    {
      "texto":   "Entrega de reportes: viernes antes de las 23:59 h.",
      "fecha":   "2025-01-15",
      "urgente": true
    }
  ]
}
```

- `"urgente": true` muestra una barra de color naranja en el aviso.
- `"urgente": false` muestra el aviso sin resaltar.
- Fecha en formato `"AAAA-MM-DD"`.

### Noticias recientes

```json
"noticias": {
  "titulo": "Noticias Recientes",
  "items": [
    {
      "titulo": "Apertura del semestre",
      "texto":  "Todos los materiales han sido actualizados.",
      "fecha":  "2025-01-13"
    }
  ]
}
```

### Próximos eventos

```json
"eventos": {
  "titulo": "Próximos Eventos",
  "items": [
    { "nombre": "Primer Parcial Física I", "fecha": "2025-03-10", "tipo": "examen"   },
    { "nombre": "Entrega Práctica 2",      "fecha": "2025-01-31", "tipo": "entrega"  },
    { "nombre": "Asesoría de Ondas",       "fecha": "2025-01-27", "tipo": "asesoria" }
  ]
}
```

El campo `"tipo"` cambia el color del punto indicador. Valores válidos: `examen`, `entrega`, `asesoria`.

### Contacto rápido

```json
"contacto_rapido": {
  "titulo":   "Contacto Rápido",
  "email":    "fisica@cecyt1.ipn.mx",
  "horario":  "L–V: 13:00 – 15:00 h"
}
```

---

## Validar el JSON antes de guardar

Un error de sintaxis en el JSON (coma extra, comilla faltante) hará que el sitio no cargue nada. Antes de publicar, pega el contenido del archivo en **[jsonlint.com](https://jsonlint.com)** para verificar que sea válido.

Errores comunes:
- Coma después del último elemento de un array o objeto: `[ {...}, ]` ← la coma final está de más.
- Comillas simples en vez de dobles: `'texto'` debe ser `"texto"`.
- Olvidar cerrar una llave `}` o corchete `]`.

---

## Publicar cambios en Vercel

El proyecto está conectado a Vercel mediante GitHub. Para publicar:

```bash
git add data/contenido.json
git commit -m "Actualizar contenido: descripción del cambio"
git push
```

Vercel detecta el push y redespliega automáticamente en ~30 segundos. No se necesita hacer nada más en Vercel.

Si también subiste archivos a la carpeta `archivos/`, inclúyelos en el commit:

```bash
git add data/contenido.json archivos/nuevo-archivo.pdf
git commit -m "Agregar guía unidad 2 Física I"
git push
```

---

## Checklist de mantenimiento por semestre

Al inicio de cada semestre:

- [ ] Actualizar `"semestre"` en la sección `"horarios"`.
- [ ] Revisar y actualizar los horarios de clases y asesorías.
- [ ] Limpiar avisos y noticias del semestre anterior.
- [ ] Actualizar o agregar eventos (parciales, entregas).
- [ ] Subir los PDFs y materiales nuevos a `archivos/` y registrarlos en el JSON.
- [ ] Validar el JSON en jsonlint.com antes de hacer push.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| El sitio no carga nada | JSON con error de sintaxis | Validar en jsonlint.com |
| No se ven los cambios con F5 | Caché del navegador | Usar `Ctrl+Shift+R` o arrancar el servidor con `npx http-server -c-1` |
| Un PDF no abre | Nombre de archivo incorrecto en el JSON | Verificar que el nombre en `"url"` coincide exactamente con el archivo en `archivos/` |
| El sitio no carga al abrir `index.html` directamente | Protocolo `file://` bloquea el fetch | Usar siempre un servidor local (`npx http-server -c-1`) |
| Vercel no actualiza | Push no realizado | Ejecutar `git push` y esperar ~30 segundos |
