import { useState } from "react";

const specializations = [
  {
    name: "general",
    label: "General",
    rules: 9, skills: 1, workflows: 3, prompts: 0,
    rulesTokens: 2068, skillsTokens: 433, workflowTokens: 599, promptTokens: 0,
    sdlcCoverage: {
      "Project Setup": 100, "Dev Cycle": 100, "Code Review": 100,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 0, "Migration": 0,
      "Debug": 0, "Refactor": 0, "Testing": 0, "Release": 0, "Deploy": 0, "Incident": 0
    },
    strengths: ["Cross-cutting rules complete", "SDLC roles matrix", "Git + CI conventions"],
    gaps: ["No prompts at all", "Only 1 skill (too shallow)", "No feature/epic workflows"],
    orchestrationQuality: 82,
    technicalDepth: 45,
    promptQuality: 0,
    rulesCoverage: 90,
    skillsCoverage: 20,
    duplication: 15,
    verdict: "essential-base",
  },
  {
    name: "backend",
    label: "Backend",
    rules: 4, skills: 5, workflows: 7, prompts: 9,
    rulesTokens: 503, skillsTokens: 504, workflowTokens: 989, promptTokens: 1594,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 85, "Code Review": 60,
      "Feature Dev": 100, "Epic": 100, "Endpoint": 100, "Migration": 100,
      "Debug": 100, "Refactor": 100, "Testing": 100, "Release": 0, "Deploy": 0, "Incident": 0
    },
    strengths: ["7 workflows — widest functional coverage", "Prompts bilingual (new)", "Skills map cleanly to workflows"],
    gaps: ["No release/deploy workflows (depends on platform)", "Skills are very thin (~78 words each)", "code-review prompt exists but no workflow"],
    orchestrationQuality: 88,
    technicalDepth: 52,
    promptQuality: 85,
    rulesCoverage: 85,
    skillsCoverage: 60,
    duplication: 5,
    verdict: "best-in-class",
  },
  {
    name: "frontend",
    label: "Frontend",
    rules: 4, skills: 8, workflows: 5, prompts: 5,
    rulesTokens: 728, skillsTokens: 2106, workflowTokens: 633, promptTokens: 618,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 70, "Epic": 0, "Endpoint": 0, "Migration": 0,
      "Debug": 0, "Refactor": 0, "Testing": 90, "Release": 90, "Deploy": 0, "Incident": 0
    },
    strengths: ["Best skill depth (8 skills, detailed)", "a11y + visual regression coverage unique", "Prompts align 1:1 with workflows"],
    gaps: ["No feature dev / epic workflows", "No debug/refactor workflows", "No cross-cutting dev-cycle integration"],
    orchestrationQuality: 72,
    technicalDepth: 75,
    promptQuality: 70,
    rulesCoverage: 80,
    skillsCoverage: 85,
    duplication: 8,
    verdict: "strong-specialist",
  },
  {
    name: "full-stack",
    label: "Full-Stack",
    rules: 21, skills: 10, workflows: 3, prompts: 4,
    rulesTokens: 2765, skillsTokens: 10616, workflowTokens: 1085, promptTokens: 185,
    sdlcCoverage: {
      "Project Setup": 100, "Dev Cycle": 70, "Code Review": 0,
      "Feature Dev": 85, "Epic": 0, "Endpoint": 0, "Migration": 60,
      "Debug": 0, "Refactor": 0, "Testing": 85, "Release": 0, "Deploy": 0, "Incident": 0
    },
    strengths: ["Deepest skills (app-builder, api-patterns — 10k+ words)", "backend-project-full-cycle is the most complete workflow", "python-pro + bash-pro unique tools"],
    gaps: ["21 rules — 7 are duplicates of general/ (2765 tokens wasted always-on)", "Fewest workflows (only 3) for largest token footprint", "Prompts minimal (4 files, 185 words total)", "No epic, refactor, debug, incident workflows"],
    orchestrationQuality: 65,
    technicalDepth: 90,
    promptQuality: 15,
    rulesCoverage: 70,
    skillsCoverage: 95,
    duplication: 33,
    verdict: "needs-surgery",
  },
  {
    name: "data-engineering",
    label: "Data Eng.",
    rules: 4, skills: 7, workflows: 5, prompts: 5,
    rulesTokens: 572, skillsTokens: 1357, workflowTokens: 1065, promptTokens: 621,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 0, "Migration": 90,
      "Debug": 90, "Refactor": 0, "Testing": 60, "Release": 0, "Deploy": 0, "Incident": 90
    },
    strengths: ["Domain-specific workflows excellent (backfill, lineage, quality-incident)", "7 skills good depth for domain", "streaming-patterns skill unique"],
    gaps: ["No general feature/epic dev workflow (relies on general)", "sql-optimization skill very thin (177 words)", "No CI/CD integration workflows"],
    orchestrationQuality: 80,
    technicalDepth: 72,
    promptQuality: 72,
    rulesCoverage: 85,
    skillsCoverage: 75,
    duplication: 5,
    verdict: "solid-specialist",
  },
  {
    name: "mlops",
    label: "MLOps",
    rules: 4, skills: 5, workflows: 5, prompts: 5,
    rulesTokens: 607, skillsTokens: 761, workflowTokens: 1080, promptTokens: 618,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 100, "Migration": 0,
      "Debug": 100, "Refactor": 0, "Testing": 90, "Release": 100, "Deploy": 100, "Incident": 100
    },
    strengths: ["ML lifecycle fully covered (train→eval→deploy→monitor→A/B)", "Statistical rigor in champion-challenger", "Incident workflow includes auto-rollback logic"],
    gaps: ["experiment-tracking skill only 65 words (weakest in repo)", "No feature engineering pipeline workflow", "No data preparation / feature store workflows"],
    orchestrationQuality: 85,
    technicalDepth: 68,
    promptQuality: 72,
    rulesCoverage: 88,
    skillsCoverage: 65,
    duplication: 0,
    verdict: "solid-specialist",
  },
  {
    name: "mobile",
    label: "Mobile",
    rules: 4, skills: 6, workflows: 5, prompts: 5,
    rulesTokens: 619, skillsTokens: 1042, workflowTokens: 975, promptTokens: 618,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 0, "Migration": 0,
      "Debug": 100, "Refactor": 0, "Testing": 85, "Release": 100, "Deploy": 100, "Incident": 80
    },
    strengths: ["Store submission + OTA update = complete release path", "Platform-specific nuance (dSYM, ProGuard)", "Crash triage workflow practical and detailed"],
    gaps: ["No feature development workflow (completely absent)", "navigation-patterns + push-notifications skills thin", "Must combine with backend for any API work"],
    orchestrationQuality: 78,
    technicalDepth: 70,
    promptQuality: 72,
    rulesCoverage: 80,
    skillsCoverage: 68,
    duplication: 0,
    verdict: "strong-specialist",
  },
  {
    name: "platform",
    label: "Platform",
    rules: 4, skills: 7, workflows: 5, prompts: 5,
    rulesTokens: 657, skillsTokens: 1588, workflowTokens: 1107, promptTokens: 618,
    sdlcCoverage: {
      "Project Setup": 80, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 0, "Migration": 0,
      "Debug": 0, "Refactor": 0, "Testing": 0, "Release": 0, "Deploy": 100, "Incident": 100
    },
    strengths: ["Progressive rollout with auto-rollback logic is production-grade", "7 skills with Terraform, K8s, secrets well covered", "Cost audit unique — no other specialization has it"],
    gaps: ["No testing workflows at all", "No drift-check for non-Terraform infra (Helm, CDK)", "incident-response lacks runbook templating skill"],
    orchestrationQuality: 82,
    technicalDepth: 78,
    promptQuality: 72,
    rulesCoverage: 85,
    skillsCoverage: 80,
    duplication: 0,
    verdict: "solid-specialist",
  },
  {
    name: "qa",
    label: "QA",
    rules: 4, skills: 6, workflows: 5, prompts: 5,
    rulesTokens: 540, skillsTokens: 928, workflowTokens: 614, promptTokens: 621,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 0, "Migration": 0,
      "Debug": 0, "Refactor": 0, "Testing": 100, "Release": 80, "Deploy": 0, "Incident": 0
    },
    strengths: ["Flakiness policy workflow — most operational of all QA tools", "test-pyramid skill provides clear guidance", "quality-gates rules are well-defined"],
    gaps: ["Workflow tokens too low (614) — steps lack technical depth", "No security testing workflow (overlaps with security/)", "skills are very thin (avg 119 words each)"],
    orchestrationQuality: 75,
    technicalDepth: 55,
    promptQuality: 72,
    rulesCoverage: 82,
    skillsCoverage: 55,
    duplication: 10,
    verdict: "needs-depth",
  },
  {
    name: "security",
    label: "Security",
    rules: 4, skills: 6, workflows: 5, prompts: 5,
    rulesTokens: 756, skillsTokens: 1160, workflowTokens: 949, promptTokens: 623,
    sdlcCoverage: {
      "Project Setup": 0, "Dev Cycle": 0, "Code Review": 0,
      "Feature Dev": 0, "Epic": 0, "Endpoint": 0, "Migration": 0,
      "Debug": 0, "Refactor": 0, "Testing": 90, "Release": 0, "Deploy": 0, "Incident": 80
    },
    strengths: ["STRIDE threat model workflow is best-in-class for security", "secret-rotation with dual-read window is production-grade", "OWASP coverage explicit in pen-test-sim"],
    gaps: ["No SBOM / supply chain security workflow", "compliance-report doesn't automate evidence collection", "dependency-audit skill thin (139 words)"],
    orchestrationQuality: 80,
    technicalDepth: 72,
    promptQuality: 72,
    rulesCoverage: 85,
    skillsCoverage: 70,
    duplication: 0,
    verdict: "solid-specialist",
  },
];

const sdlcDimensions = [
  "Project Setup","Dev Cycle","Code Review","Feature Dev","Epic",
  "Endpoint","Migration","Debug","Refactor","Testing","Release","Deploy","Incident"
];

const verdictConfig = {
  "best-in-class":    { label: "Best-in-class", color: "#22c55e", bg: "#052e16" },
  "essential-base":   { label: "Essential base", color: "#3b82f6", bg: "#0c1a3d" },
  "strong-specialist":{ label: "Strong specialist", color: "#a78bfa", bg: "#2e1065" },
  "solid-specialist": { label: "Solid specialist", color: "#60a5fa", bg: "#0c1a3d" },
  "needs-surgery":    { label: "Needs surgery", color: "#f97316", bg: "#431407" },
  "needs-depth":      { label: "Needs depth", color: "#facc15", bg: "#2d1e00" },
};

const scoreColor = (v) => {
  if (v >= 85) return "#22c55e";
  if (v >= 70) return "#60a5fa";
  if (v >= 50) return "#facc15";
  return "#f97316";
};

const Bar = ({ value, max = 100, color }) => (
  <div style={{ background: "#1e293b", borderRadius: 3, height: 6, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s" }} />
  </div>
);

const MetricRow = ({ label, value, max = 100 }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
      <span style={{ color: scoreColor(value), fontSize: 12, fontWeight: 600 }}>{value}%</span>
    </div>
    <Bar value={value} color={scoreColor(value)} />
  </div>
);

const CoverageCell = ({ value }) => {
  const bg = value === 100 ? "#052e16" : value >= 70 ? "#0c1a3d" : value > 0 ? "#2d1e00" : "#1e1e1e";
  const color = value === 100 ? "#22c55e" : value >= 70 ? "#60a5fa" : value > 0 ? "#facc15" : "#334155";
  return (
    <td style={{ padding: "5px 4px", textAlign: "center", background: bg }}>
      <span style={{ color, fontSize: 11, fontWeight: value > 0 ? 600 : 400 }}>
        {value > 0 ? `${value}%` : "—"}
      </span>
    </td>
  );
};

export default function App() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("scorecard"); // scorecard | coverage | tokens

  const sel = selected !== null ? specializations[selected] : null;

  const avgScore = (s) => Math.round(
    (s.orchestrationQuality + s.technicalDepth + s.promptQuality + s.rulesCoverage + s.skillsCoverage) / 5
  );

  // Token budget data
  const tokenScenarios = [
    {
      label: "general + backend (ideal)",
      always: Math.round((2068+433 + 503+504) * 1.3),
      onDemand: Math.round((599 + 989) / 2 * 1.3),
      desc: "Rules + skills at start, one workflow + 2 skills on command"
    },
    {
      label: "full-stack only (old, all rules)",
      always: Math.round((2765 + 10616) * 1.3),
      onDemand: Math.round(1085 * 1.3),
      desc: "21 rules + all 10 skills loaded at session start"
    },
    {
      label: "general + backend + qa",
      always: Math.round((2068+433 + 503+504 + 540+928) * 1.3),
      onDemand: Math.round((989 + 614) / 2 * 1.3),
      desc: "Typical full team install"
    },
    {
      label: "full-stack (after cleanup)",
      always: Math.round((1400 + 10616) * 1.3),
      onDemand: Math.round(1085 * 1.3),
      desc: "After removing 7 duplicate rules from full-stack"
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh", padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 32, background: "#3b82f6", borderRadius: 4 }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>agent-guides · Coverage & Efficiency Report</h1>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#64748b" }}>10 specializations · 48 workflows · 63 skills · 48 prompts · areas/software</p>
          </div>
        </div>
        {/* View tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {[["scorecard","Score Cards"],["coverage","SDLC Coverage"],["tokens","Token Budget"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid",
              borderColor: view === v ? "#3b82f6" : "#1e293b",
              background: view === v ? "#1e3a5f" : "#1e293b",
              color: view === v ? "#60a5fa" : "#94a3b8",
              fontSize: 13, cursor: "pointer", fontWeight: view === v ? 600 : 400
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* SCORECARD VIEW */}
      {view === "scorecard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
            {specializations.map((s, i) => {
              const v = verdictConfig[s.verdict];
              const score = avgScore(s);
              const isSelected = selected === i;
              return (
                <div key={s.name} onClick={() => setSelected(isSelected ? null : i)}
                  style={{ background: isSelected ? "#1e293b" : "#111827", border: `1.5px solid ${isSelected ? "#3b82f6" : "#1e293b"}`,
                    borderRadius: 10, padding: 14, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{s.label}</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: scoreColor(score) }}>{score}</span>
                  </div>
                  <div style={{ background: v.bg, border: `1px solid ${v.color}33`, borderRadius: 4, padding: "3px 7px", marginBottom: 10, display: "inline-block" }}>
                    <span style={{ color: v.color, fontSize: 11, fontWeight: 600 }}>{v.label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
                    <span>⚙ {s.rules} rules</span><span>🧠 {s.skills} skills</span>
                    <span>⚡ {s.workflows} workflows</span><span>📝 {s.prompts} prompts</span>
                  </div>
                  <MetricRow label="Orchestration" value={s.orchestrationQuality} />
                  <MetricRow label="Tech Depth" value={s.technicalDepth} />
                  <MetricRow label="Prompts" value={s.promptQuality} />
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {sel && (
            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18, color: "#f1f5f9" }}>{sel.label} — Detail</h2>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Metrics</h3>
                  <MetricRow label="Orchestration quality" value={sel.orchestrationQuality} />
                  <MetricRow label="Technical depth" value={sel.technicalDepth} />
                  <MetricRow label="Prompt quality" value={sel.promptQuality} />
                  <MetricRow label="Rules coverage" value={sel.rulesCoverage} />
                  <MetricRow label="Skills coverage" value={sel.skillsCoverage} />
                  <div style={{ marginTop: 12, padding: 8, background: "#0f172a", borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Duplication risk</div>
                    <div style={{ color: sel.duplication > 20 ? "#f97316" : sel.duplication > 5 ? "#facc15" : "#22c55e", fontWeight: 700, fontSize: 16 }}>{sel.duplication}%</div>
                  </div>
                </div>
                <div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>✅ Strengths</h3>
                  {sel.strengths.map((s, i) => (
                    <div key={i} style={{ color: "#86efac", fontSize: 12, marginBottom: 7, paddingLeft: 10, borderLeft: "2px solid #22c55e" }}>{s}</div>
                  ))}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>⚠ Gaps</h3>
                  {sel.gaps.map((g, i) => (
                    <div key={i} style={{ color: "#fca5a5", fontSize: 12, marginBottom: 7, paddingLeft: 10, borderLeft: "2px solid #ef4444" }}>{g}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COVERAGE MATRIX VIEW */}
      {view === "coverage" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", background: "#111827", fontWeight: 600, borderBottom: "1px solid #1e293b", position: "sticky", left: 0 }}>Specialization</th>
                {sdlcDimensions.map(d => (
                  <th key={d} style={{ padding: "8px 6px", textAlign: "center", color: "#64748b", background: "#111827", fontWeight: 600, borderBottom: "1px solid #1e293b", fontSize: 11, whiteSpace: "nowrap" }}>{d}</th>
                ))}
                <th style={{ padding: "8px 10px", textAlign: "center", color: "#64748b", background: "#111827", fontWeight: 600, borderBottom: "1px solid #1e293b" }}>Avg</th>
              </tr>
            </thead>
            <tbody>
              {specializations.map((s, i) => {
                const vals = Object.values(s.sdlcCoverage);
                const covered = vals.filter(v => v > 0).length;
                const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                return (
                  <tr key={s.name} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "7px 12px", background: "#111827", position: "sticky", left: 0, minWidth: 100 }}>
                      <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{s.label}</div>
                      <div style={{ color: "#64748b", fontSize: 10 }}>{covered}/{sdlcDimensions.length} covered</div>
                    </td>
                    {sdlcDimensions.map(d => (
                      <CoverageCell key={d} value={s.sdlcCoverage[d]} />
                    ))}
                    <td style={{ padding: "7px 10px", textAlign: "center" }}>
                      <span style={{ color: scoreColor(avg), fontWeight: 700, fontSize: 13 }}>{avg}%</span>
                    </td>
                  </tr>
                );
              })}
              {/* Combined row */}
              <tr style={{ borderTop: "2px solid #3b82f6" }}>
                <td style={{ padding: "7px 12px", background: "#0c1a3d", position: "sticky", left: 0 }}>
                  <div style={{ fontWeight: 700, color: "#60a5fa", fontSize: 12 }}>general+backend+qa+platform</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>Recommended combo</div>
                </td>
                {sdlcDimensions.map(d => {
                  const combo = ["general","backend","qa","platform"];
                  const max = Math.max(...combo.map(name => {
                    const sp = specializations.find(s => s.name === name);
                    return sp ? sp.sdlcCoverage[d] : 0;
                  }));
                  return <CoverageCell key={d} value={max} />;
                })}
                <td style={{ padding: "7px 10px", textAlign: "center" }}>
                  <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13 }}>82%</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 16, display: "flex", gap: 12, fontSize: 11, color: "#64748b" }}>
            <span><span style={{ color: "#22c55e" }}>■</span> 100%</span>
            <span><span style={{ color: "#60a5fa" }}>■</span> 70–99%</span>
            <span><span style={{ color: "#facc15" }}>■</span> 1–69%</span>
            <span><span style={{ color: "#334155" }}>■</span> Not covered</span>
          </div>
        </div>
      )}

      {/* TOKEN BUDGET VIEW */}
      {view === "tokens" && (
        <div>
          {/* Per-specialization token breakdown */}
          <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Token Footprint per Specialization</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {specializations.map(s => {
              const totalWords = s.rulesTokens + s.skillsTokens + s.workflowTokens + s.promptTokens;
              const alwaysOn = Math.round((s.rulesTokens) * 1.3);
              const maxOnDemand = Math.round((s.skillsTokens + s.workflowTokens) * 1.3);
              const maxTotal = Math.round(totalWords * 1.3);
              const isProblematic = s.name === "full-stack";
              return (
                <div key={s.name} style={{ background: "#111827", border: `1px solid ${isProblematic ? "#f9731633" : "#1e293b"}`, borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: "#f1f5f9", width: 110, fontSize: 13 }}>{s.label}</span>
                    {isProblematic && <span style={{ background: "#431407", color: "#f97316", fontSize: 10, padding: "1px 6px", borderRadius: 3, fontWeight: 600 }}>⚠ TOKEN HEAVY</span>}
                    <div style={{ flex: 1, display: "flex", gap: 8, justifyContent: "flex-end", fontSize: 11, color: "#94a3b8" }}>
                      <span>Always-on: <span style={{ color: isProblematic ? "#f97316" : "#60a5fa", fontWeight: 600 }}>~{alwaysOn.toLocaleString()} tok</span></span>
                      <span>Max session: <span style={{ color: isProblematic ? "#f97316" : "#94a3b8", fontWeight: 600 }}>~{maxTotal.toLocaleString()} tok</span></span>
                    </div>
                  </div>
                  <div style={{ display: "flex", height: 12, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(s.rulesTokens / totalWords) * 100}%`, background: "#3b82f6" }} title="Rules (always-on)" />
                    <div style={{ width: `${(s.skillsTokens / totalWords) * 100}%`, background: "#8b5cf6" }} title="Skills (on-demand)" />
                    <div style={{ width: `${(s.workflowTokens / totalWords) * 100}%`, background: "#10b981" }} title="Workflows (on-command)" />
                    <div style={{ width: `${(s.promptTokens / totalWords) * 100}%`, background: "#f59e0b" }} title="Prompts (human)" />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 5, fontSize: 10, color: "#64748b" }}>
                    <span><span style={{ color: "#3b82f6" }}>■</span> Rules {Math.round((s.rulesTokens/totalWords)*100)}%</span>
                    <span><span style={{ color: "#8b5cf6" }}>■</span> Skills {Math.round((s.skillsTokens/totalWords)*100)}%</span>
                    <span><span style={{ color: "#10b981" }}>■</span> Workflows {Math.round((s.workflowTokens/totalWords)*100)}%</span>
                    <span><span style={{ color: "#f59e0b" }}>■</span> Prompts {Math.round((s.promptTokens/totalWords)*100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scenario comparison */}
          <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>Install Scenario Comparison</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {tokenScenarios.map((sc, i) => {
              const isGood = sc.always < 8000;
              return (
                <div key={i} style={{ background: "#111827", border: `1px solid ${isGood ? "#1e293b" : "#f9731633"}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 600, color: "#f1f5f9", marginBottom: 4, fontSize: 13 }}>{sc.label}</div>
                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 12 }}>{sc.desc}</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Always-on tokens</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: isGood ? "#60a5fa" : "#f97316" }}>{sc.always.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Per-command tokens</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>{sc.onDemand.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Efficiency ratio</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#a78bfa" }}>
                        {Math.round(sc.onDemand / sc.always * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key finding */}
          <div style={{ marginTop: 16, background: "#052e16", border: "1px solid #22c55e33", borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 600, color: "#22c55e", marginBottom: 6, fontSize: 13 }}>💡 Key finding: lazy loading works, but full-stack breaks the model</div>
            <div style={{ color: "#86efac", fontSize: 12, lineHeight: 1.6 }}>
              For all specializations except full-stack, the always-on token cost (rules only) is 500–2700 words — well within budget. 
              The on-demand overhead per command is 400–1100 words (one workflow + 1-2 skills). Total active session context stays under ~7k tokens.
              Full-stack's 21 rules + 10 deep skills push always-on cost to 17k+ words before any workflow loads.
            </div>
          </div>
        </div>
      )}

      {/* Verdict section */}
      <div style={{ marginTop: 28, background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#f1f5f9" }}>⚖️ Verdict: What to fix vs. what to leave</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ color: "#ef4444", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>🔴 Must fix (high ROI)</div>
            {[
              ["full-stack rules bloat", "Remove 7 duplicate rules → saves ~1800 always-on words per session. Highest single fix."],
              ["backend skills depth", "5 skills at 78 words each is near-useless. Each needs 300–500 words of actual patterns."],
              ["qa skill depth", "6 skills at avg 119 words. test-pyramid, e2e-patterns need concrete examples, not bullet points."],
              ["general: add prompts", "0 prompts for 3 workflows. /dev, /code-review, /project-setup each need a bilingual prompt."],
              ["frontend: missing feature workflow", "No /develop-feature or /debug-issue — developers using only frontend are lost."],
            ].map(([t, d]) => (
              <div key={t} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: "2px solid #ef4444" }}>
                <div style={{ color: "#fca5a5", fontWeight: 600, fontSize: 12 }}>{t}</div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{d}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>🟢 Leave / low priority</div>
            {[
              ["mlops lifecycle completeness", "train→eval→deploy→monitor→A/B is fully covered. Don't over-engineer."],
              ["platform workflow logic", "Progressive rollout + auto-rollback logic is already production-grade."],
              ["security STRIDE workflow", "Best-in-class threat modeling. No changes needed."],
              ["data-engineering domain coverage", "All 5 key DE operations covered. Domain-specific and accurate."],
              ["prompt structure (new)", "New bilingual 3-example format is correct — just needs to be applied to all areas."],
            ].map(([t, d]) => (
              <div key={t} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: "2px solid #22c55e" }}>
                <div style={{ color: "#86efac", fontWeight: 600, fontSize: 12 }}>{t}</div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
