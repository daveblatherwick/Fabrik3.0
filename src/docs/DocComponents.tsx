import type { CSSProperties, ReactNode } from "react";

const labelStyle: CSSProperties = {
  fontFamily: "var(--fabric-font-family-body)",
  fontSize: 11,
  color: "var(--fabric-text-tertiary)",
  marginTop: 4,
};
const nameStyle: CSSProperties = { ...labelStyle, color: "var(--fabric-text-primary)", marginTop: 6, fontWeight: 500 };

export function Swatch({ name, value, size = 80 }: { name: string; value: string; size?: number }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 0, width: size }}>
      <div
        style={{
          width: size,
          height: size * 0.75,
          background: value,
          borderRadius: 8,
          border: "1px solid var(--fabric-border-secondary)",
        }}
      />
      <span style={nameStyle}>{name}</span>
      <span style={labelStyle}>{value}</span>
    </div>
  );
}

export function Scale({ name, colors }: { name: string; colors: Record<string, string> }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ fontFamily: "var(--fabric-font-family-body)", margin: "0 0 12px" }}>{name}</h4>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {Object.entries(colors).map(([k, v]) => (
          <Swatch key={k} name={k} value={v} />
        ))}
      </div>
    </div>
  );
}

export function SemanticRow({ name, cssVar, description }: { name: string; cssVar: string; description?: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 1fr 1fr",
        gap: 16,
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--fabric-border-secondary)",
      }}
    >
      <div style={{ width: 48, height: 32, background: `var(${cssVar})`, borderRadius: 6, border: "1px solid var(--fabric-border-secondary)" }} />
      <code style={{ fontSize: 12 }}>{name}</code>
      <code style={{ fontSize: 11, color: "var(--fabric-text-tertiary)" }}>{cssVar}</code>
      <span style={{ fontSize: 12, color: "var(--fabric-text-tertiary)" }}>{description}</span>
    </div>
  );
}

export function TypeSpecimen({
  label,
  size,
  lineHeight,
  weight = "Semibold",
  sample = "The quick brown fox jumps over the lazy dog",
}: {
  label: string;
  size: string;
  lineHeight: string;
  weight?: string;
  sample?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 80px 80px 1fr",
        gap: 16,
        alignItems: "baseline",
        padding: "12px 0",
        borderBottom: "1px solid var(--fabric-border-secondary)",
      }}
    >
      <code style={{ fontSize: 12 }}>{label}</code>
      <span style={{ fontSize: 12, color: "var(--fabric-text-tertiary)" }}>{size}</span>
      <span style={{ fontSize: 12, color: "var(--fabric-text-tertiary)" }}>{lineHeight}</span>
      <span
        style={{
          fontSize: size,
          lineHeight,
          fontFamily: "var(--fabric-font-family-body)",
          fontWeight: weight === "Semibold" ? 600 : 400,
          color: "var(--fabric-text-primary)",
        }}
      >
        {sample}
      </span>
    </div>
  );
}

export function TokenTable({ rows }: { rows: Array<{ name: string; value: string }> }) {
  return (
    <div style={{ fontFamily: "var(--fabric-font-family-body)" }}>
      {rows.map((r) => (
        <div
          key={r.name}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px",
            gap: 16,
            padding: "6px 0",
            borderBottom: "1px solid var(--fabric-border-secondary)",
            alignItems: "center",
          }}
        >
          <code style={{ fontSize: 12 }}>{r.name}</code>
          <span style={{ fontSize: 12, color: "var(--fabric-text-tertiary)" }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
