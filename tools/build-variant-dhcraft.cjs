// Generates dhcraft/index.html, the variant in the look of dhcraft.org, from index.html.
// Content is edited once in index.html; run `node tools/build-variant-dhcraft.cjs` afterwards.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
let h = fs.readFileSync(path.join(root, "index.html"), "utf8").replace(/\r\n/g, "\n");

const replace = (from, to) => {
  if (!h.includes(from)) throw new Error(`index.html no longer contains: ${from.slice(0, 80)}`);
  h = h.split(from).join(to);
};

h = h.replace(/(href|src)="assets\//g, '$1="../assets/');

const style = h.match(/<link rel="stylesheet" href="\.\.\/assets\/style\.css\?v=\d+">/);
if (!style) throw new Error("stylesheet link not found");
replace(style[0], `${style[0]}
  <link rel="stylesheet" href="../assets/theme-dhcraft.css?v=2">
  <meta name="robots" content="noindex">`);
replace(`<link rel="preload" href="../assets/fonts/eb-garamond-500-normal-latin.woff2"`,
  `<link rel="preload" href="../assets/fonts/sora-latin-800-normal.woff2"`);

const brandStart = h.indexOf(`<a class="brand" href="#top">`);
if (brandStart < 0) throw new Error("brand link not found");
const brandEnd = h.indexOf(`</a>`, brandStart) + 4;
h = h.slice(0, brandStart)
  + `<a class="brand" href="#top"><img src="../assets/img/dhcraft-logo-line.svg" width="38" height="38" alt=""><span>fancy (research) <span class="accent">tools!</span></span></a>`
  + h.slice(brandEnd);

replace(`<h1 id="hero-title">fancy <span class="paren">(research)</span> tools<span class="bang">!</span></h1>`,
  `<h1 id="hero-title">fancy (research) tools<span class="bang">!</span><span class="accent-line">Werkzeuge für alle, die mit Wissen arbeiten.</span></h1>`);

fs.mkdirSync(path.join(root, "dhcraft"), { recursive: true });
fs.writeFileSync(path.join(root, "dhcraft", "index.html"), h);
console.log("dhcraft/index.html written");
