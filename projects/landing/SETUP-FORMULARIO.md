# Conectar el formulario a Google Sheets

## Paso 1 — Crear la planilla

1. Abrí Google Sheets en tu Drive
2. Creá una planilla nueva y llamala "La Bandeja — Inscriptos"
3. En la primera fila, escribí estos encabezados en A1, B1, C1:
   - A1: `Timestamp`
   - B1: `Nombre`
   - C1: `Celular`

## Paso 2 — Crear el script

1. En la planilla, andá a **Extensiones → Apps Script**
2. Borrá el código que aparece por defecto
3. Pegá este código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.nombre, data.celular]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Guardá el proyecto (dale un nombre cualquiera, ej: "Formulario Bandeja")

## Paso 3 — Publicar como Web App

1. Hacé clic en **Implementar → Nueva implementación**
2. En "Tipo", elegí **Aplicación web**
3. Configurá así:
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier usuario
4. Hacé clic en **Implementar**
5. Google te va a pedir que autorices el script — aceptá
6. **Copiá la URL** que aparece (empieza con `https://script.google.com/macros/s/...`)

## Paso 4 — Pegar la URL en el landing

1. Abrí `projects/landing/index.html`
2. Buscá esta línea (cerca del final, en el `<script>`):
   ```javascript
   const SHEETS_URL = 'PASTE_YOUR_URL_HERE';
   ```
3. Reemplazá `PASTE_YOUR_URL_HERE` con la URL que copiaste

## Listo

A partir de ahora, cada vez que alguien complete el formulario, sus datos aparecen automáticamente en la planilla con fecha y hora.

## Nota importante

Cada vez que modifiques el Apps Script, tenés que hacer una **nueva implementación** (no editar la existente) para que los cambios tomen efecto.
