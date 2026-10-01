// Generates every design variant and the overview page from index.html, the only content source.
// Run `node tools/build-variants.cjs` after every content change in index.html.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8").replace(/\r\n/g, "\n");

const prismMark = source.match(/<svg viewBox="0 0 64 40" aria-hidden="true">[\s\S]*?<\/svg>/)[0];
const plainTitle = `fancy <span class="paren">(research)</span> tools<span class="bang">!</span>`;

const variants = [
  {
    dir: "", name: "Prisma", theme: null,
    summary: "Weißer Grund, Prisma als Marke, Spektrum in gleicher Helligkeit, EB Garamond mit Monospace-Etiketten.",
  },
  {
    dir: "dhcraft", name: "DHCraft", theme: "theme-dhcraft.css", font: "sora-latin-800-normal.woff2",
    summary: "Im Stil von dhcraft.org, Papiergrund, Aquarellpalette, Sora, Karten und Sechseck-Symbole.",
    brand: `<img src="../assets/img/dhcraft-logo-line.svg" width="38" height="38" alt=""><span>fancy (research) <span class="accent">tools!</span></span>`,
    title: `fancy (research) tools<span class="bang">!</span><span class="accent-line">Werkzeuge für alle, die mit Wissen arbeiten.</span>`,
  },
  {
    dir: "edition", name: "Edition", theme: "theme-edition.css", font: "eb-garamond-500-normal-latin.woff2",
    summary: "Klassische Buchtypografie, Garamond durchgehend, Schwarz und Rubrikenrot, Kapitälchen.",
    brand: `<span>${plainTitle}</span>`,
  },
  {
    dir: "labor", name: "Labor", theme: "theme-labor.css", font: "jetbrains-mono-500-normal-latin.woff2",
    summary: "Dunkler Grund, Monospace-Überschriften, leuchtendes Spektrum und Messraster.",
    brand: `${prismMark}<span>${plainTitle}</span>`,
  },
  {
    dir: "raster", name: "Raster", theme: "theme-raster.css", font: "instrument-sans-latin-600-normal.woff2",
    summary: "Schweizer Typografie, eine Grotesk in großen Schnitten, Schwarz und Weiß, Spektrum als Farbblock.",
    brand: `<span>${plainTitle}</span>`,
  },
];

const mustReplace = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`index.html no longer contains: ${from.slice(0, 80)}`);
  return text.split(from).join(to);
};

const styleLink = source.match(/<link rel="stylesheet" href="assets\/style\.css\?v=\d+">/)[0];

for (const v of variants.filter((x) => x.theme)) {
  let h = source.replace(/(href|src)="assets\//g, '$1="../assets/');
  const link = styleLink.replace('href="assets/', 'href="../assets/');
  const version = fs.statSync(path.join(root, "assets", v.theme)).mtimeMs.toFixed(0);
  h = mustReplace(h, link, `${link}\n  <link rel="stylesheet" href="../assets/${v.theme}?v=${version}">\n  <meta name="robots" content="noindex">`);
  h = h.replace(/<link rel="preload" href="\.\.\/assets\/fonts\/[^"]+"/, `<link rel="preload" href="../assets/fonts/${v.font}"`);

  const bs = h.indexOf(`<a class="brand" href="#top">`);
  const be = h.indexOf(`</a>`, bs) + 4;
  h = h.slice(0, bs) + `<a class="brand" href="#top">${v.brand}</a>` + h.slice(be);

  if (v.title) h = mustReplace(h, `<h1 id="hero-title">${plainTitle}</h1>`, `<h1 id="hero-title">${v.title}</h1>`);

  fs.mkdirSync(path.join(root, v.dir), { recursive: true });
  fs.writeFileSync(path.join(root, v.dir, "index.html"), h);
  console.log(`${v.dir}/index.html written`);
}

// Overview page, set in the main variant, one entry per design with its preview image.
const items = variants.map((v) => {
  const slug = v.dir || "prisma";
  return `        <li class="variant">
          <a href="../${v.dir ? v.dir + "/" : ""}">
            <img src="../assets/img/variant-${slug}.jpg" width="1440" height="900" loading="lazy" alt="Kopfbereich der Variante ${v.name}">
            <span class="variant-name">${v.name}</span>
          </a>
          <p>${v.summary}</p>
        </li>`;
}).join("\n");

const overview = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Designvarianten | fancy (research) tools!</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../${styleLink.match(/assets\/style\.css\?v=\d+/)[0]}">
</head>
<body>
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="../">${prismMark}<span>${plainTitle}</span></a>
    </div>
  </header>
  <main class="section">
    <div class="wrap">
      <h1 class="section-title">Designvarianten</h1>
      <ul class="variants" role="list">
${items}
      </ul>
    </div>
  </main>
</body>
</html>
`;
fs.mkdirSync(path.join(root, "varianten"), { recursive: true });
fs.writeFileSync(path.join(root, "varianten", "index.html"), overview);
console.log("varianten/index.html written");
