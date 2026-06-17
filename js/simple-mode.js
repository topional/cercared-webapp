(function () {
  const KEY = "cercared_simple_mode";
  const root = document.documentElement;
  const isOn = () => localStorage.getItem(KEY) === "on";

  function banner(show) {
    let b = document.querySelector("#simple-mode-banner");
    if (show && !b) {
      b = document.createElement("div");
      b.id = "simple-mode-banner";
      b.className = "simple-mode-banner";
      b.setAttribute("role", "status");
      b.innerHTML =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z"/></svg>' +
        '<span><strong>Modo simple activado</strong> — Vista simplificada con texto más grande y solo lo esencial.</span>';
      const header = document.querySelector(".site-header");
      if (header) header.insertAdjacentElement("afterend", b);
      else document.body.prepend(b);
    } else if (!show && b) {
      b.remove();
    }
  }

  function apply(on) {
    root.classList.toggle("simple-mode", on);
    document.querySelectorAll(".simple-mode-button").forEach((btn) => {
      btn.textContent = on ? "Modo normal" : "Modo simple";
      btn.setAttribute("aria-pressed", String(on));
    });
    banner(on);
  }

  function toggle() {
    const on = !isOn();
    localStorage.setItem(KEY, on ? "on" : "off");
    apply(on);
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".simple-mode-button")) toggle();
  });

  apply(isOn());
  document.addEventListener("DOMContentLoaded", () => apply(isOn()));
})();