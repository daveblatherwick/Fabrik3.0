import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import faviconSvg from "../public/favicon.svg?raw";

const BRAND_URL = "https://daveblatherwick.github.io/Fabrik3.0/";

/**
 * Inline the favicon paths directly into the brand SVG. Browsers render
 * data-URI SVGs used as <img src> in "secure static mode" — nested data
 * URI <image> refs are blocked — so we paste the favicon inner markup
 * into a nested <svg> and prefix its IDs to avoid collisions.
 */
const faviconInner = faviconSvg
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(/id="([^"]+)"/g, 'id="fabrik-$1"')
  .replace(/url\(#([^)]+)\)/g, "url(#fabrik-$1)")
  .replace(/xlink:href="#([^"]+)"/g, 'xlink:href="#fabrik-$1"');

const buildBrandImage = (mode: "dark" | "light") => {
  const wordmarkFill = mode === "dark" ? "#F7F7F7" : "#141414";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="32" viewBox="0 0 128 32" fill="none">
    <defs>
      <clipPath id="fabrik-clip"><rect x="0" y="0" width="48" height="46"/></clipPath>
    </defs>
    <svg x="2" y="1" width="30" height="29" viewBox="0 0 48 46" fill="none" overflow="hidden" preserveAspectRatio="xMidYMid meet">
      <g clip-path="url(#fabrik-clip)">${faviconInner}</g>
    </svg>
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
