import { resolve } from "node:path";
import { defineConfig } from "vite";
import pages from "./scripts/docs-pages.json" with { type: "json" };

export default defineConfig({
  base: process.env.BASE_PATH || "./",
  build: {
    rollupOptions: {
      input: [
        ...pages.map(([, destination]) => {
          if (!destination) throw new Error("Documentation route requires a destination");
          return resolve(destination);
        }),
        resolve("baseline/index.html"),
        resolve("tool/index.html"),
        resolve("pilot/index.html"),
        resolve("photographs/index.html"),
        resolve("annotations/index.html"),
        resolve("letters/index.html"),
        resolve("tools/index.html"),
        ...["", "atlas", "bench", "trail"].map((dir) => resolve("concepts", dir, "index.html")),
      ],
    },
  },
});
