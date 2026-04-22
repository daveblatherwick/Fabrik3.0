import { addons } from "storybook/manager-api";
import { themes } from "storybook/theming";

const applyTheme = (mode: string | undefined) => {
  addons.setConfig({
    theme: mode === "dark" ? themes.dark : themes.light,
  });
};

addons.register("fabric-theme-sync", (api) => {
  const channel = api.getChannel();
  if (!channel) return;

  // Initial sync from stored globals
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
