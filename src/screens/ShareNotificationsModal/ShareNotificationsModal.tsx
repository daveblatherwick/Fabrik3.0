import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { Button } from "../../components/Button/Button";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { InputField } from "../../components/InputField/InputField";
import { Badge } from "../../components/Badge/Badge";
import { DropdownItem } from "../../components/DropdownItem/DropdownItem";
import styles from "./ShareNotificationsModal.module.css";
import {
  TEAMS as DEFAULT_TEAMS,
  GROUPS as DEFAULT_GROUPS,
  CATEGORIES as DEFAULT_CATEGORIES,
  PRESETS as DEFAULT_PRESETS,
  INITIAL_CONFIGS as DEFAULT_INITIAL,
} from "./ShareNotificationsModal.data";
import type {
  ShareNotificationsModalProps,
  AccessLevel,
  PresetConfig,
  NotificationCategory,
  CategoryTone,
} from "./ShareNotificationsModal.types";

// ── small helpers ──────────────────────────────────────────────────────────
const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const highlight = (text: string, query: string): ReactNode => {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className={styles.searchHl}>{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
};

// ── inline icons (match Fabric's 16px/2px-stroke contract) ────────────────
const XIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const SearchIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>);
const FilterIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>);
const CheckIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const ChevIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);
const ChevRight = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>);
const ShareIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>);
const CopyIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
const WarnIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const UsersIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>);

const CatGlyph: Record<CategoryTone, FC> = {
  trade:  () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>),
  risk:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 22h20L12 2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>),
  compli: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z"/><polyline points="9 12 11 14 15 10"/></svg>),
  ops:    () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><polyline points="21 3 21 9 15 9"/></svg>),
  system: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>),
  news:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a4 4 0 0 1-4 4H4z"/><line x1="8" y1="8" x2="16" y2="8"/></svg>),
};

// ── component ──────────────────────────────────────────────────────────────
export const ShareNotificationsModal: FC<ShareNotificationsModalProps> = ({
  open = true,
  onClose,
  onShare,
  initialConfigs = DEFAULT_INITIAL,
  initialSelectedId = "g-fx-ldn",
  teams = DEFAULT_TEAMS,
  groups = DEFAULT_GROUPS,
  categories = DEFAULT_CATEGORIES,
  presets = DEFAULT_PRESETS,
  sourceNotification,
}) => {
  const [configs, setConfigs] = useState(initialConfigs);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [access, setAccess] = useState<AccessLevel>("ack");
  const [copyOpen, setCopyOpen] = useState(false);
  const [toast, setToast] = useState<{ kind: "done" | "copy"; msg: string } | null>(null);

  const group = groups.find((g) => g.id === selectedId);
  const config = configs[selectedId] ?? {};

  const filtered = useMemo(
    () => groups.filter((g) =>
      (teamFilter === "all" || g.team === teamFilter) &&
      (!query || g.name.toLowerCase().includes(query.toLowerCase()))
    ),
    [groups, teamFilter, query],
  );

  const configuredCount = (c: Record<string, string[]> | undefined) =>
    Object.values(c ?? {}).reduce((a, b) => a + b.length, 0);
  const totalSteps = categories.reduce((a, c) => a + c.steps.length, 0);
  const currentSelected = configuredCount(config);
  const currentCats = Object.keys(config).filter((k) => (config[k] ?? []).length).length;
  const groupsWithConfig = groups.filter((g) => configuredCount(configs[g.id]) > 0).length;

  const toggleStep = (catId: string, stepId: string, on: boolean) => {
    setConfigs((prev) => {
      const cur = prev[selectedId] ?? {};
      const set = new Set(cur[catId] ?? []);
      if (on) set.add(stepId); else set.delete(stepId);
      return { ...prev, [selectedId]: { ...cur, [catId]: [...set] } };
    });
  };
  const toggleAllCat = (cat: NotificationCategory, on: boolean) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedId]: { ...(prev[selectedId] ?? {}), [cat.id]: on ? cat.steps.map((s) => s.id) : [] },
    }));
  };
  const bulkAll   = () => setConfigs((p) => ({ ...p, [selectedId]: Object.fromEntries(categories.map((c) => [c.id, c.steps.map((s) => s.id)])) }));
  const bulkClear = () => setConfigs((p) => ({ ...p, [selectedId]: {} }));
  const pickPreset = (p: PresetConfig) => {
    setConfigs((prev) => ({ ...prev, [selectedId]: structuredClone(p.config) }));
    setCopyOpen(false);
    setToast({ kind: "copy", msg: `Copied preferences from ${p.label}` });
    setTimeout(() => setToast(null), 2400);
  };

  const doShare = () => {
    onShare?.(configs, access);
    setToast({ kind: "done", msg: `Shared with ${groupsWithConfig} ${groupsWithConfig === 1 ? "group" : "groups"}` });
    setTimeout(() => setToast(null), 2400);
  };

  if (!open) return null;

  return (
    <div className={styles.root}>
      <div className={styles.stage}>
        <div className={styles.scrim} />
        {sourceNotification && (
          <div className={styles.sourceToast}>
            <div className={styles.sourceIcon}><WarnIcon/></div>
            <div>
              <div className={styles.sourceCat}>{sourceNotification.categoryLabel} · {sourceNotification.time ?? "just now"}</div>
              <div className={styles.sourceTitle}>{sourceNotification.title}</div>
              <div className={styles.sourceMeta}>{sourceNotification.meta}</div>
            </div>
          </div>
        )}
        <div className={styles.modalWrap} role="dialog" aria-modal="true" aria-labelledby="snm-title">
          <div className={styles.modal}>
            <div className={styles.head}>
              <div className={styles.headIcon}><ShareIcon/></div>
              <div className={styles.headText}>
                <h2 className={styles.headTitle} id="snm-title">Share notification preferences</h2>
                <p className={styles.headSub}>Choose which <b>steps</b> of each <b>category</b> a team should receive. Changes apply to all members of the selected group.</p>
              </div>
              <button className={styles.close} onClick={onClose} aria-label="Close"><XIcon/></button>
            </div>

            <div className={styles.recipient}>
              <div className={styles.search}>
                <InputField
                  placeholder="Search teams or groups…"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  leadingIcon={<SearchIcon/>}
                />
              </div>
              <button className={cx(styles.filterBtn, filtersOpen && styles.open)} onClick={() => setFiltersOpen((v) => !v)}>
                <FilterIcon/> Filter
              </button>
              <div className={styles.copyFromWrap}>
                <button className={cx(styles.copyFromBtn, copyOpen && styles.active)} onClick={() => setCopyOpen((v) => !v)}>
                  <CopyIcon/> Copy from…
                </button>
                {copyOpen && (
                  <CopyFromSheet presets={presets} groups={groups} onPick={pickPreset} onClose={() => setCopyOpen(false)} />
                )}
              </div>
            </div>

            {filtersOpen && (
              <div className={styles.chipRow}>
                {teams.map((t) => {
                  const on = teamFilter === t.id;
                  const n = t.id === "all" ? groups.length : groups.filter((g) => g.team === t.id).length;
                  return (
                    <button key={t.id} className={cx(styles.chip, on && styles.on)} onClick={() => setTeamFilter(t.id)}>
                      {t.name} <span className={styles.n}>{n}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className={styles.body}>
              <div className={styles.left}>
                <div className={styles.sectionLabel}>Groups · {filtered.length}</div>
                {filtered.length === 0 && <div className={styles.emptyLeft}>No groups match your filters.</div>}
                {filtered.map((g) => {
                  const n = configuredCount(configs[g.id]);
                  const sel = g.id === selectedId;
                  return (
                    <button key={g.id} className={cx(styles.rItem, sel && styles.selected)} onClick={() => setSelectedId(g.id)}>
                      <span className={cx(styles.avatar, styles.group)}>{initials(g.name)}</span>
                      <span className={styles.rMeta}>
                        <span className={styles.rName}>{highlight(g.name, query)}</span>
                        <span className={styles.rSub}>{g.members} members · {g.note}</span>
                      </span>
                      <Badge color={n > 0 ? "brand" : "gray"} size="sm">{n > 0 ? n : "—"}</Badge>
                    </button>
                  );
                })}
              </div>

              <div className={styles.right}>
                <div className={styles.rightHead}>
                  <div className={styles.target}>
                    <span className={cx(styles.avatar, styles.group, styles.sm)}>{group ? initials(group.name) : "—"}</span>
                    <div>
                      <div className={styles.targetName}>{group?.name ?? "Select a group"}</div>
                      <div className={styles.targetDesc}>
                        {group ? `${group.members} members · ${currentSelected} of ${totalSteps} steps across ${currentCats} categor${currentCats === 1 ? "y" : "ies"}` : "—"}
                      </div>
                    </div>
                  </div>
                  <div className={styles.bulkRow}>
                    <button className={styles.bulkBtn} onClick={bulkAll}>Select all</button>
                    <span className={styles.bulkSep}/>
                    <button className={styles.bulkBtn} onClick={bulkClear}>Clear</button>
                  </div>
                </div>

                <div className={styles.cats}>
                  {categories.map((cat) => {
                    const sel = config[cat.id] ?? [];
                    const allOn = sel.length === cat.steps.length;
                    const isClosed = !!collapsed[cat.id];
                    const Glyph = CatGlyph[cat.tone];
                    return (
                      <div key={cat.id} className={cx(styles.cat, isClosed && styles.closed)}>
                        <button className={styles.catHead} onClick={() => setCollapsed((c) => ({ ...c, [cat.id]: !c[cat.id] }))}>
                          <span className={styles.catChev}><ChevIcon/></span>
                          <span className={cx(styles.catIcon, styles[cat.tone])}><Glyph/></span>
                          <span className={styles.catName}>{cat.name}</span>
                          <span className={styles.catCount}>
                            {sel.length > 0
                              ? <Badge color="brand" size="sm">{sel.length}</Badge>
                              : <span className={styles.catCountZero}>0</span>}
                            <span className={styles.catCountTotal}>/ {cat.steps.length}</span>
                          </span>
                          <span
                            className={cx(styles.catMaster, allOn && styles.all)}
                            role="button"
                            onClick={(e) => { e.stopPropagation(); toggleAllCat(cat, !allOn); }}
                          >
                            {allOn && <CheckIcon/>}
                            {allOn ? "All" : "Select all"}
                          </span>
                        </button>
                        <div className={styles.catBody}>
                          {cat.steps.map((step, idx) => {
                            const on = sel.includes(step.id);
                            return (
                              <div key={step.id} className={cx(styles.stepRow, on && styles.on)} onClick={() => toggleStep(cat.id, step.id, !on)}>
                                <Checkbox
                                  size="sm"
                                  checked={on}
                                  onChange={(e) => toggleStep(cat.id, step.id, e.currentTarget.checked)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className={styles.stepFlow}><span className={styles.num}>{idx + 1}</span></span>
                                <span className={styles.stepText}>
                                  <span>{step.name}</span>
                                  <span className={styles.stepDesc}>{step.desc}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.foot}>
              <div className={styles.summary}>
                <UsersIcon/>
                <span><b>{groupsWithConfig}</b> {groupsWithConfig === 1 ? "group" : "groups"} configured</span>
                <span className={styles.summaryDot}/>
                <span><b>{currentSelected}</b> steps for <b>{group?.name}</b></span>
              </div>
              <div className={styles.footRight}>
                <div className={styles.permission}>
                  <span>Access</span>
                  <select value={access} onChange={(e) => setAccess(e.currentTarget.value as AccessLevel)}>
                    <option value="view">View only</option>
                    <option value="ack">View & acknowledge</option>
                  </select>
                </div>
                <Button variant="text" kind="brand" size="sm" onClick={onClose}>Cancel</Button>
                <Button variant="filled" kind="brand" size="sm" disabled={groupsWithConfig === 0} onClick={doShare}>
                  Share with {groupsWithConfig} {groupsWithConfig === 1 ? "group" : "groups"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div className={styles.doneToast} role="status">
            {toast.kind === "done" ? <CheckIcon/> : <CopyIcon/>}
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

ShareNotificationsModal.displayName = "ShareNotificationsModal";

// ── copy-from dropdown ─────────────────────────────────────────────────────
const CopyFromSheet: FC<{
  presets: PresetConfig[];
  groups: typeof DEFAULT_GROUPS;
  onPick: (p: PresetConfig) => void;
  onClose: () => void;
}> = ({ presets, groups, onPick, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  return (
    <div ref={ref} className={styles.copyFromSheet} role="menu">
      <div className={styles.cfHead}><span>Copy from</span><span>last 30 days</span></div>
      {presets.map((p) => {
        const g = groups.find((g) => g.id === p.id);
        const stepCount = Object.values(p.config).reduce((a, b) => a + b.length, 0);
        return (
          <DropdownItem
            key={p.id}
            onClick={() => onPick(p)}
            icon={<span className={cx(styles.avatar, styles.group)}>{initials(g?.name ?? p.label)}</span>}
            meta={<ChevRight/>}
          >
            <span className={styles.cfLabel}>
              <span className={styles.cfName}>{g?.name ?? p.label}</span>
              <span className={styles.cfSub}>{stepCount} steps across {Object.keys(p.config).length} categories</span>
            </span>
          </DropdownItem>
        );
      })}
    </div>
  );
};
