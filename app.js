import { GoogleGenAI, Modality } from "https://esm.sh/@google/genai";

// ---------- Configuración del negocio (edítalo a tu gusto) ----------
const MODEL = "gemini-3.1-flash-live-preview";

const MENU = {
  pizzas: [
    {
      id: "margarita",
      nombre: "Margarita",
      descripcion: "La clásica napolitana: salsa de tomate San Marzano, mozzarella fresca y albahaca.",
      ingredientes: ["Salsa de tomate San Marzano", "Mozzarella fior di latte", "Albahaca fresca", "Aceite de oliva virgen extra"],
      alergenos: ["Gluten", "Lácteos"],
      precios: { pequeña: 7, mediana: 9, grande: 12 },
    },
    {
      id: "barbacoa",
      nombre: "Barbacoa",
      descripcion: "Pollo asado y bacon crujiente sobre mozzarella, con salsa barbacoa casera y cebolla caramelizada.",
      ingredientes: ["Mozzarella", "Pollo asado", "Bacon", "Cebolla caramelizada", "Salsa barbacoa"],
      alergenos: ["Gluten", "Lácteos"],
      precios: { pequeña: 9, mediana: 11.5, grande: 14.5 },
    },
    {
      id: "cuatroquesos",
      nombre: "Cuatro Quesos",
      descripcion: "Mezcla generosa de quesos italianos fundidos: mozzarella, gorgonzola, parmesano y provolone.",
      ingredientes: ["Mozzarella", "Gorgonzola", "Parmesano", "Provolone"],
      alergenos: ["Gluten", "Lácteos"],
      precios: { pequeña: 9, mediana: 11.5, grande: 14.5 },
    },
    {
      id: "hawaiana",
      nombre: "Hawaiana",
      descripcion: "Jamón cocido y piña natural sobre base de tomate y mozzarella. Amor u odio, sin término medio.",
      ingredientes: ["Salsa de tomate", "Mozzarella", "Jamón cocido", "Piña natural"],
      alergenos: ["Gluten", "Lácteos"],
      precios: { pequeña: 8, mediana: 10.5, grande: 13.5 },
    },
    {
      id: "pepperoni",
      nombre: "Pepperoni",
      descripcion: "Doble ración de pepperoni picante sobre una base bien cargada de mozzarella.",
      ingredientes: ["Salsa de tomate", "Mozzarella", "Pepperoni picante"],
      alergenos: ["Gluten", "Lácteos"],
      precios: { pequeña: 8.5, mediana: 11, grande: 14 },
    },
  ],
  bebidas: [
    { id: "cocacola", nombre: "Coca-Cola", descripcion: "Lata de 33cl bien fría.", ingredientes: ["Agua carbonatada", "Azúcar", "Cafeína", "Extracto de cola"], alergenos: [], precio: 2 },
    { id: "agua", nombre: "Agua", descripcion: "Botella de agua mineral natural de 50cl.", ingredientes: ["Agua mineral natural"], alergenos: [], precio: 1.5 },
    { id: "cerveza", nombre: "Cerveza", descripcion: "Botellín de cerveza rubia de 33cl.", ingredientes: ["Agua", "Malta de cebada", "Lúpulo"], alergenos: ["Gluten"], precio: 2.5 },
  ],
  postres: [
    { id: "tiramisu", nombre: "Tiramisú", descripcion: "Receta italiana tradicional con café espresso y mascarpone.", ingredientes: ["Bizcocho de soletilla", "Café espresso", "Mascarpone", "Cacao en polvo", "Huevo"], alergenos: ["Gluten", "Lácteos", "Huevo"], precio: 4 },
    { id: "brownie", nombre: "Brownie", descripcion: "Brownie de chocolate negro templado con nueces.", ingredientes: ["Chocolate negro", "Mantequilla", "Huevo", "Nueces", "Harina"], alergenos: ["Gluten", "Lácteos", "Huevo", "Frutos secos"], precio: 3.5 },
  ],
};

// ---------- Iconos tipo "foto" (SVG inline, sin dependencias externas) ----------
const SHADOW = '<ellipse cx="50" cy="93" rx="32" ry="5" fill="#000" opacity=".1"/>';

function svgTag(inner) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${SHADOW}${inner}</svg>`;
}

function crust(baseColor) {
  return `<circle cx="50" cy="47" r="46" fill="#f3d9a4"/><circle cx="50" cy="47" r="39" fill="${baseColor}"/>`;
}

function mozzBlob(x, y, r) {
  const ry = (r || 6) * 0.72;
  return `<ellipse cx="${x}" cy="${y}" rx="${r || 6}" ry="${ry}" fill="#fff8ea"/>`;
}

function basilLeaf(x, y, rot) {
  return `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="2.6" fill="#4a7c3c" transform="rotate(${rot} ${x} ${y})"/>`;
}

function pepperoniDot(x, y) {
  return `<circle cx="${x}" cy="${y}" r="7" fill="#c23b2f"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#8f2318" stroke-width="1.3"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.4" fill="#8f2318" opacity=".5"/><circle cx="${x + 2}" cy="${y + 1.5}" r="1" fill="#8f2318" opacity=".4"/>`;
}

function pizzaSVG(id) {
  switch (id) {
    case "margarita":
      return svgTag(`
        ${crust("#c23b2f")}
        ${mozzBlob(34, 38, 7)}${mozzBlob(63, 34, 6)}${mozzBlob(58, 61, 7)}${mozzBlob(36, 63, 6)}${mozzBlob(48, 48, 5)}
        ${basilLeaf(45, 27, -20)}${basilLeaf(67, 52, 35)}${basilLeaf(29, 55, 60)}
      `);
    case "barbacoa":
      return svgTag(`
        ${crust("#e0a838")}
        <path d="M18,35 Q35,22 50,38 T82,32" stroke="#6b3d1f" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M20,60 Q38,50 55,62 T80,58" stroke="#6b3d1f" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
        <rect x="30" y="42" width="10" height="7" rx="2" fill="#7a4a28" transform="rotate(15 35 45)"/>
        <rect x="55" y="50" width="10" height="7" rx="2" fill="#7a4a28" transform="rotate(-10 60 53)"/>
        <rect x="42" y="65" width="9" height="6" rx="2" fill="#8f5a30" transform="rotate(25 46 68)"/>
        <rect x="60" y="30" width="9" height="6" rx="2" fill="#8f5a30" transform="rotate(-15 64 33)"/>
      `);
    case "cuatroquesos":
      return svgTag(`
        ${crust("#f5e6b8")}
        ${mozzBlob(38, 36, 7)}${mozzBlob(62, 42, 6)}
        <circle cx="55" cy="60" r="5" fill="#e0a838" opacity=".8"/>
        <circle cx="34" cy="58" r="4.5" fill="#e0a838" opacity=".8"/>
        <circle cx="45" cy="30" r="2" fill="#7ca77a"/><circle cx="49" cy="33" r="1.6" fill="#7ca77a"/>
        <circle cx="66" cy="60" r="2" fill="#7ca77a"/><circle cx="63" cy="64" r="1.6" fill="#7ca77a"/>
        <circle cx="48" cy="50" r="1.4" fill="#c9b25a"/><circle cx="52" cy="47" r="1.2" fill="#c9b25a"/>
      `);
    case "hawaiana":
      return svgTag(`
        ${crust("#c23b2f")}
        <rect x="28" y="36" width="14" height="7" rx="2.5" fill="#e79aa0" transform="rotate(-10 35 40)"/>
        <rect x="56" y="55" width="14" height="7" rx="2.5" fill="#e79aa0" transform="rotate(15 63 58)"/>
        <rect x="60" y="34" width="10" height="6" rx="2" fill="#e79aa0" transform="rotate(20 65 37)"/>
        <rect x="30" y="56" width="8" height="8" fill="#e8c93a" transform="rotate(45 34 60)"/>
        <rect x="44" y="52" width="8" height="8" fill="#e8c93a" transform="rotate(45 48 56)"/>
        <rect x="36" y="66" width="8" height="8" fill="#e8c93a" transform="rotate(45 40 70)"/>
        <rect x="58" y="66" width="8" height="8" fill="#e8c93a" transform="rotate(45 62 70)"/>
      `);
    case "pepperoni":
      return svgTag(`
        ${crust("#f0c94a")}
        ${pepperoniDot(36, 36)}${pepperoniDot(62, 34)}${pepperoniDot(50, 50)}${pepperoniDot(34, 60)}${pepperoniDot(64, 60)}${pepperoniDot(48, 68)}
      `);
    default:
      return svgTag(crust("#c23b2f"));
  }
}

function drinkSVG() {
  return svgTag(`
    <rect x="34" y="14" width="32" height="14" rx="4" fill="#5b4636"/>
    <rect x="34" y="14" width="32" height="5" rx="3" fill="#3f2f24"/>
    <path d="M38 28 L34 88 Q34 94 40 94 L60 94 Q66 94 66 88 L62 28 Z" fill="#7cc4d1"/>
    <path d="M41 40 L59 40 L57 58 L43 58 Z" fill="#ffffff" opacity=".3"/>
    <path d="M40 30 L38 88" stroke="#ffffff" stroke-width="2" opacity=".25" stroke-linecap="round"/>
  `);
}

function dessertSVG() {
  return svgTag(`
    <path d="M20 80 L50 18 L80 80 Z" fill="#c98a4b"/>
    <path d="M28 80 L50 34 L72 80 Z" fill="#dba05f"/>
    <rect x="14" y="80" width="72" height="9" rx="3" fill="#8a5a2b"/>
    <circle cx="50" cy="34" r="4.5" fill="#d94f30"/>
  `);
}

function menuToText() {
  const lines = [];
  lines.push("PIZZAS (precio pequeña/mediana/grande):");
  for (const p of MENU.pizzas) {
    lines.push(
      `- ${p.nombre} (${p.precios.pequeña}€/${p.precios.mediana}€/${p.precios.grande}€): ${p.descripcion} Ingredientes: ${p.ingredientes.join(", ")}. Alérgenos: ${p.alergenos.join(", ") || "ninguno"}.`
    );
  }
  lines.push("BEBIDAS:");
  for (const b of MENU.bebidas) {
    lines.push(`- ${b.nombre} (${b.precio}€): ${b.descripcion} Ingredientes: ${b.ingredientes.join(", ")}. Alérgenos: ${b.alergenos.join(", ") || "ninguno"}.`);
  }
  lines.push("POSTRES:");
  for (const d of MENU.postres) {
    lines.push(`- ${d.nombre} (${d.precio}€): ${d.descripcion} Ingredientes: ${d.ingredientes.join(", ")}. Alérgenos: ${d.alergenos.join(", ") || "ninguno"}.`);
  }
  return lines.join("\n");
}

const SYSTEM_PROMPT = `Eres Marco, el empleado que contesta el teléfono en la Pizzería Bella Napoli. Hablas español de forma natural, cercana y amable, como una persona real contestando el teléfono de un negocio, no como un asistente robótico.

Tu trabajo:
1. Saluda brevemente y pregunta en qué puedes ayudar.
2. Si el cliente pregunta por el menú, cuéntaselo de forma resumida y natural (no leas la lista entera de golpe salvo que te lo pidan).
3. Si el cliente pregunta por los ingredientes, la descripción o los alérgenos de un producto concreto, respóndele con esa información exacta (la tienes en el menú de abajo). No la inventes ni la generalices.
4. Cada vez que menciones un producto concreto porque el cliente pregunta por él o lo está pidiendo, llama a la función mostrar_producto con su nombre exacto para resaltarlo en pantalla.
5. Toma el pedido: qué productos, tamaño (para pizzas), y cantidad de cada uno.
6. Cada vez que el cliente añada, quite o cambie un producto, llama INMEDIATAMENTE a la función actualizar_carrito con el estado completo y actual del carrito (todos los productos, no solo el último). Esto es muy importante: hazlo en cuanto quede claro un producto nuevo, no esperes a tener todo el pedido cerrado.
7. Pregunta el nombre del cliente, teléfono de contacto y la dirección de entrega COMPLETA: calle, número, piso/puerta si aplica, y ciudad. Pide el código postal si el cliente lo sabe.
8. Antes de cerrar, repite el pedido completo y la dirección en voz alta para que el cliente lo confirme.
9. Cuando el cliente confirme que todo es correcto, llama a la función guardar_pedido con los datos exactos y completos del pedido confirmado (productos, cliente, teléfono, dirección estructurada).
10. Después de guardar el pedido, agradece la llamada y despídete con un tiempo estimado de entrega razonable (25-40 minutos).

Reglas:
- No inventes productos, ingredientes o alérgenos que no estén en el menú.
- Si piden algo que no existe, dilo amablemente y sugiere una alternativa del menú.
- Sé breve en tus respuestas, como en una llamada real (frases cortas).
- Llama a mostrar_producto cada vez que la conversación se centre en un producto concreto.
- Llama a actualizar_carrito cada vez que cambie el contenido del carrito durante la conversación.
- Llama a guardar_pedido una sola vez, al final, cuando el pedido y la dirección estén confirmados por el cliente.

MENÚ:
${menuToText()}`;

const PRODUCTO_ITEM_SCHEMA = {
  type: "OBJECT",
  properties: {
    nombre: { type: "STRING", description: "Nombre del producto, tal como aparece en el menú" },
    tamaño: { type: "STRING", description: "Tamaño si aplica (pequeña/mediana/grande)" },
    cantidad: { type: "NUMBER", description: "Cantidad pedida" },
  },
  required: ["nombre", "cantidad"],
};

const DIRECCION_SCHEMA = {
  type: "OBJECT",
  properties: {
    calle: { type: "STRING" },
    numero: { type: "STRING" },
    piso: { type: "STRING", description: "Piso/puerta, opcional" },
    ciudad: { type: "STRING" },
    codigo_postal: { type: "STRING", description: "Opcional si el cliente no lo sabe" },
  },
  required: ["calle", "numero", "ciudad"],
};

const HIGHLIGHT_FUNCTION = {
  name: "mostrar_producto",
  description:
    "Resalta visualmente en pantalla el producto del que se está hablando en este momento (el cliente pregunta por él o se está añadiendo al pedido). Llámala con el nombre exacto del producto tal como aparece en el menú.",
  parameters: {
    type: "OBJECT",
    properties: {
      nombre: { type: "STRING", description: "Nombre exacto del producto del menú" },
    },
    required: ["nombre"],
  },
};

const CART_FUNCTION = {
  name: "actualizar_carrito",
  description:
    "Actualiza el carrito EN VIVO cada vez que se añade, quita o cambia un producto durante la llamada, incluso antes de confirmar el pedido final. Debe llamarse con el estado completo y actual del carrito cada vez.",
  parameters: {
    type: "OBJECT",
    properties: {
      productos: { type: "ARRAY", description: "Todos los productos actuales en el carrito", items: PRODUCTO_ITEM_SCHEMA },
    },
    required: ["productos"],
  },
};

const ORDER_FUNCTION = {
  name: "guardar_pedido",
  description: "Guarda el pedido final ya confirmado en voz por el cliente, con sus datos completos de entrega.",
  parameters: {
    type: "OBJECT",
    properties: {
      productos: { type: "ARRAY", description: "Lista final de productos pedidos", items: PRODUCTO_ITEM_SCHEMA },
      nombre_cliente: { type: "STRING" },
      telefono: { type: "STRING" },
      direccion: DIRECCION_SCHEMA,
      notas: { type: "STRING", description: "Notas adicionales, alergias, indicaciones, etc." },
    },
    required: ["productos", "nombre_cliente", "telefono", "direccion"],
  },
};

// ---------- DOM ----------
const el = {
  apiKey: document.getElementById("apiKey"),
  saveKey: document.getElementById("saveKey"),
  callBtn: document.getElementById("callBtn"),
  callFabLabel: document.getElementById("callFabLabel"),
  hangupBtn: document.getElementById("hangupBtn"),
  status: document.getElementById("status"),
  transcript: document.getElementById("transcript"),
  orderBox: document.getElementById("orderBox"),
  menuBox: document.getElementById("menuBox"),
  modalOverlay: document.getElementById("productModal"),
  modalCard: document.getElementById("modalCard"),
};

const cardEls = new Map();

function menuCard(item, categoria, svg) {
  const card = document.createElement("div");
  card.className = "menu-card";
  card.dataset.id = item.id;
  const priceLabel = categoria === "pizza" ? `${item.precios.pequeña}–${item.precios.grande}€` : `${item.precio}€`;
  card.innerHTML = `<div class="menu-photo">${svg}</div><div class="menu-name">${item.nombre}</div><div class="menu-price">${priceLabel}</div>`;
  card.addEventListener("click", () => openProductModal(item, categoria, svg));
  cardEls.set(item.id, card);
  return card;
}

function renderMenu() {
  const box = el.menuBox;
  box.innerHTML = "";
  cardEls.clear();
  for (const p of MENU.pizzas) box.appendChild(menuCard(p, "pizza", pizzaSVG(p.id)));
  for (const b of MENU.bebidas) box.appendChild(menuCard(b, "bebida", drinkSVG()));
  for (const d of MENU.postres) box.appendChild(menuCard(d, "postre", dessertSVG()));
}
renderMenu();

// ---------- Ficha de producto ----------
function openProductModal(item, categoria, svg) {
  const priceLabel =
    categoria === "pizza" ? `${item.precios.pequeña}€ / ${item.precios.mediana}€ / ${item.precios.grande}€` : `${item.precio}€`;
  el.modalCard.innerHTML = `
    <button class="modal-close" aria-label="Cerrar">✕</button>
    <div class="modal-photo">${svg}</div>
    <h3>${item.nombre}</h3>
    <p class="modal-desc">${item.descripcion}</p>
    <div class="modal-section">
      <h4>Ingredientes</h4>
      <ul>${item.ingredientes.map((i) => `<li>${i}</li>`).join("")}</ul>
    </div>
    ${item.alergenos.length ? `<div class="modal-allergens">⚠️ Alérgenos: ${item.alergenos.join(", ")}</div>` : ""}
    <div class="modal-price">${priceLabel}</div>
  `;
  el.modalCard.querySelector(".modal-close").addEventListener("click", closeProductModal);
  el.modalOverlay.classList.remove("hidden");
}

function closeProductModal() {
  el.modalOverlay.classList.add("hidden");
}

el.modalOverlay.addEventListener("click", (e) => {
  if (e.target === el.modalOverlay) closeProductModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProductModal();
});

function highlightProduct(nombre) {
  const target = [...cardEls.values()].find(
    (c) => c.querySelector(".menu-name").textContent.toLowerCase() === (nombre || "").toLowerCase()
  );
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  target.classList.remove("highlight");
  void target.offsetWidth;
  target.classList.add("highlight");
  clearTimeout(target._highlightTimeout);
  target._highlightTimeout = setTimeout(() => target.classList.remove("highlight"), 1800);
}

function priceFor(nombre, tamaño) {
  const pizza = MENU.pizzas.find((p) => p.nombre.toLowerCase() === (nombre || "").toLowerCase());
  if (pizza) {
    const size = (tamaño || "mediana").toLowerCase();
    return pizza.precios[size] ?? pizza.precios.mediana;
  }
  const otro = [...MENU.bebidas, ...MENU.postres].find((x) => x.nombre.toLowerCase() === (nombre || "").toLowerCase());
  return otro ? otro.precio : 0;
}

// ---------- API key ----------
const savedKey = localStorage.getItem("gemini_api_key");
if (savedKey) el.apiKey.value = savedKey;

el.saveKey.addEventListener("click", () => {
  localStorage.setItem("gemini_api_key", el.apiKey.value.trim());
  setStatus("API key guardada", "");
});

// ---------- Estado de la llamada ----------
let ai = null;
let session = null;
let isCalling = false;

let micStream = null;
let micContext = null;
let micProcessor = null;
let micSource = null;
let micSilentGain = null;

let playbackCtx = null;
let nextStartTime = 0;
let activeSources = [];

let currentUserBubble = null;
let currentBotBubble = null;

const CALL_FAB_LABELS = {
  connecting: "Llamando…",
  connected: "En llamada",
};

function setStatus(text, cls) {
  el.status.textContent = text;
  el.status.className = "status" + (cls ? " " + cls : "");
  el.callBtn.classList.remove("connecting", "connected");
  if (cls === "connecting") el.callBtn.classList.add("connecting");
  if (cls === "connected") el.callBtn.classList.add("connected");
  el.callFabLabel.textContent = CALL_FAB_LABELS[cls] || "Iniciar llamada";
}

function clearPlaceholder(container) {
  const ph = container.querySelector(".placeholder");
  if (ph) ph.remove();
}

function appendTranscript(who, text) {
  clearPlaceholder(el.transcript);
  if (who === "user") {
    if (!currentUserBubble) {
      currentBotBubble = null;
      currentUserBubble = document.createElement("div");
      currentUserBubble.className = "turn user";
      currentUserBubble.innerHTML = '<div class="who">Cliente</div><p></p>';
      el.transcript.appendChild(currentUserBubble);
    }
    currentUserBubble.querySelector("p").textContent += text;
  } else {
    if (!currentBotBubble) {
      currentUserBubble = null;
      currentBotBubble = document.createElement("div");
      currentBotBubble.className = "turn bot";
      currentBotBubble.innerHTML = '<div class="who">Marco (pizzería)</div><p></p>';
      el.transcript.appendChild(currentBotBubble);
    }
    currentBotBubble.querySelector("p").textContent += text;
  }
  el.transcript.scrollTop = el.transcript.scrollHeight;
}

function finalizeTurn() {
  currentUserBubble = null;
  currentBotBubble = null;
}

function renderCart(productos, cliente, confirmado) {
  clearPlaceholder(el.orderBox);

  let rows = "";
  let total = 0;
  for (const p of productos || []) {
    const price = priceFor(p.nombre, p.tamaño);
    const subtotal = price * (p.cantidad || 1);
    total += subtotal;
    rows += `<tr><td>${p.cantidad}x</td><td>${p.nombre}${p.tamaño ? " (" + p.tamaño + ")" : ""}</td><td>${subtotal.toFixed(2)}€</td></tr>`;
  }

  const badge = confirmado
    ? '<span class="badge confirmed">✅ Pedido confirmado</span>'
    : '<span class="badge pending">🛒 Pedido en curso…</span>';

  let clienteHtml = "";
  if (cliente) {
    const d = cliente.direccion || {};
    const direccionStr = [d.calle && d.numero ? `${d.calle} ${d.numero}` : d.calle, d.piso, d.ciudad, d.codigo_postal]
      .filter(Boolean)
      .join(", ");
    clienteHtml = `
      <div class="field"><b>Cliente:</b> ${cliente.nombre_cliente || "-"}</div>
      <div class="field"><b>Teléfono:</b> ${cliente.telefono || "-"}</div>
      <div class="field"><b>Dirección:</b> ${direccionStr || "-"}</div>
      ${cliente.notas ? `<div class="field"><b>Notas:</b> ${cliente.notas}</div>` : ""}
    `;
  }

  el.orderBox.innerHTML = `
    ${badge}
    <table>
      <thead><tr><th>Cant.</th><th>Producto</th><th>Precio</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="3" class="placeholder">Carrito vacío</td></tr>'}</tbody>
      <tfoot><tr><td colspan="2"><b>Total</b></td><td><b>${total.toFixed(2)}€</b></td></tr></tfoot>
    </table>
    ${clienteHtml}
  `;
}

// ---------- Audio helpers ----------
function resampleTo16k(buffer, inputSampleRate) {
  if (inputSampleRate === 16000) return buffer;
  const ratio = inputSampleRate / 16000;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(i0 + 1, buffer.length - 1);
    const frac = srcIndex - i0;
    result[i] = buffer[i0] + (buffer[i1] - buffer[i0]) * frac;
  }
  return result;
}

function floatTo16BitPCM(float32Array) {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function startMic() {
  micStream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
  });
  micContext = new AudioContext();
  micSource = micContext.createMediaStreamSource(micStream);
  micProcessor = micContext.createScriptProcessor(4096, 1, 1);
  const inRate = micContext.sampleRate;

  micProcessor.onaudioprocess = (e) => {
    if (!isCalling || !session) return;
    const input = e.inputBuffer.getChannelData(0);
    const resampled = resampleTo16k(input, inRate);
    const int16 = floatTo16BitPCM(resampled);
    const base64 = arrayBufferToBase64(int16.buffer);
    session.sendRealtimeInput({ audio: { data: base64, mimeType: "audio/pcm;rate=16000" } });
  };

  micSilentGain = micContext.createGain();
  micSilentGain.gain.value = 0;
  micSource.connect(micProcessor);
  micProcessor.connect(micSilentGain);
  micSilentGain.connect(micContext.destination);
}

function stopMic() {
  if (micProcessor) micProcessor.disconnect();
  if (micSource) micSource.disconnect();
  if (micSilentGain) micSilentGain.disconnect();
  if (micStream) micStream.getTracks().forEach((t) => t.stop());
  if (micContext) micContext.close();
  micProcessor = micSource = micSilentGain = micStream = micContext = null;
}

function ensurePlaybackCtx() {
  if (!playbackCtx) {
    playbackCtx = new AudioContext();
    nextStartTime = 0;
  }
}

function enqueueAudio(base64) {
  ensurePlaybackCtx();
  const bytes = base64ToArrayBuffer(base64);
  const int16 = new Int16Array(bytes);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 0x8000;

  const buffer = playbackCtx.createBuffer(1, float32.length, 24000);
  buffer.copyToChannel(float32, 0);

  const source = playbackCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(playbackCtx.destination);

  const now = playbackCtx.currentTime;
  const startAt = Math.max(now, nextStartTime);
  source.start(startAt);
  nextStartTime = startAt + buffer.duration;
  activeSources.push(source);
  source.onended = () => {
    activeSources = activeSources.filter((s) => s !== source);
  };
}

function stopPlaybackQueue() {
  for (const s of activeSources) {
    try {
      s.stop();
    } catch (e) {
      /* already stopped */
    }
  }
  activeSources = [];
  if (playbackCtx) nextStartTime = playbackCtx.currentTime;
}

// ---------- Tono de llamada (ringback) ----------
// Suena mientras se establece la conexión, como el "brr-brr" que oyes al
// llamar por teléfono antes de que contesten. Se para en cuanto conecta,
// falla o se cuelga.
let ringbackCtx = null;
let ringbackTimer = null;

function playRingBurst() {
  if (!ringbackCtx) return;
  const t0 = ringbackCtx.currentTime;
  // Cadencia clásica "brr-brr": dos pulsos cortos de tono dual (440+480Hz)
  [0, 0.45].forEach((offset) => {
    const gain = ringbackCtx.createGain();
    gain.connect(ringbackCtx.destination);
    gain.gain.setValueAtTime(0, t0 + offset);
    gain.gain.linearRampToValueAtTime(0.12, t0 + offset + 0.04);
    gain.gain.setValueAtTime(0.12, t0 + offset + 0.32);
    gain.gain.linearRampToValueAtTime(0, t0 + offset + 0.38);

    for (const freq of [440, 480]) {
      const osc = ringbackCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(t0 + offset);
      osc.stop(t0 + offset + 0.4);
    }
  });
}

function startRingback() {
  stopRingback();
  ringbackCtx = new AudioContext();
  playRingBurst();
  ringbackTimer = setInterval(playRingBurst, 3000);
}

function stopRingback() {
  if (ringbackTimer) {
    clearInterval(ringbackTimer);
    ringbackTimer = null;
  }
  if (ringbackCtx) {
    ringbackCtx.close();
    ringbackCtx = null;
  }
}

// ---------- Gemini Live ----------
function handleToolCall(toolCall) {
  const functionResponses = [];
  for (const fc of toolCall.functionCalls) {
    if (fc.name === "mostrar_producto") {
      highlightProduct(fc.args.nombre);
      functionResponses.push({ id: fc.id, name: fc.name, response: { result: "ok" } });
    } else if (fc.name === "actualizar_carrito") {
      renderCart(fc.args.productos, null, false);
      functionResponses.push({ id: fc.id, name: fc.name, response: { result: "ok" } });
    } else if (fc.name === "guardar_pedido") {
      renderCart(fc.args.productos, fc.args, true);
      functionResponses.push({ id: fc.id, name: fc.name, response: { result: "ok" } });
    } else {
      functionResponses.push({ id: fc.id, name: fc.name, response: { result: "unknown_function" } });
    }
  }
  session.sendToolResponse({ functionResponses });
}

function onMessage(message) {
  const sc = message.serverContent;

  if (message.toolCall) {
    handleToolCall(message.toolCall);
  }

  if (!sc) return;

  if (sc.interrupted) stopPlaybackQueue();

  if (sc.modelTurn && sc.modelTurn.parts) {
    for (const part of sc.modelTurn.parts) {
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith("audio/")) {
        enqueueAudio(part.inlineData.data);
      }
    }
  }

  if (sc.inputTranscription && sc.inputTranscription.text) {
    appendTranscript("user", sc.inputTranscription.text);
  }
  if (sc.outputTranscription && sc.outputTranscription.text) {
    appendTranscript("bot", sc.outputTranscription.text);
  }
  if (sc.turnComplete) finalizeTurn();
}

async function startCall() {
  const apiKey = el.apiKey.value.trim() || localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    setStatus("Falta la API key", "error");
    return;
  }
  localStorage.setItem("gemini_api_key", apiKey);

  el.callBtn.disabled = true;
  setStatus("Conectando...", "connecting");
  startRingback();

  ai = new GoogleGenAI({ apiKey });

  const config = {
    responseModalities: [Modality.AUDIO],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
    tools: [{ functionDeclarations: [HIGHLIGHT_FUNCTION, CART_FUNCTION, ORDER_FUNCTION] }],
  };

  try {
    session = await ai.live.connect({
      model: MODEL,
      config,
      callbacks: {
        onopen: async () => {
          stopRingback();
          isCalling = true;
          setStatus("Llamada en curso — habla cuando quieras", "connected");
          el.hangupBtn.disabled = false;
          await startMic();
        },
        onmessage: onMessage,
        onerror: (e) => {
          console.error("Live API error:", e);
          stopRingback();
          setStatus("Error: " + (e && e.message ? e.message : "conexión fallida"), "error");
          endCall();
        },
        onclose: () => {
          stopRingback();
          setStatus("Desconectado", "");
          endCall();
        },
      },
    });
  } catch (err) {
    console.error(err);
    stopRingback();
    setStatus("No se pudo conectar: " + err.message, "error");
    el.callBtn.disabled = false;
  }
}

function endCall() {
  isCalling = false;
  stopRingback();
  stopMic();
  stopPlaybackQueue();
  el.callBtn.disabled = false;
  el.hangupBtn.disabled = true;
  finalizeTurn();
  if (session) {
    try {
      session.close();
    } catch (e) {
      /* already closed */
    }
  }
  session = null;
}

el.callBtn.addEventListener("click", startCall);
el.hangupBtn.addEventListener("click", () => {
  setStatus("Desconectado", "");
  endCall();
});
