import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
// Raw string import — Vite supports ?raw on .svg.
import faviconSvg from "../public/favicon.svg?raw";

const BRAND_URL = "https://daveblatherwick.github.io/Fabrik3.0/";

/**
 * Storybook's brandImage is rendered as a single <img src=...>. To show both
 * the favicon (with its gradient/glow) AND the "Fabrik" wordmark, we nest
 * the favicon as a data URI inside a larger SVG via <image href=...>.
 */
const faviconDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(faviconSvg)}`;

const buildBrandImage = (mode: "dark" | "light") => {
  const wordmarkFill = mode === "dark" ? "#F7F7F7" : "#141414";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="32" viewBox="0 0 128 32" fill="none">
    <image href="${faviconDataUri}" xlink:href="${faviconDataUri}" x="2" y="1" width="30" height="29" />
    <text x="40" y="22" font-family="Work Sans, system-ui, sans-serif" font-size="18" font-weight="700" fill="${wordmarkFill}" letter-spacing="-0.01em">Fabrik</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const applyTheme = (mode: string | undefined) => {
  const dark = mode === "dark";
  addons.setConfig({
    theme: create({
      base: dark ? "dark" : "light",
      brandTitle: "Fabrik",
      brandImage: buildBrandImage(dark ? "dark" : "light"),
      brandUrl: BRAND_URL,
    }),
  });
};

addons.register("fabric-theme-sync", (api) => {
  const channel = api.getChannel();
  if (!channel) return;

  try {
    const globals = (api.getGlobals?.() ?? {}) as { theme?: string };
    applyTheme(globals.theme);
  } catch {
    // ignore
  }

  channel.on("globalsUpdated", ({ globals }: { globals: { theme?: string } }) => {
    applyTheme(globals?.theme);
  });
});
