import type { Preview } from "@storybook/react-vite";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { themes } from "storybook/theming";
import { useEffect, type ReactNode } from "react";
import "../src/tokens.css";

type Globals = { brand?: string; theme?: string; density?: string };

const applyRootTheme = (g: Globals) => {
  const root = document.documentElement;
  root.dataset.brand = g.brand ?? "adaptive";
  root.dataset.theme = g.theme ?? "light";
  root.dataset.density = g.density ?? "default";
};

const withFabricTheme = (Story: () => JSX.Element, context: { globals: Globals }) => {
  useEffect(() => {
    applyRootTheme(context.globals);
  }, [context.globals.brand, context.globals.theme, context.globals.density]);
  return <Story />;
};

const FabricDocsContainer = ({
  children,
  context,
}: {
  children: ReactNode;
  context: { storyById: () => { globals?: Globals } | undefined };
}) => {
  let globals: Globals = {};
  try {
    globals = context.storyById?.()?.globals ?? {};
  } catch {
    // Standalone MDX pages (no primary story) throw here — read from URL instead.
    try {
      const params = new URLSearchParams(window.location.search);
      const g = params.get("globals") ?? "";
      const pairs = g.split(";").map((s) => s.split(":"));
      for (const [k, v] of pairs) {
        if (k === "theme" || k === "brand" || k === "density") (globals as Record<string, string>)[k] = v;
      }
    } catch { /* ignore */ }
  }
  useEffect(() => {
    applyRootTheme(globals);
  }, [globals.brand, globals.theme, globals.density]);
  const dark = globals.theme === "dark";
  return (
    <DocsContainer context={context as never} theme={dark ? themes.dark : themes.light}>
      {children}
    </DocsContainer>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: "todo" },
    layout: "centered",
    docs: { container: FabricDocsContainer },
  },
  globalTypes: {
    brand: {
      description: "Brand palette",
      defaultValue: "adaptive",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "adaptive", title: "Adaptive" },
          { value: "aeron", title: "Aeron" },
          { value: "demo", title: "Demo" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Color mode",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Density mode",
      defaultValue: "default",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "compact", title: "Compact" },
          { value: "default", title: "Default" },
          { value: "spacious", title: "Spacious" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withFabricTheme],
};

export default preview;
