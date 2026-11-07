/* =========================================================
   VYC Soluciones Auditivas - Funciones de la página
   =========================================================

   ✏️ ✏️ ✏️  ZONA DE CONFIGURACIÓN: SOLO TENÉS QUE TOCAR ESTO  ✏️ ✏️ ✏️
*/
const CONFIG = {
  // Tu número de WhatsApp: código de país + código de área + número.
  // SIN el signo +, SIN espacios, SIN guiones, SIN el 0 ni el 15.
  // Ejemplo Argentina (celular): 54 + 9 + 351 + 1234567  ->  "5493511234567"
  whatsapp: "5491167088506",

  // Mensaje que aparece escrito cuando el cliente abre el chat
  mensajeWhatsapp: "Hola VYC Soluciones Auditivas, quisiera hacer una consulta.",

  // El correo donde querés recibir los mensajes del formulario
  email: "fedealoy6@gmail.com"
};
/* ✏️ ✏️ ✏️  FIN DE LA ZONA DE CONFIGURACIÓN  ✏️ ✏️ ✏️
   (De acá para abajo no hace falta modificar nada) */


// Arma un link de WhatsApp con un mensaje
function linkWhatsapp(texto) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
}

// 1) Botón flotante de WhatsApp
document.getElementById("whatsappFlotante").href = linkWhatsapp(CONFIG.mensajeWhatsapp);

// 2) Botones "Consultar" del catálogo: abren WhatsApp con el modelo escrito
document.querySelectorAll(".consultar").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const modelo = boton.dataset.modelo;
    window.open(linkWhatsapp("Hola VYC, quisiera información sobre el audífono " + modelo + "."), "_blank", "noopener");
  });
});

// 3) Menú para celulares (botón de tres rayitas)
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", function () {
  const abierto = menu.classList.toggle("abierto");
  menuBtn.setAttribute("aria-expanded", abierto);
  menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});
// Cierra el menú al tocar una opción
menu.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    menu.classList.remove("abierto");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// 4) Sombra en el menú al bajar
const header = document.getElementById("header");
window.addEventListener("scroll", function () {
  header.classList.toggle("con-sombra", window.scrollY > 10);
});

// 5) Filtros del catálogo
const filtros = document.querySelectorAll(".filtro");
const productos = document.querySelectorAll(".producto");
filtros.forEach(function (filtro) {
  filtro.addEventListener("click", function () {
    filtros.forEach(function (f) { f.classList.remove("activo"); });
    filtro.classList.add("activo");
    const elegido = filtro.dataset.filtro;
    productos.forEach(function (p) {
      const tipos = p.dataset.tipo.split(" ");
      p.classList.toggle("oculto", elegido !== "todos" && !tipos.includes(elegido));
    });
  });
});

// 6) Formulario de contacto (se envía a tu email con FormSubmit, gratis)
const formulario = document.getElementById("formulario");
const estado = document.getElementById("formEstado");
const botonEnviar = document.getElementById("botonEnviar");

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  estado.className = "form-estado";

  // Revisa que los campos obligatorios estén completos
  let valido = true;
  formulario.querySelectorAll("[required]").forEach(function (campo) {
    const ok = campo.checkValidity() && campo.value.trim() !== "";
    campo.classList.toggle("error", !ok);
    if (!ok) valido = false;
  });
  if (!valido) {
    estado.textContent = "Por favor, completá todos los campos correctamente.";
    estado.classList.add("mal");
    return;
  }

  // Envía los datos
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";
  const datos = Object.fromEntries(new FormData(formulario).entries());

  try {
    const respuesta = await fetch("https://formsubmit.co/ajax/" + CONFIG.email, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(datos)
    });
    if (!respuesta.ok) throw new Error("Error de envío");
    estado.textContent = "¡Gracias! Recibimos tu consulta y te responderemos pronto.";
    estado.classList.add("ok");
    formulario.reset();
  } catch (error) {
    estado.textContent = "No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.";
    estado.classList.add("mal");
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar consulta";
  }
});

// 7) Año actual en el pie de página
document.getElementById("anio").textContent = new Date().getFullYear();

// 8) Animación suave de las tarjetas al aparecer en pantalla
if ("IntersectionObserver" in window) {
  const elementos = document.querySelectorAll(".tarjeta, .producto, .valor, .pasos li");
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });
  elementos.forEach(function (el) {
    el.classList.add("aparecer");
    observador.observe(el);
  });
}
