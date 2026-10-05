# 🍕 Pizza Bot — Pedidos por voz con IA

Demo interactiva de un sistema de pedidos de pizzería por voz, usando la **Gemini Live API** de Google para conversación en tiempo real.

## Características

- **Voz en tiempo real**: Conversación natural con "Marco", el empleado que contesta el teléfono
- **Carrito dinámico**: Se actualiza en vivo conforme hablas
- **Carta interactiva**: SVG inline con ingredientes, alérgenos y precios
- **Function calling**: El modelo llama funciones para resaltar productos, actualizar el carrito y guardar pedidos
- **Sin backend**: 100% cliente — HTML, CSS y JS vanilla con ESM imports

## Cómo usarlo

1. Consigue una API key gratuita en [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Abre `index.html` en tu navegador (o visita el deploy en GitHub Pages)
3. Pega tu API key y pulsa "Iniciar llamada"
4. Habla como si llamaras a una pizzería de verdad

## Tech stack

- **Gemini Live API** (`gemini-3.1-flash-live-preview`) — streaming bidireccional de audio
- **Web Audio API** — captura de micrófono + cola de reproducción
- **Vanilla JS (ESM)** — sin frameworks, sin bundler
- **SVG inline** — iconos de productos sin dependencias externas

## Autor

**Adrián Céspedes Pérez**  
[github.com/Adriancpds24](https://github.com/Adriancpds24)
