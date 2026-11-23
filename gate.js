// This file is the arcade's password screen. The home page and every game load
// it with one line near the top of the page. It covers the page until someone
// types the password. The browser then remembers the password, so each
// device only asks once.
//
// This is a "please knock" sign, not a lock. Anyone who reads the page code can
// get past it. It keeps out casual visitors and search engines.
//
// The password itself never appears here. Only a scrambled copy of it does.
// Claude can make a new PASSWORD_HASH below when the password needs to change.

(function () {
  // This is the password after scrambling with SHA-256 (a one-way
  // scrambler built into browsers). The SALT is extra text mixed in first so
  // the scrambled copy can't be looked up in a table of common passwords.
  var SALT = "mfp-arcade:";
  var PASSWORD_HASH = "bfed218da355d62626d39a5790fd14ed2b10d5d63efee32c834a8e937d7e90d9";

  // This key holds the scrambled password once someone gets in. Every game
  // shares it, so one correct entry unlocks the whole arcade on that device.
  var STORAGE_KEY = "arcade-unlocked";

  // The scrambler only runs on secure pages (https and localhost). A game
  // opened some other way skips the screen so it still works.
  if (!window.crypto || !window.crypto.subtle) return;

  try {
    if (localStorage.getItem(STORAGE_KEY) === PASSWORD_HASH) return;
  } catch (e) {
    // Some private windows block storage. Those visitors just get asked again.
  }

  var root = document.documentElement;
  root.classList.add("arcade-locked");

  // The page underneath is hidden but keeps its size. Games that measure the
  // screen when they load still get the right numbers.
  // Every rule starts with #arcade-gate so a game's own button and text styles
  // can't change how the password screen looks.
  // The fonts and the player sprite sit next to gate.js at the top of the
  // site. Games load gate.js from deeper folders, so this works out where
  // those files are from gate.js's own address.
  var script = document.currentScript;
  var base = script && script.src ? new URL(".", script.src).href : "./";

  // The look matches the arcade home page: a plain night-blue background, the
  // pixel font title with a pink shadow, the cheering player, and a pink
  // sticker button.
  var style = document.createElement("style");
  style.textContent =
    "@font-face{font-family:'Press Start 2P';src:url('" + base + "fonts/press-start-2p.woff2') format('woff2');font-display:swap}" +
    "@font-face{font-family:'Nunito';src:url('" + base + "fonts/nunito.woff2') format('woff2');font-weight:200 1000;font-display:swap}" +
    "html.arcade-locked{overflow:hidden}" +
    "html.arcade-locked body{visibility:hidden}" +
    "#arcade-gate{--g-bg:#14123A;--g-text:#fff;--g-muted:#b9b4e8;--g-pink:#FF3CAC;--g-cyan:#00E5FF;--g-lime:#B6FF3B;" +
    "--g-pixel:'Press Start 2P',ui-monospace,monospace;--g-soft:'Nunito',system-ui,-apple-system,sans-serif;" +
    "color-scheme:dark;visibility:visible;position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;" +
    "padding:16px;box-sizing:border-box;color:var(--g-text);font:16px/1.5 var(--g-soft);user-select:text;-webkit-user-select:text;touch-action:auto;" +
    "background:var(--g-bg)}" +
    "#arcade-gate *{box-sizing:border-box}" +
    "#arcade-gate form{width:100%;max-width:360px;margin:0;padding:0;text-align:left}" +
    "#arcade-gate .gate-hero{display:flex;align-items:center;justify-content:center;gap:12px;margin:0 0 28px}" +
    "#arcade-gate h1{margin:0;font:400 clamp(1.25rem,6vw,2.25rem)/1.4 var(--g-pixel);color:var(--g-text);text-shadow:3px 3px 0 var(--g-pink);text-align:left}" +
    "#arcade-gate .gate-mascot{width:80px;height:80px;flex:none;image-rendering:pixelated}" +
    "#arcade-gate p{margin:0 0 18px;color:var(--g-muted);font-size:1rem;font-weight:700;text-align:center}" +
    "#arcade-gate label{display:block;margin:0 0 8px;font:400 .65rem/1.6 var(--g-pixel);text-transform:uppercase;color:var(--g-cyan)}" +
    "#arcade-gate input{display:block;width:100%;margin:0 0 18px;padding:12px 14px;font:700 16px/1.4 var(--g-soft);" +
    "color:var(--g-text);background:#ffffff12;border:2px solid #8B5CF6;border-radius:14px;outline:none}" +
    "#arcade-gate input:focus{border-color:var(--g-cyan)}" +
    "#arcade-gate button{display:block;width:100%;margin:0;padding:16px 14px;font:400 .8rem/1.6 var(--g-pixel);text-transform:uppercase;" +
    "color:#fff;background:var(--g-pink);border:0;border-radius:18px;cursor:pointer;transform:rotate(-1.5deg);" +
    "box-shadow:0 6px 0 #00000055;transition:transform .15s;-webkit-tap-highlight-color:transparent}" +
    "#arcade-gate button:active{transform:rotate(0deg) scale(.96)}" +
    "#arcade-gate button:focus-visible{outline:3px solid var(--g-text);outline-offset:4px}" +
    "#arcade-gate .gate-error{min-height:1.5em;margin:18px 0 0;color:var(--g-lime);font-weight:700;text-align:center}" +
    "@media (min-width:600px){#arcade-gate .gate-mascot{width:120px;height:120px}}";
  (document.head || root).appendChild(style);

  function scramble(text) {
    var bytes = new TextEncoder().encode(SALT + text);
    return window.crypto.subtle.digest("SHA-256", bytes).then(function (buffer) {
      return Array.from(new Uint8Array(buffer))
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    });
  }

  function unlock() {
    try { localStorage.setItem(STORAGE_KEY, PASSWORD_HASH); } catch (e) {}
    root.classList.remove("arcade-locked");
    var gate = document.getElementById("arcade-gate");
    if (gate) gate.remove();
  }

  function el(tag, props, text) {
    var node = document.createElement(tag);
    for (var key in props) node.setAttribute(key, props[key]);
    if (text) node.textContent = text;
    return node;
  }

  function showGate() {
    var gate = el("div", { id: "arcade-gate", role: "dialog", "aria-modal": "true", "aria-labelledby": "arcade-gate-title" });
    var form = el("form");
    var input = el("input", { id: "arcade-gate-input", type: "password", autocomplete: "off", autocapitalize: "off", spellcheck: "false" });
    var error = el("div", { class: "gate-error", role: "alert" });
    var title = el("h1", { id: "arcade-gate-title" }, "Game");
    title.append(el("br"), "Arcade");
    var hero = el("div", { class: "gate-hero" });
    hero.append(title, el("img", { class: "gate-mascot", src: base + "sprites/player-front-won.svg", alt: "" }));

    form.append(
      hero,
      el("p", {}, "Type the password to play."),
      el("label", { for: "arcade-gate-input" }, "Password"),
      input,
      el("button", { type: "submit" }, "Let me in"),
      error
    );
    gate.append(form);

    // Games listen for keys like Space and arrows on the whole page. This stops
    // typing in the password box from also moving or starting a game.
    ["keydown", "keyup", "keypress"].forEach(function (type) {
      gate.addEventListener(type, function (event) { event.stopPropagation(); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      // The check ignores capital letters and extra spaces. People often
      // type "playgames2026" or add a space by accident.
      scramble(input.value.trim().toLowerCase()).then(function (hash) {
        if (hash === PASSWORD_HASH) {
          unlock();
        } else {
          error.textContent = "That password isn't right. Try again.";
          input.value = "";
          input.focus();
        }
      });
    });

    document.body.appendChild(gate);
    input.focus();
  }

  if (document.body) showGate();
  else document.addEventListener("DOMContentLoaded", showGate);
})();
