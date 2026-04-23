import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const BRAND_URL = "https://daveblatherwick.github.io/Fabrik3.0/";

// Single lightning-bolt path from the favicon — stripped of its decorative
// glow layers so it renders crisply at 28×28. Matches the reference mockup.
const BOLT_PATH =
  "M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z";

const buildBrandImage = (mode: "dark" | "light") => {
  const wordmarkFill = mode === "dark" ? "#F7F7F7" : "#141414";
  const tileFill = mode === "dark" ? "#1F1F1F" : "#E6E6FE";
  const boltFill = mode === "dark" ? "#A7A9FA" : "#676AC6";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="32" viewBox="0 0 120 32" fill="none">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="${tileFill}"/>
    <svg x="6" y="5.5" width="20" height="21" viewBox="0 0 48 46" fill="none" overflow="hidden">
      <path d="${BOLT_PATH}" fill="${boltFill}"/>
    </svg>
    <text x="40" y="21.5" font-family="Work Sans, system-ui, sans-serif" font-size="18" font-weight="700" fill="${wordmarkFill}" letter-spacing="-0.01em">Fabrik</text>
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
