// simple-mode.js — Modo simple / normal (SCRUM-26 / US12)
// Reemplaza el detalle por una vista simplificada (service.simple).
// Observa el contenedor: si detail.js vuelve a renderizar, reaplica el modo simple.
(function () {
  const KEY = "cercared_simple_mode";
  const root = document.documentElement;
  const isOn = () => localStorage.getItem(KEY) === "on";

  function getMain() {
    return (
      document.querySelector(".detail-main") ||
      document.querySelector("#service-detail") ||
      document.querySelector("main")
    );
  }

  function currentService() {
    const id = new URLSearchParams(location.search).get("id");
    const list = window.CercaRedServices || [];
    return list.find((s) => s.id === id) || list[0] || null;
  }

  function banner(show, mode) {
    let b = document.querySelector("#simple-mode-banner");
    if (show && !b) {
      b = document.createElement("div");
      b.id = "simple-mode-banner";
      b.className = "simple-mode-banner";
      b.setAttribute("role", "status");
      const header = document.querySelector(".site-header") || document.querySelector("header");
      if (header) header.insertAdjacentElement("afterend", b);
      else document.body.prepend(b);
    }
    if (b) {
      b.classList.toggle("is-warning", mode === "warn");
      const eye = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"/></svg>';
      b.innerHTML = eye + (mode === "warn"
        ? "<span><strong>Modo simple no disponible</strong> — La vista simplificada no está disponible para esta página.</span>"
        : "<span><strong>Modo simple activado</strong> — Vista simplificada con texto más grande y solo lo esencial.</span>");
    }
    if (!show && b) b.remove();
  }

  function simpleHTML(s) {
    const d = s.simple;
    const facts = d.facts.map((f) =>
      `<div class="s-fact"><span class="s-fact-label">${f.label}</span><span class="s-fact-value${f.highlight ? " s-ok" : ""}">${f.value}</span></div>`).join("");
    const needs = d.needs.map((n) => `<li>${n}</li>`).join("");
    const steps = d.doSteps.map((p, i) =>
      `<li><span class="s-step-num${i === d.doSteps.length - 1 ? " s-step-last" : ""}">${i + 1}</span><span>${p}</span></li>`).join("");
    const places = d.places.map((p) =>
      `<div class="s-place"><strong>${p.title}</strong><span>${p.description}</span></div>`).join("");
    return `
      <div class="simple-view">
        <nav class="simple-crumbs"><a href="index.html">Catálogo</a> → <span>${s.name}</span></nav>
        <h1 class="simple-title">${s.name}</h1>
        <section class="s-about"><h2>¿De qué trata este servicio?</h2><p>${d.about}</p></section>
        <section class="s-card"><h2>Datos del servicio</h2><div class="s-facts">${facts}</div></section>
        <section class="s-card"><h2>¿Qué necesito?</h2><ul class="s-needs">${needs}</ul></section>
        <section class="s-card"><h2>¿Qué tengo que hacer?</h2><ol class="s-steps">${steps}</ol></section>
        <section class="s-card">
          <h2>¿Dónde me atienden?</h2>
          <label class="s-select"><span class="visually-hidden">Elige tu distrito</span><select><option>Elige tu distrito</option></select></label>
          ${places}
          <a class="s-official" href="${s.officialUrl}" target="_blank" rel="noreferrer">Ir al canal oficial →</a>
          <button class="s-summary summary-button" type="button">Generar resumen para compartir</button>
        </section>
      </div>`;
  }

  let applying = false; // evita bucles cuando nosotros mismos modificamos el main

  function render() {
    const on = isOn();
    root.classList.toggle("simple-mode", on);
    document.querySelectorAll(".simple-mode-button").forEach((b) => {
      b.textContent = on ? "Modo normal" : "Modo simple";
      b.setAttribute("aria-pressed", String(on));
    });

    const main = getMain();
    if (!main) { banner(on); return; }

    if (on) {
      const service = currentService();
      if (!service || !service.simple) { banner(true, "warn"); return; }
      // Solo reemplaza si aún no está la vista simple (evita reescribir en bucle)
      if (!main.querySelector(".simple-view")) {
        applying = true;
        main.innerHTML = simpleHTML(service);
        applying = false;
      }
      banner(true);
    } else {
      banner(false);
      // si quedó la vista simple puesta, recargamos para restaurar el detalle normal
      if (main.querySelector(".simple-view")) location.reload();
    }
  }

  function toggle() {
    localStorage.setItem(KEY, isOn() ? "off" : "on");
    if (!isOn()) { location.reload(); return; } // al apagar, recarga para traer el detalle normal
    render();
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".simple-mode-button")) toggle();
  });

  // Observa el contenedor: si detail.js lo re-renderiza, reaplicamos el modo simple.
  function watch() {
    const main = getMain();
    if (!main) return;
    const obs = new MutationObserver(() => {
      if (applying) return;
      if (isOn() && !main.querySelector(".simple-view")) render();
    });
    obs.observe(main, { childList: true });
  }

  function init() { render(); watch(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
