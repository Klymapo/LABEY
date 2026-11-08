
"use strict";
// Menú independiente: no modifica los parámetros de física ni las hojas V3.
(() => {
  const screen = document.getElementById("mainMenu");
  const buttons = document.getElementById("menuButtons");
  const options = document.getElementById("menuOptions");
  const continueBtn = document.getElementById("menuContinue");
  const startBtn = document.getElementById("menuStart");
  const settingsBtn = document.getElementById("menuSettings");
  const controlsBtn = document.getElementById("menuControlsSetting");
  const backBtn = document.getElementById("menuOptionsBack");
  const returnBtn = document.getElementById("menuReturn");
  const SAVE_KEY = "labey.demoPosition.v2";
  let open = true;
  let elapsed = 0;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (value && value.version === 2 && Number.isFinite(value.x) &&
          Number.isFinite(value.y) && Number.isFinite(value.facing) &&
          value.x >= 0 && value.x <= 864 && value.y >= 0 && value.y <= 1536) return value;
    } catch { /* Almacenamiento no disponible: la demo sigue funcionando. */ }
    return null;
  }
  function save() {
    if (open || screenWidth <= 0 || screenHeight <= 0) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        version: 2,
        x: player.x,
        y: player.y,
        facing: player.facing,
        hasSword: window.labeyCalibration?.hasSword === true,
        firstKill: window.labeyCalibration?.firstKill === true
      }));
    } catch { /* La persistencia es opcional para este prototipo. */ }
  }
  function refresh() {
    const hasSave = !!read();
    continueBtn.hidden = !hasSave;
    startBtn.textContent = hasSave ? "NUEVA PARTIDA" : "JUGAR";
    controlsBtn.textContent = "CONTROLES TÁCTILES: " + (touchControls.hidden ? "NO" : "SÍ");
  }
  function showButtons() {
    options.hidden = true;
    buttons.hidden = false;
    refresh();
    (continueBtn.hidden ? startBtn : continueBtn).focus();
  }
  function close() {
    open = false;
    screen.hidden = true;
    document.body.classList.remove("menu-open");
    previousTime = 0;
    elapsed = 0;
    returnBtn.blur();
  }
  function show() {
    if (open) return;
    save();
    cancelInputs();
    open = true;
    screen.hidden = false;
    document.body.classList.add("menu-open");
    showButtons();
  }
  startBtn.addEventListener("click", () => {
    if (read() && !window.confirm("¿Iniciar una partida nueva? Se reemplazará la posición guardada de la demo.")) return;
    resetPlayer();
    close();
    save();
  });
  continueBtn.addEventListener("click", () => {
    const saved = read();
    if (!saved) { refresh(); return; }
    resetPlayer();
    const safe = getSafeSpawn(saved.x, saved.y);
    player.x = safe.x;
    player.y = safe.y;
    player.facing = saved.facing;
    window.labeyCalibration?.restore(saved);
    close();
  });
  settingsBtn.addEventListener("click", () => {
    buttons.hidden = true;
    options.hidden = false;
    refresh();
    controlsBtn.focus();
  });
  controlsBtn.addEventListener("click", () => { toggleTouchControls(); refresh(); });
  backBtn.addEventListener("click", showButtons);
  returnBtn.addEventListener("click", show);
  refresh();
  window.labeyMenu = {
    isOpen: () => open,
    show,
    save,
    escape: () => { if (open) { if (!options.hidden) showButtons(); } else show(); },
    tick: dt => { elapsed += dt; if (elapsed >= 5) { elapsed = 0; save(); } }
  };
})();
