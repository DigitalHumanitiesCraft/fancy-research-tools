# fancy (research) tools!

Website for a service of Digital Humanities Craft OG: custom tools that speed up a concrete workflow, for research and cultural heritage institutions as well as companies and public administration, plus adaptable tools and the methods and frameworks behind them.

Static HTML and CSS without a build step and without JavaScript, served by GitHub Pages from the repository root.

The page follows the look of dhcraft.org. `index.html` holds the German page, `en/index.html` the English one, `assets/style.css` the only stylesheet, and there is no build step. `tools/shoot-tools.cjs` retakes the tool screenshots from the live demos, `tools/shoot-og.cjs` renders the link preview and `tools/check.cjs` runs the accessibility, layout, image and link checks. All three need an existing Playwright installation.

Project knowledge lives in [knowledge/INDEX.md](knowledge/INDEX.md).

## License

Code under the MIT License (see `LICENSE`), texts under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Excluded are the DHCraft logos (`assets/img/dhcraft-logo-96.png`, `assets/img/dhcraft-logo-line.svg`, `assets/img/favicon-32.png` and `assets/img/apple-touch-icon.png`, all rights reserved by Digital Humanities Craft OG), the fonts in `assets/fonts/` (Instrument Sans and Sora, each under the SIL Open Font License) and the screenshots, which show the respective tools under their own licences.
