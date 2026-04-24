import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShareNotificationsModal } from "./ShareNotificationsModal";
import { fabricDocsPage } from "../../docs/FabricDocsPage";
import { GROUPS, CATEGORIES, INITIAL_CONFIGS } from "./ShareNotificationsModal.data";

const meta: Meta<typeof ShareNotificationsModal> = {
  title: "Screens/Share Notifications Modal",
  component: ShareNotificationsModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      page: fabricDocsPage({
        status: "beta",
        version: "0.1.0",
        owner: "Platform Exchange",
        designNotes: [
          "Dialog opens from the Share affordance on any individual notification toast or row in the notifications feed.",
          "Left pane picks one recipient group at a time; right pane edits per-category step selections. The footer summarises cross-group state so users know how many recipients they've configured before sharing.",
          "Categories collapse to keep the surface calm for recipients who only need a subset — e.g. Middle Office barely touches Risk.",
          "The 'Copy from…' dropdown pulls from recently-configured groups so power users can clone a known-good preset and tweak.",
          "The source notification that triggered the share is pinned behind the scrim as a dim'd toast — this grounds the action and prevents context-switch confusion.",
        ],
        a11yNotes: [
          "Modal uses role=dialog + aria-modal=true, labelled by the heading.",
          "Every step row is a full-width click target; the nested Checkbox is keyboard-reachable and stopPropagation-safe.",
          "Category disclosure buttons expose open/closed via the chevron rotation and collapsed body.",
        ],
        limitations: [
          "Channel selection (Slack / email / in-app) is handled elsewhere — this dialog only manages *what* is shared, not *where* it lands.",
          "No per-member overrides; sharing applies to the whole group.",
        ],
        changelog: [
          { date: "2026-04-24", version: "0.1.0", changes: ["Initial beta — ported from Aeron prototype v2."] },
        ],
      }),
    },
  },
};
export default meta;

type Story = StoryObj<typeof ShareNotificationsModal>;

const sourceNotification = {
  categoryLabel: "Risk · Limits",
  title: "Limit breached — EURUSD desk exposure",
  meta: (<><b>Aeron Trading / FX London</b> · limit <b>+12.4%</b> over threshold</>),
  tone: "warning" as const,
  time: "just now",
};

const Interactive = (args: Parameters<typeof ShareNotificationsModal>[0]) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      {!open && (
        <div style={{ padding: 40 }}>
          <button onClick={() => setOpen(true)} style={{ padding: "8px 14px" }}>Reopen modal</button>
        </div>
      )}
      <ShareNotificationsModal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onShare={(c, a) => { console.log("share", c, a); setOpen(false); }}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <Interactive {...args} />,
  args: { sourceNotification },
};

export const EmptyGroup: Story = {
  render: (args) => <Interactive {...args} />,
  args: {
    sourceNotification,
    initialSelectedId: "g-relman",
    initialConfigs: { ...INITIAL_CONFIGS, "g-relman": {} },
  },
};

export const ManyGroupsConfigured: Story = {
  render: (args) => <Interactive {...args} />,
  args: {
    sourceNotification,
    initialConfigs: Object.fromEntries(
      GROUPS.map((g) => [g.id, Object.fromEntries(CATEGORIES.slice(0, 3).map((c) => [c.id, c.steps.slice(0, 2).map((s) => s.id)]))]),
    ),
  },
};

export const NoSourceNotification: Story = {
  render: (args) => <Interactive {...args} />,
  args: { sourceNotification: undefined },
};
