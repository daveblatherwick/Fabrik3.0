import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import "../src/tokens.css";

const withFabricTheme = (Story: () => JSX.Element, context: { globals: Record<string, string> }) => {
  const { brand = "adaptive", theme = "light", density = "default" } = context.globals;
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.brand = brand;
    root.dataset.theme = theme;
    root.dataset.density = density;
  }, [brand, theme, density]);
  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: "todo" },
    layout: "centered",
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
