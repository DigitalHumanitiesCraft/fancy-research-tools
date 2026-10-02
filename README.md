# fancy (research) tools!

Knowledge and asset workshop for "fancy (research) tools!", the agentic engineering offer of Digital Humanities Craft OG. The page itself is a subpage of dhcraft.org, at https://dhcraft.org/fancy-research-tools/ and https://dhcraft.org/en/fancy-research-tools/, and is built and deployed by the site repository [DigitalHumanitiesCraft/digitalhumanitiescraft.github.io](https://github.com/DigitalHumanitiesCraft/digitalhumanitiescraft.github.io).

This repository holds:

- `knowledge/`, the project knowledge about the page, its facts, design, decisions and checks, starting at [knowledge/INDEX.md](knowledge/INDEX.md).
- `assets/img/source/`, the prompt logs of the generated method images.
- `tools/`, scripts that take the tool screenshots, encode chosen images and render the share image into the site repository, and run accessibility, layout, image, keyboard and link checks against the site's preview build. They need an existing Playwright installation.

The earlier standalone page remains in Git history. Its last published state is commit 8648a35.

## License

Code under the MIT License (see `LICENSE`). Texts and image prompts under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
