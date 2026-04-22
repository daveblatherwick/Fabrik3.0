import type { CSSProperties, ReactNode } from "react";

export type ComponentStatus = "alpha" | "beta" | "stable" | "deprecated";

export interface ChangelogEntry {
  date: string;        // ISO date
  version?: string;    // semver, optional
  changes: string[];
}

export interface FigmaRef {
  url: string;
  label?: string;      // e.g. "Button — Style=Filled, Type=Brand"
  nodeId?: string;
}

export interface ComponentMetaProps {
  status: ComponentStatus;
  version?: string;
  owner?: string;
  lastUpdated?: string;
  figma?: FigmaRef | FigmaRef[];
  /** Short sentences explaining design intent, trade-offs, token strategy */
  designNotes?: ReactNode[];
  /** a11y expectations and how they're met */
  a11yNotes?: ReactNode[];
  /** Known limitations for this component */
  limitations?: ReactNode[];
  /** Newest-first */
  changelog?: ChangelogEntry[];
}

const statusColor: Record<ComponentStatus, { bg: string; fg: string }> = {
  stable:     { bg: "var(--fabric-success-50)",  fg: "var(--fabric-success-700)" },
  beta:       { bg: "var(--fabric-warning-50)",  fg: "var(--fabric-warning-700)" },
  alpha:      { bg: "var(--fabric-brand-50)",    fg: "var(--fabric-brand-700)" },
  deprecated: { bg: "var(--fabric-error-50)",    fg: "var(--fabric-error-700)" },
};

const card: CSSProperties = {
  border: "1px solid var(--fabric-border-secondary)",
  borderRadius: 12,
  padding: 20,
  margin: "16px 0 32px",
  background: "var(--fabric-bg-primary)",
  fontFamily: "var(--fabric-font-family-body)",
};
const headerRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 16,
};
const badge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 10px",
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 9999,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
const metaRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
  fontSize: 12,
  color: "var(--fabric-text-secondary)",
};
const metaLabel: CSSProperties = { color: "var(--fabric-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 };
const sectionTitle: CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--fabric-text-primary)", margin: "18px 0 8px" };
const list: CSSProperties = { margin: 0, paddingLeft: 18, color: "var(--fabric-text-secondary)", fontSize: 13, lineHeight: 1.6 };
const changelogItem: CSSProperties = { margin: "10px 0", paddingBottom: 10, borderBottom: "1px dashed var(--fabric-border-secondary)" };
const changelogHeader: CSSProperties = { display: "flex", gap: 12, alignItems: "baseline", marginBottom: 4 };
const date: CSSProperties = { fontSize: 11, color: "var(--fabric-text-tertiary)", fontVariantNumeric: "tabular-nums" };
const versionTag: CSSProperties = { fontSize: 11, color: "var(--fabric-text-brand-primary)", fontWeight: 600 };

function toFigmaArray(f?: FigmaRef | FigmaRef[]): FigmaRef[] {
  if (!f) return [];
  return Array.isArray(f) ? f : [f];
}

export function ComponentMeta({
  status,
  version,
  owner,
  lastUpdated,
  figma,
  designNotes,
  a11yNotes,
  limitations,
  changelog,
}: ComponentMetaProps) {
  const figmas = toFigmaArray(figma);
  const s = statusColor[status];
  return (
    <div style={card}>
      <div style={headerRow}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <span style={{ ...badge, background: s.bg, color: s.fg }}>{status}</span>
          {version && <span style={{ fontSize: 12, color: "var(--fabric-text-tertiary)" }}>v{version}</span>}
        </div>
        {lastUpdated && (
          <span style={{ fontSize: 11, color: "var(--fabric-text-tertiary)" }}>
            Last updated {lastUpdated}
          </span>
        )}
      </div>

      <div style={metaRow}>
        {owner && (
          <div>
            <div style={metaLabel}>Owner</div>
            <div>{owner}</div>
          </div>
        )}
        {figmas.length > 0 && (
          <div>
            <div style={metaLabel}>Figma source</div>
            {figmas.map((f, i) => (
              <div key={i}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--fabric-text-brand-primary)", textDecoration: "none" }}
                >
                  {f.label ?? "Open in Figma"}
                </a>
                {f.nodeId && (
                  <span style={{ color: "var(--fabric-text-tertiary)", marginLeft: 6, fontSize: 11 }}>
                    ({f.nodeId})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {designNotes && designNotes.length > 0 && (
        <>
          <div style={sectionTitle}>Design notes</div>
          <ul style={list}>
            {designNotes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </>
      )}

      {a11yNotes && a11yNotes.length > 0 && (
        <>
          <div style={sectionTitle}>Accessibility</div>
          <ul style={list}>
            {a11yNotes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </>
      )}

      {limitations && limitations.length > 0 && (
        <>
          <div style={sectionTitle}>Known limitations</div>
          <ul style={list}>
            {limitations.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </>
      )}

      {changelog && changelog.length > 0 && (
        <>
          <div style={sectionTitle}>Changelog</div>
          <div>
            {changelog.map((e, i) => (
              <div key={i} style={i === changelog.length - 1 ? { ...changelogItem, borderBottom: "none" } : changelogItem}>
                <div style={changelogHeader}>
                  <span style={date}>{e.date}</span>
                  {e.version && <span style={versionTag}>v{e.version}</span>}
                </div>
                <ul style={list}>
                  {e.changes.map((c, j) => <li key={j}>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
