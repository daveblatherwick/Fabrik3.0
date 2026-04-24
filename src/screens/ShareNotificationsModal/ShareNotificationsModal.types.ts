export type TeamId = "all" | "trading" | "ops" | "risk" | "tech" | "clients";

export interface TeamSummary {
  id: TeamId;
  name: string;
}

export interface GroupSummary {
  id: string;
  name: string;
  team: Exclude<TeamId, "all">;
  members: number;
  note: string;
}

export type CategoryTone = "trade" | "risk" | "compli" | "ops" | "system" | "news";

export interface WorkflowStep {
  id: string;
  name: string;
  desc: string;
}

export interface NotificationCategory {
  id: string;
  name: string;
  tone: CategoryTone;
  blurb: string;
  steps: WorkflowStep[];
}

export interface PresetConfig {
  id: string;
  label: string;
  config: Record<string, string[]>;
}

export type AccessLevel = "view" | "ack";

export interface ShareNotificationsModalProps {
  /** Controls modal visibility. When false, the component renders nothing. */
  open?: boolean;
  /** Called when the user hits Cancel or clicks the close button. */
  onClose?: () => void;
  /** Called when the user confirms the share. Receives the per-group config map and chosen access level. */
  onShare?: (
    configs: Record<string, Record<string, string[]>>,
    access: AccessLevel,
  ) => void;
  /** Initial per-group configuration. Defaults to a realistic populated map. */
  initialConfigs?: Record<string, Record<string, string[]>>;
  /** The group selected on mount. Defaults to the first group in `groups`. */
  initialSelectedId?: string;
  /** Teams shown as filter chips. Defaults to the bundled TEAMS. */
  teams?: TeamSummary[];
  /** Groups shown in the left-pane list. Defaults to the bundled GROUPS. */
  groups?: GroupSummary[];
  /** Notification categories and their ordered workflow steps. Defaults to the bundled CATEGORIES. */
  categories?: NotificationCategory[];
  /** Preset configs exposed in the "Copy from…" menu. Defaults to the bundled PRESETS. */
  presets?: PresetConfig[];
  /** Source notification shown as a pinned toast behind the modal. Omit to hide. */
  sourceNotification?: {
    categoryLabel: string;
    title: string;
    meta: React.ReactNode;
    tone?: "warning" | "error" | "brand";
    time?: string;
  };
  /** Show the dim'd platform backdrop. Defaults to true in stories, false when embedded. */
  showPlatformBackdrop?: boolean;
}
