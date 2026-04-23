import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const BRAND_URL = "https://daveblatherwick.github.io/Fabrik3.0/";

// Tiny F-icon logo + wordmark. Inlined as a data URI so it works both on
// localhost and under GitHub Pages' /Fabrik3.0/ base path without extra config.
const buildBrandImage = (mode: "dark" | "light") => {
  const wordmarkFill = mode === "dark" ? "#F7F7F7" : "#141414";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="228" height="32" viewBox="0 0 228 32" fill="none">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="#676AC6"/>
    <text x="16" y="21.5" font-family="Work Sans, system-ui, sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">F</text>
    <text x="42" y="21.5" font-family="Work Sans, system-ui, sans-serif" font-size="14" font-weight="600" fill="${wordmarkFill}" letter-spacing="0.01em">Fabrik Design System</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const applyTheme = (mode: string | undefined) => {
  const dark = mode === "dark";
  addons.setConfig({
    theme: create({
      base: dark ? "dark" : "light",
      brandTitle: "Fabrik Design System",
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
