import type {
  TeamId,
  TeamSummary,
  GroupSummary,
  NotificationCategory,
  PresetConfig,
} from "./ShareNotificationsModal.types";

export const TEAMS: TeamSummary[] = [
  { id: "all",      name: "All teams" },
  { id: "trading", name: "Trading desks" },
  { id: "ops",     name: "Operations" },
  { id: "risk",    name: "Risk & Compliance" },
  { id: "tech",    name: "Platform eng." },
  { id: "clients", name: "Client coverage" },
];

export const GROUPS: GroupSummary[] = [
  { id: "g-fx-ldn",    name: "FX Trading — London",    team: "trading", members: 14, note: "Spot, Forwards, NDF" },
  { id: "g-fx-sgp",    name: "FX Trading — Singapore", team: "trading", members: 9,  note: "APAC session" },
  { id: "g-rates",     name: "Rates Desk",             team: "trading", members: 11, note: "IRS, Gov bonds" },
  { id: "g-ops",       name: "Middle Office",          team: "ops",     members: 18, note: "Trade lifecycle" },
  { id: "g-settle",    name: "Settlements",            team: "ops",     members: 12, note: "T+1, T+2 flows" },
  { id: "g-risk",      name: "Market Risk",            team: "risk",    members: 7,  note: "VaR & limits" },
  { id: "g-compli",    name: "Compliance Ops",         team: "risk",    members: 5,  note: "Reg reporting" },
  { id: "g-sre",       name: "SRE on-call",            team: "tech",    members: 6,  note: "24/7 rotation" },
  { id: "g-platform",  name: "Platform — Adaptive",    team: "tech",    members: 22, note: "Core team" },
  { id: "g-sales-emea",name: "Sales EMEA",             team: "clients", members: 16, note: "Tier 1 clients" },
  { id: "g-sales-apac",name: "Sales APAC",             team: "clients", members: 13, note: "Tier 1 clients" },
  { id: "g-relman",    name: "Relationship Mgmt",      team: "clients", members: 9,  note: "Tier 2–3" },
];

export const CATEGORIES: NotificationCategory[] = [
  {
    id: "trade", name: "Trade Lifecycle", tone: "trade", blurb: "Order flow & executions",
    steps: [
      { id: "t1", name: "Order submitted",   desc: "Client or desk creates a new order" },
      { id: "t2", name: "Routed",            desc: "Sent to venue / counterparty" },
      { id: "t3", name: "Partially filled",  desc: "Fills coming back in slices" },
      { id: "t4", name: "Filled",            desc: "Order fully executed" },
      { id: "t5", name: "Allocated",         desc: "Allocated across sub-accounts" },
      { id: "t6", name: "Settled",           desc: "T+1/T+2 settlement confirmed" },
    ],
  },
  {
    id: "risk", name: "Risk Breaches", tone: "risk", blurb: "Limits, VaR and exposure",
    steps: [
      { id: "r1", name: "Warning threshold", desc: "Nearing limit (80%)" },
      { id: "r2", name: "Limit breached",    desc: "Hard limit exceeded" },
      { id: "r3", name: "Auto-hedge placed", desc: "System placed offset" },
      { id: "r4", name: "Desk acknowledged", desc: "Trader confirmed action" },
      { id: "r5", name: "Resolved",          desc: "Position back within limits" },
    ],
  },
  {
    id: "compli", name: "Compliance & Regulatory", tone: "compli", blurb: "Reporting, reviews, flags",
    steps: [
      { id: "c1", name: "Flagged for review",desc: "Anomalous trade or pattern" },
      { id: "c2", name: "Under review",      desc: "Compliance assigned" },
      { id: "c3", name: "Report submitted",  desc: "Reg filing delivered" },
      { id: "c4", name: "Closed — pass",     desc: "No action required" },
      { id: "c5", name: "Escalated",         desc: "Raised to supervisor" },
    ],
  },
  {
    id: "ops", name: "Operations", tone: "ops", blurb: "Post-trade processing",
    steps: [
      { id: "o1", name: "Match pending",     desc: "Awaiting counterparty match" },
      { id: "o2", name: "Break detected",    desc: "Mismatch on fields" },
      { id: "o3", name: "Confirmed",         desc: "Both sides agree" },
      { id: "o4", name: "Settlement issue",  desc: "Failed or delayed" },
    ],
  },
  {
    id: "system", name: "Platform & System", tone: "system", blurb: "Infra health and releases",
    steps: [
      { id: "s1", name: "Deployment",        desc: "New version rolled out" },
      { id: "s2", name: "Degraded service",  desc: "Latency or errors elevated" },
      { id: "s3", name: "Incident declared", desc: "Active incident" },
      { id: "s4", name: "Resolved",          desc: "Service restored" },
    ],
  },
  {
    id: "news", name: "Market Commentary", tone: "news", blurb: "Macro and desk notes",
    steps: [
      { id: "n1", name: "Morning note",      desc: "Daily open commentary" },
      { id: "n2", name: "Intraday update",   desc: "Session-driven notes" },
      { id: "n3", name: "Closing summary",   desc: "End-of-day wrap" },
    ],
  },
];

export const PRESETS: PresetConfig[] = [
  { id: "g-fx-ldn", label: "FX Trading — London", config: {
      trade: ["t1","t2","t3","t4","t5","t6"],
      risk:  ["r1","r2","r4","r5"],
      system:["s2","s3","s4"],
      news:  ["n1","n3"],
  }},
  { id: "g-ops", label: "Middle Office", config: {
      trade: ["t4","t5","t6"],
      ops:   ["o1","o2","o3","o4"],
      compli:["c1","c2"],
  }},
  { id: "g-risk", label: "Market Risk", config: {
      risk:  ["r1","r2","r3","r4","r5"],
      trade: ["t4","t5"],
      compli:["c1","c2","c5"],
  }},
  { id: "g-sre", label: "SRE on-call", config: {
      system:["s1","s2","s3","s4"],
      risk:  ["r2"],
  }},
];

export const INITIAL_CONFIGS: Record<string, Record<string, string[]>> = {
  "g-fx-ldn":  { trade:["t1","t2","t4","t6"], risk:["r1","r2","r4"], system:["s2","s3"] },
  "g-fx-sgp":  { trade:["t1","t4"], risk:["r2"] },
  "g-rates":   { trade:["t4","t6"] },
  "g-ops":     { trade:["t4","t5","t6"], ops:["o1","o2","o3"] },
  "g-settle":  { trade:["t6"], ops:["o3","o4"] },
  "g-risk":    { risk:["r1","r2","r3","r4","r5"], compli:["c1","c2"] },
  "g-compli":  { compli:["c1","c2","c3","c5"] },
  "g-sre":     { system:["s1","s2","s3","s4"] },
  "g-platform":{ system:["s1","s2","s3","s4"] },
  "g-sales-emea": { trade:["t4"], news:["n1","n2","n3"] },
  "g-sales-apac": { trade:["t4"], news:["n1","n3"] },
  "g-relman":  { news:["n1"] },
};

// Ensure imported as value (silences unused)
export type { TeamId };
