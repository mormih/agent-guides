import { useState } from "react";

// ─── COLOUR HELPERS ─────────────────────────────────────────────────────────
const sc = v => v >= 85 ? "#22c55e" : v >= 70 ? "#60a5fa" : v >= 50 ? "#facc15" : "#f97316";
const bg = v => v >= 85 ? "#052e16" : v >= 70 ? "#0c1a3d" : v >= 50 ? "#2a1a00" : "#2a0a00";

// ─── SOFTWARE AREA DATA ──────────────────────────────────────────────────────
const SW_SPECS = [
  {
    area:"software", id:"general", label:"General", icon:"📐",
    color:"#64748b", light:"#f1f5f9",
    rules:9, skills:1, workflows:3, prompts:3, lines:1900,
    orch:82, depth:68, prompt:82, rcov:90, scov:55, dup:15,
    verdict:"essential-base",
    sdlcCols:{"Proj Setup":100,"Dev Cycle":100,"Code Review":100,"Feature":0,"Debug":0,"Testing":0,"Release":0,"Deploy":0,"Incident":0},
    strengths:["9 always-on rules, cross-cutting coverage","3 bilingual prompts (dev, code-review, project-setup)","general-dev-tools skill fully rewritten 333→865w"],
    gaps:["Only 1 skill — needs security-basics, git-advanced","No feature/debug/incident workflows"],
    promptFiles:["dev","code-review","project-setup"], promptBilingual:true, promptExamples:3, promptAvgW:280,
  },
  {
    area:"software", id:"backend", label:"Backend", icon:"⚙️",
    color:"#3b82f6", light:"#eff6ff",
    rules:4, skills:5, workflows:7, prompts:9, lines:4200,
    orch:88, depth:82, prompt:85, rcov:85, scov:88, dup:5,
    verdict:"best-in-class",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":85,"Code Review":60,"Feature":100,"Debug":100,"Testing":100,"Release":0,"Deploy":0,"Incident":0},
    strengths:["7 workflows covering full dev lifecycle","5 skills 464–649w with real code examples","9 bilingual prompts at 291–367w each"],
    gaps:["No release/deploy workflows (platform boundary)"],
    promptFiles:["develop-feature","debug-issue","create-endpoint","add-migration","test-feature","refactor-module","develop-epic","code-review","system-prompt"],
    promptBilingual:true, promptExamples:3, promptAvgW:330,
  },
  {
    area:"software", id:"frontend", label:"Frontend", icon:"🎨",
    color:"#f59e0b", light:"#fffbeb",
    rules:4, skills:8, workflows:5, prompts:5, lines:3100,
    orch:72, depth:80, prompt:80, rcov:80, scov:82, dup:8,
    verdict:"strong-specialist",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":0,"Code Review":0,"Feature":70,"Debug":0,"Testing":90,"Release":90,"Deploy":0,"Incident":0},
    strengths:["component-design 654w with compound/controlled patterns","css-architecture NEW — tokens, BEM, Tailwind cva","5 bilingual prompts aligned to workflows"],
    gaps:["No feature dev or debug workflows","6 of 8 skills still thin (166–254w)"],
    promptFiles:["scaffold-component","a11y-fix","visual-regression","bundle-analyze","release-prep"],
    promptBilingual:true, promptExamples:2, promptAvgW:220,
  },
  {
    area:"software", id:"full-stack", label:"Full-Stack", icon:"🔗",
    color:"#8b5cf6", light:"#f5f3ff",
    rules:17, skills:46, workflows:5, prompts:7, lines:12000,
    orch:78, depth:82, prompt:88, rcov:78, scov:75, dup:10,
    verdict:"recovering",
    sdlcCols:{"Proj Setup":100,"Dev Cycle":70,"Code Review":0,"Feature":85,"Debug":85,"Testing":85,"Release":0,"Deploy":0,"Incident":0},
    strengths:["5 prompts rewritten bilingual, 3 examples each","backend-new-project with layered arch spec","debug-issue: stack trace + perf regression + race condition"],
    gaps:["code-review & refactor workflows missing","17 rules (duplicate bloat), skill-creator 2874w pending removal"],
    promptFiles:["backend-new-project","backend-feature-impl","develop-feature","debug-issue","testing-ci-pipeline"],
    promptBilingual:true, promptExamples:3, promptAvgW:506,
  },
  {
    area:"software", id:"data-engineering", label:"Data Eng.", icon:"🔄",
    color:"#06b6d4", light:"#ecfeff",
    rules:4, skills:7, workflows:5, prompts:5, lines:2800,
    orch:80, depth:72, prompt:88, rcov:85, scov:75, dup:5,
    verdict:"solid-specialist",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":0,"Code Review":0,"Feature":0,"Debug":90,"Testing":60,"Release":0,"Deploy":0,"Incident":90},
    strengths:["5 bilingual prompts with real dbt/Airflow context","backfill-data: pipeline fix + new metric + DLQ replay","lineage-trace: blast radius + GDPR provenance"],
    gaps:["No feature-dev workflow","sql-optimization skill still 177w"],
    promptFiles:["new-model","backfill-data","schema-migration","data-quality-incident","lineage-trace"],
    promptBilingual:true, promptExamples:3, promptAvgW:468,
  },
  {
    area:"software", id:"mlops", label:"MLOps", icon:"🤖",
    color:"#ec4899", light:"#fdf2f8",
    rules:4, skills:5, workflows:5, prompts:5, lines:2200,
    orch:85, depth:68, prompt:72, rcov:88, scov:65, dup:0,
    verdict:"solid-specialist",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":0,"Code Review":0,"Feature":0,"Debug":100,"Testing":90,"Release":100,"Deploy":100,"Incident":100},
    strengths:["ML lifecycle train→eval→deploy→monitor→A/B fully covered","Champion-challenger with statistical rigor","Auto-rollback in deploy workflow"],
    gaps:["experiment-tracking skill 65w","No feature engineering workflow","Prompts generic — bilingual rewrite pending"],
    promptFiles:["train-model","evaluate-model","deploy-model","monitor-drift","ab-experiment"],
    promptBilingual:false, promptExamples:0, promptAvgW:95,
  },
  {
    area:"software", id:"mobile", label:"Mobile", icon:"📱",
    color:"#10b981", light:"#ecfdf5",
    rules:4, skills:6, workflows:5, prompts:5, lines:2400,
    orch:78, depth:70, prompt:85, rcov:80, scov:68, dup:0,
    verdict:"strong-specialist",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":0,"Code Review":0,"Feature":0,"Debug":100,"Testing":85,"Release":100,"Deploy":100,"Incident":80},
    strengths:["5 bilingual prompts added from scratch","crash-triage: iOS/Android platform-specific nuance","Store + OTA = complete release path covered"],
    gaps:["No feature development workflow","mobile-testing skill still 104w"],
    promptFiles:["crash-triage","release-build","store-submission","ota-update","device-testing"],
    promptBilingual:true, promptExamples:2, promptAvgW:250,
  },
  {
    area:"software", id:"platform", label:"Platform", icon:"🚢",
    color:"#0ea5e9", light:"#f0f9ff",
    rules:4, skills:7, workflows:5, prompts:5, lines:3200,
    orch:82, depth:78, prompt:88, rcov:85, scov:80, dup:0,
    verdict:"solid-specialist",
    sdlcCols:{"Proj Setup":80,"Dev Cycle":0,"Code Review":0,"Feature":0,"Debug":0,"Testing":0,"Release":0,"Deploy":100,"Incident":100},
    strengths:["5 bilingual prompts with real infra scenarios","deploy-production: canary + hotfix + multi-service","incident-response: P1 outage + P2 degradation + postmortem"],
    gaps:["Overlaps with devops/kubernetes (boundary underspecified)","No dev cycle workflows (intentional boundary)"],
    promptFiles:["deploy-production","incident-response","provision-env","drift-check","cost-audit"],
    promptBilingual:true, promptExamples:3, promptAvgW:455,
  },
  {
    area:"software", id:"qa", label:"QA", icon:"✅",
    color:"#84cc16", light:"#f7fee7",
    rules:4, skills:6, workflows:5, prompts:5, lines:2500,
    orch:80, depth:72, prompt:85, rcov:82, scov:72, dup:0,
    verdict:"solid-specialist",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":0,"Code Review":90,"Feature":0,"Debug":100,"Testing":100,"Release":85,"Deploy":0,"Incident":80},
    strengths:["5 bilingual prompts covering full QA lifecycle","test-strategy: risk-based + regression + exploratory","perf-test: k6 script + threshold + spike test"],
    gaps:["Some skills still thin (150–200w)","No integration test workflow"],
    promptFiles:["write-tests","debug-failure","test-strategy","perf-test","regression-check"],
    promptBilingual:true, promptExamples:2, promptAvgW:320,
  },
  {
    area:"software", id:"security", label:"Security", icon:"🔐",
    color:"#ef4444", light:"#fef2f2",
    rules:4, skills:6, workflows:5, prompts:5, lines:2800,
    orch:80, depth:72, prompt:85, rcov:85, scov:70, dup:0,
    verdict:"solid-specialist",
    sdlcCols:{"Proj Setup":0,"Dev Cycle":0,"Code Review":100,"Feature":0,"Debug":90,"Testing":80,"Release":80,"Deploy":0,"Incident":100},
    strengths:["5 bilingual prompts at 414w avg","threat-model: STRIDE + PASTA methodology","pentest-report: CVSS scoring + remediation timeline"],
    gaps:["No SAST/DAST workflow","skill content still light vs devsecops area"],
    promptFiles:["threat-model","code-review-security","pentest-report","incident-response","compliance-check"],
    promptBilingual:true, promptExamples:3, promptAvgW:414,
  },
];

// ─── DEVOPS AREA DATA ────────────────────────────────────────────────────────
const DO_SPECS = [
  {
    area:"devops", id:"kubernetes", label:"Kubernetes", icon:"⎈",
    color:"#326CE5", light:"#EBF2FD",
    rules:4, skills:6, workflows:4, prompts:5, lines:2166,
    orch:92, depth:90, prompt:88, rcov:95, scov:92, dup:0,
    verdict:"best-in-class",
    devopsCols:{"Infra Provision":60,"Node Config":100,"Pipeline":0,"Svc Deploy":100,"Observability":70,"Alerting":50,"Incident":80,"Postmortem":0,"Sec Scan":60,"Backup/DR":60,"Cost/Cap":40,"Policy":80},
    strengths:["6 skills + 4 workflows = most complete spec","Real kubeadm YAML, Cilium, etcd, PSA in every file","5 bilingual prompts cover full lifecycle"],
    gaps:["No observability-setup workflow (cross-spec)","Cost/capacity underrepresented"],
    promptFiles:["/cluster-bootstrap","/onboard-service","/upgrade-cluster","/debug-workload","/rbac-audit"],
    promptBilingual:true, promptExamples:3, promptAvgW:370,
  },
  {
    area:"devops", id:"ci-cd", label:"CI/CD", icon:"🚀",
    color:"#F05032", light:"#FEF0ED",
    rules:3, skills:5, workflows:3, prompts:5, lines:1634,
    orch:85, depth:85, prompt:88, rcov:88, scov:90, dup:0,
    verdict:"best-in-class",
    devopsCols:{"Infra Provision":0,"Node Config":0,"Pipeline":100,"Svc Deploy":90,"Observability":40,"Alerting":0,"Incident":30,"Postmortem":0,"Sec Scan":80,"Backup/DR":0,"Cost/Cap":50,"Policy":60},
    strengths:["Real GHA YAML + GitLab CI YAML in skills","Supply chain: SBOM + cosign + SLSA provenance","5 prompts cover onboard/release/debug/optimize/supply-chain"],
    gaps:["Only 3 workflows (no canary-deploy workflow)","No cross-spec integration with observability"],
    promptFiles:["/onboard-repo","/release-pipeline","/pipeline-debug","/build-optimize","/supply-chain"],
    promptBilingual:true, promptExamples:3, promptAvgW:380,
  },
  {
    area:"devops", id:"infrastructure", label:"Infrastructure", icon:"🏗️",
    color:"#7B42BC", light:"#F4EDFB",
    rules:4, skills:5, workflows:4, prompts:5, lines:1806,
    orch:85, depth:88, prompt:82, rcov:90, scov:85, dup:0,
    verdict:"best-in-class",
    devopsCols:{"Infra Provision":100,"Node Config":90,"Pipeline":20,"Svc Deploy":30,"Observability":0,"Alerting":0,"Incident":30,"Postmortem":0,"Sec Scan":50,"Backup/DR":40,"Cost/Cap":90,"Policy":50},
    strengths:["Real TF HCL with for_each, moved{}, validation","Ansible roles with handlers, vault, molecule","4 workflows: provision→destroy→drift→module-dev"],
    gaps:["Skills avg thin (state-mgmt, cost-opt) vs others","No secrets rotation workflow"],
    promptFiles:["/provision-env","/drift-check","/module-develop","/ansible-config","/cost-review"],
    promptBilingual:true, promptExamples:3, promptAvgW:340,
  },
  {
    area:"devops", id:"observability", label:"Observability", icon:"📊",
    color:"#F46800", light:"#FEF3EA",
    rules:3, skills:5, workflows:3, prompts:5, lines:1754,
    orch:82, depth:90, prompt:88, rcov:88, scov:88, dup:0,
    verdict:"best-in-class",
    devopsCols:{"Infra Provision":0,"Node Config":0,"Pipeline":20,"Svc Deploy":40,"Observability":100,"Alerting":100,"Incident":60,"Postmortem":20,"Sec Scan":0,"Backup/DR":0,"Cost/Cap":30,"Policy":0},
    strengths:["Real PromQL, LogQL, OTel SDK code in skills","Multi-window burn rate alerting + Sloth integration","Trace→log correlation with trace_id injection"],
    gaps:["Grafana-dashboards skill thinner than others","No VictoriaMetrics/Thanos long-term storage workflow"],
    promptFiles:["/onboard-monitoring","/observability-stack","/alert-investigation","/slo-dashboard","/tracing-debug"],
    promptBilingual:true, promptExamples:3, promptAvgW:380,
  },
  {
    area:"devops", id:"sre", label:"SRE", icon:"🛡️",
    color:"#0F9D58", light:"#E8F5EE",
    rules:3, skills:5, workflows:3, prompts:5, lines:1508,
    orch:85, depth:82, prompt:90, rcov:88, scov:85, dup:0,
    verdict:"best-in-class",
    devopsCols:{"Infra Provision":0,"Node Config":0,"Pipeline":0,"Svc Deploy":0,"Observability":60,"Alerting":80,"Incident":100,"Postmortem":100,"Sec Scan":0,"Backup/DR":30,"Cost/Cap":80,"Policy":0},
    strengths:["Best prompt quality — chaos-run, capacity-plan are exemplary","Postmortem template + 5-whys facilitation guide","Burn rate alerting + Sloth SLO-as-code integration"],
    gaps:["Skills slightly thinner than other best-in-class (1508 total lines)","No automated toil-tracking workflow"],
    promptFiles:["/incident-response","/postmortem","/slo-review","/chaos-run","/capacity-plan"],
    promptBilingual:true, promptExamples:3, promptAvgW:400,
  },
  {
    area:"devops", id:"networking", label:"Networking", icon:"🌐",
    color:"#0078D4", light:"#E5F1FB",
    rules:3, skills:5, workflows:2, prompts:5, lines:1531,
    orch:72, depth:85, prompt:85, rcov:85, scov:88, dup:0,
    verdict:"strong-specialist",
    devopsCols:{"Infra Provision":60,"Node Config":0,"Pipeline":0,"Svc Deploy":50,"Observability":0,"Alerting":0,"Incident":30,"Postmortem":0,"Sec Scan":30,"Backup/DR":0,"Cost/Cap":0,"Policy":40},
    strengths:["Real Istio YAML (PeerAuth, AuthorizationPolicy, VirtualService)","VPC 3-tier design + Hetzner Terraform","5 prompts cover ingress/mesh/DNS/TLS/VPC"],
    gaps:["Only 2 workflows (fewest in devops area)","No BGP/Cilium L3 advanced routing coverage"],
    promptFiles:["/onboard-ingress","/service-mesh","/dns-debug","/tls-troubleshoot","/vpc-design"],
    promptBilingual:true, promptExamples:2, promptAvgW:350,
  },
  {
    area:"devops", id:"devsecops", label:"DevSecOps", icon:"🔒",
    color:"#D32F2F", light:"#FDECEA",
    rules:3, skills:5, workflows:2, prompts:5, lines:1627,
    orch:72, depth:88, prompt:85, rcov:85, scov:90, dup:0,
    verdict:"strong-specialist",
    devopsCols:{"Infra Provision":0,"Node Config":0,"Pipeline":80,"Svc Deploy":40,"Observability":0,"Alerting":0,"Incident":30,"Postmortem":0,"Sec Scan":100,"Backup/DR":0,"Cost/Cap":0,"Policy":100},
    strengths:["Real Rego (OPA) + Kyverno YAML policies","Distroless Dockerfile + full securityContext hardening","Secret detection: gitleaks + trufflehog + incident runbook"],
    gaps:["Only 2 workflows — no secrets-rotation workflow","Limited overlap with software/security area"],
    promptFiles:["/security-scan","/policy-onboard","/container-harden","/sbom-sign","/secret-audit"],
    promptBilingual:true, promptExamples:2, promptAvgW:360,
  },
  {
    area:"devops", id:"database-ops", label:"Database Ops", icon:"🗄️",
    color:"#336791", light:"#EBF2F7",
    rules:3, skills:5, workflows:2, prompts:5, lines:1612,
    orch:72, depth:92, prompt:88, rcov:85, scov:90, dup:0,
    verdict:"strong-specialist",
    devopsCols:{"Infra Provision":0,"Node Config":0,"Pipeline":20,"Svc Deploy":20,"Observability":40,"Alerting":40,"Incident":80,"Postmortem":20,"Sec Scan":30,"Backup/DR":100,"Cost/Cap":30,"Policy":40},
    strengths:["Best tech depth — real SQL, pgBackRest PITR, PgBouncer tuning","Expand-and-contract migration pattern with batched backfill script","Redis Sentinel failover test + eviction policy tuning"],
    gaps:["Only 2 workflows — no proactive performance-tuning workflow","No MySQL/MongoDB coverage (Postgres + Redis only)"],
    promptFiles:["/db-incident","/backup-verify","/migration-run","/db-performance","/redis-ops"],
    promptBilingual:true, promptExamples:2, promptAvgW:355,
  },
];

const ALL_SPECS = [...SW_SPECS, ...DO_SPECS];

// ─── SCORING ─────────────────────────────────────────────────────────────────
const avg5 = s => Math.round((s.orch + s.depth + s.prompt + s.rcov + s.scov) / 5);

const VERDICTS = {
  "best-in-class":  { label:"Best in Class",    col:"#22c55e", bg:"#052e16" },
  "strong-specialist":{ label:"Strong Specialist",col:"#60a5fa", bg:"#0c1a3d" },
  "solid-specialist": { label:"Solid Specialist", col:"#a78bfa", bg:"#1e0a47" },
  "recovering":       { label:"Recovering",       col:"#facc15", bg:"#1a1200" },
  "essential-base":   { label:"Essential Base",   col:"#94a3b8", bg:"#0f1729" },
};

// SDLC stages for software
const SW_SDLC = ["Proj Setup","Dev Cycle","Code Review","Feature","Debug","Testing","Release","Deploy","Incident"];
// DevOps lifecycle stages
const DO_SDLC = ["Infra Provision","Node Config","Pipeline","Svc Deploy","Observability","Alerting","Incident","Postmortem","Sec Scan","Backup/DR","Cost/Cap","Policy"];

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function MBar({ val, prev }) {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>
        <span style={{ fontWeight: 600, color: sc(val) }}>{val}</span>
        {prev !== undefined && prev !== val && (
          <span style={{ color: val > prev ? "#22c55e" : "#f97316", fontSize: 10 }}>
            {val > prev ? `▲ +${val - prev}` : `▼ ${val - prev}`}
          </span>
        )}
      </div>
      <div style={{ height: 4, background: "#1e293b", borderRadius: 2 }}>
        <div style={{ height: 4, borderRadius: 2, background: sc(val), width: `${val}%`, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function CCell({ v }) {
  const col = v === 100 ? "#22c55e" : v >= 70 ? "#60a5fa" : v > 0 ? "#facc15" : "#1e293b";
  const tc = v === 100 ? "#052e16" : v >= 70 ? "#0c1a3d" : v > 0 ? "#1a1200" : "#1e293b";
  return (
    <td style={{ padding: "4px 3px", textAlign: "center", background: tc }}>
      <span style={{ color: col, fontWeight: 700, fontSize: 11 }}>{v > 0 ? v : "—"}</span>
    </td>
  );
}

function AreaBadge({ area }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
      background: area === "software" ? "#0c1a3d" : "#052515",
      color: area === "software" ? "#60a5fa" : "#4ade80",
      border: `1px solid ${area === "software" ? "#3b82f620" : "#22c55e20"}`,
      textTransform: "uppercase", letterSpacing: 0.5,
    }}>{area}</span>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("cards");
  const [areaFilter, setAreaFilter] = useState("all"); // all | software | devops
  const [sel, setSel] = useState(null);

  const visibleSpecs = areaFilter === "all" ? ALL_SPECS
    : areaFilter === "software" ? SW_SPECS : DO_SPECS;

  const swAvg = Math.round(SW_SPECS.reduce((a, s) => a + avg5(s), 0) / SW_SPECS.length);
  const doAvg = Math.round(DO_SPECS.reduce((a, s) => a + avg5(s), 0) / DO_SPECS.length);
  const allAvg = Math.round(ALL_SPECS.reduce((a, s) => a + avg5(s), 0) / ALL_SPECS.length);

  const selectedSpec = sel !== null ? ALL_SPECS.find(s => s.id === sel) : null;

  const TABS = [["cards","📋 Cards"],["sdlc","📊 Coverage Matrix"],["prompts","💬 Prompts"],["compare","⚖ Area Compare"]];

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh", padding: 20 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 5, height: 28, background: "linear-gradient(#3b82f6,#22c55e)", borderRadius: 3 }} />
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>
                agent-guides · Unified Coverage Scorecard
              </h1>
            </div>
            <p style={{ margin: "0 0 0 15px", fontSize: 11, color: "#64748b" }}>
              areas/software (10 specs) + areas/devops (8 specs) · 18 specializations · 150+ files · EN+RU bilingual
            </p>
          </div>
          {/* Summary pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { l: "Overall", v: allAvg, col: sc(allAvg) },
              { l: "Software avg", v: swAvg, col: "#60a5fa" },
              { l: "DevOps avg", v: doAvg, col: "#22c55e" },
            ].map(({ l, v, col }) => (
              <div key={l} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: col }}>{v}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {/* Area filter */}
          <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
            {[["all","All Areas"],["software","Software"],["devops","DevOps"]].map(([v, l]) => (
              <button key={v} onClick={() => { setAreaFilter(v); setSel(null); }} style={{
                padding: "5px 12px", borderRadius: 6, border: "1.5px solid",
                fontSize: 11, cursor: "pointer", fontWeight: areaFilter === v ? 700 : 400,
                borderColor: areaFilter === v ? (v === "software" ? "#3b82f6" : v === "devops" ? "#22c55e" : "#94a3b8") : "#1e293b",
                background: areaFilter === v ? (v === "software" ? "#0c1a3d" : v === "devops" ? "#052e16" : "#1e293b") : "#111827",
                color: areaFilter === v ? (v === "software" ? "#60a5fa" : v === "devops" ? "#4ade80" : "#f1f5f9") : "#64748b",
              }}>{l}</button>
            ))}
          </div>
          {/* Tabs */}
          {TABS.map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              padding: "5px 12px", borderRadius: 6, border: "1px solid",
              fontSize: 11, cursor: "pointer", fontWeight: tab === v ? 600 : 400,
              borderColor: tab === v ? "#3b82f6" : "#1e293b",
              background: tab === v ? "#1e3a5f" : "#111827",
              color: tab === v ? "#60a5fa" : "#94a3b8",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── CARDS TAB ── */}
      {tab === "cards" && (<>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
          {visibleSpecs.map(sp => {
            const score = avg5(sp);
            const v = VERDICTS[sp.verdict];
            const isSel = sel === sp.id;
            return (
              <div key={sp.id} onClick={() => setSel(isSel ? null : sp.id)}
                style={{ background: isSel ? "#1e293b" : "#111827", border: `1.5px solid ${isSel ? sp.color : "#1e293b"}`, borderRadius: 10, padding: 12, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 16 }}>{sp.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{sp.label}</span>
                    </div>
                    <AreaBadge area={sp.area} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: sc(score) }}>{score}</div>
                  </div>
                </div>
                <div style={{ background: v.bg, border: `1px solid ${v.col}33`, borderRadius: 4, padding: "2px 7px", display: "inline-block", marginBottom: 8 }}>
                  <span style={{ color: v.col, fontSize: 9, fontWeight: 600 }}>{v.label}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 6px", fontSize: 9, color: "#64748b", marginBottom: 8 }}>
                  <span>📏 {sp.rules} rules</span><span>🔧 {sp.skills} skills</span>
                  <span>📋 {sp.workflows} wf</span><span>💬 {sp.prompts} prompts</span>
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Orchestration</div>
                <MBar val={sp.orch} />
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4, marginTop: 4 }}>Tech Depth</div>
                <MBar val={sp.depth} />
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4, marginTop: 4 }}>Prompts</div>
                <MBar val={sp.prompt} />
              </div>
            );
          })}
        </div>

        {selectedSpec && (
          <div style={{ background: "#111827", border: `1.5px solid ${selectedSpec.color}40`, borderRadius: 10, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{selectedSpec.icon}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, color: "#f1f5f9" }}>{selectedSpec.label}</h2>
                  <AreaBadge area={selectedSpec.area} />
                </div>
              </div>
              <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Metrics</div>
                {[["Orchestration", selectedSpec.orch], ["Technical Depth", selectedSpec.depth], ["Prompt Quality", selectedSpec.prompt], ["Rules Coverage", selectedSpec.rcov], ["Skills Coverage", selectedSpec.scov]].map(([l, v]) => (
                  <div key={l} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{l}</div>
                    <MBar val={v} />
                  </div>
                ))}
                <div style={{ marginTop: 8, background: "#0f172a", borderRadius: 6, padding: "6px 8px", fontSize: 11 }}>
                  <span style={{ color: "#64748b" }}>Duplication: </span>
                  <span style={{ color: selectedSpec.dup > 15 ? "#f97316" : selectedSpec.dup > 0 ? "#facc15" : "#22c55e", fontWeight: 700 }}>{selectedSpec.dup}%</span>
                </div>
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>✅ Strengths</div>
                {selectedSpec.strengths.map((t, i) => <div key={i} style={{ color: "#86efac", fontSize: 11, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #22c55e", lineHeight: 1.5 }}>{t}</div>)}
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>⚠ Gaps</div>
                {selectedSpec.gaps.map((t, i) => <div key={i} style={{ color: "#fca5a5", fontSize: 11, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #ef4444", lineHeight: 1.5 }}>{t}</div>)}
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>💬 Prompts ({selectedSpec.prompts} files)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {selectedSpec.promptFiles.map(f => (
                    <span key={f} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontFamily: "monospace", color: "#a78bfa" }}>{f}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <div style={{ background: "#0f172a", borderRadius: 6, padding: "5px 8px", fontSize: 10 }}>
                    <span style={{ color: "#64748b" }}>Bilingual: </span>
                    <span style={{ color: selectedSpec.promptBilingual ? "#22c55e" : "#f97316", fontWeight: 700 }}>
                      {selectedSpec.promptBilingual ? "✅ EN+RU" : "⚠ EN only"}
                    </span>
                  </div>
                  <div style={{ background: "#0f172a", borderRadius: 6, padding: "5px 8px", fontSize: 10 }}>
                    <span style={{ color: "#64748b" }}>Avg: </span>
                    <span style={{ color: sc(Math.round(selectedSpec.promptAvgW / 6)), fontWeight: 700 }}>{selectedSpec.promptAvgW}w</span>
                  </div>
                  <div style={{ background: "#0f172a", borderRadius: 6, padding: "5px 8px", fontSize: 10 }}>
                    <span style={{ color: "#64748b" }}>Examples: </span>
                    <span style={{ color: selectedSpec.promptExamples >= 3 ? "#22c55e" : selectedSpec.promptExamples >= 2 ? "#60a5fa" : "#f97316", fontWeight: 700 }}>
                      {selectedSpec.promptExamples > 0 ? `${selectedSpec.promptExamples}/file` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>)}

      {/* ── COVERAGE MATRIX TAB ── */}
      {tab === "sdlc" && (
        <div>
          {/* Software SDLC */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 13 }}>📦 areas/software — SDLC Coverage</span>
              <span style={{ color: "#64748b", fontSize: 11 }}>(project lifecycle phases)</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontWeight: 600, minWidth: 100 }}>Spec</th>
                    {SW_SDLC.map(d => <th key={d} style={{ padding: "5px 4px", textAlign: "center", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontWeight: 600, fontSize: 9, whiteSpace: "nowrap" }}>{d}</th>)}
                    <th style={{ padding: "5px 8px", textAlign: "center", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontWeight: 600 }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(areaFilter === "devops" ? [] : SW_SPECS).map(sp => {
                    const vals = Object.values(sp.sdlcCols);
                    const a = Math.round(vals.reduce((x, y) => x + y, 0) / vals.length);
                    return (
                      <tr key={sp.id} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "5px 10px", background: "#111827", fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>
                          {sp.icon} {sp.label}
                        </td>
                        {SW_SDLC.map(d => <CCell key={d} v={sp.sdlcCols[d] ?? 0} />)}
                        <td style={{ padding: "5px 8px", textAlign: "center" }}>
                          <span style={{ color: sc(a), fontWeight: 700 }}>{a}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DevOps Lifecycle */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 13 }}>🔧 areas/devops — Operations Lifecycle Coverage</span>
              <span style={{ color: "#64748b", fontSize: 11 }}>(infrastructure & operations phases)</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontWeight: 600, minWidth: 120 }}>Spec</th>
                    {DO_SDLC.map(d => <th key={d} style={{ padding: "5px 4px", textAlign: "center", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontWeight: 600, fontSize: 9, whiteSpace: "nowrap" }}>{d}</th>)}
                    <th style={{ padding: "5px 8px", textAlign: "center", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontWeight: 600 }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(areaFilter === "software" ? [] : DO_SPECS).map(sp => {
                    const vals = Object.values(sp.devopsCols);
                    const a = Math.round(vals.reduce((x, y) => x + y, 0) / vals.length);
                    return (
                      <tr key={sp.id} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "5px 10px", background: "#111827", fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>
                          {sp.icon} {sp.label}
                        </td>
                        {DO_SDLC.map(d => <CCell key={d} v={sp.devopsCols[d] ?? 0} />)}
                        <td style={{ padding: "5px 8px", textAlign: "center" }}>
                          <span style={{ color: sc(a), fontWeight: 700 }}>{a}%</span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Combined ops coverage row */}
                  {areaFilter !== "software" && (
                    <tr style={{ borderTop: "2px solid #22c55e" }}>
                      <td style={{ padding: "5px 10px", background: "#052515", fontWeight: 700, color: "#4ade80", fontSize: 11 }}>⭐ DevOps combined</td>
                      {DO_SDLC.map(d => {
                        const mx = Math.max(...DO_SPECS.map(sp => sp.devopsCols[d] ?? 0));
                        return <CCell key={d} v={mx} />;
                      })}
                      <td style={{ padding: "5px 8px", textAlign: "center" }}>
                        <span style={{ color: "#22c55e", fontWeight: 700 }}>91%</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 11, color: "#64748b" }}>
            <span><span style={{ color: "#22c55e" }}>■</span> 100%</span>
            <span><span style={{ color: "#60a5fa" }}>■</span> 70–99%</span>
            <span><span style={{ color: "#facc15" }}>■</span> 1–69%</span>
            <span><span style={{ color: "#1e293b" }}>■</span> 0%</span>
          </div>
        </div>
      )}

      {/* ── PROMPTS TAB ── */}
      {tab === "prompts" && (
        <div>
          <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 16px" }}>
            Target: bilingual EN+RU · 2–3 concrete examples per file · domain-specific context with real tools/errors.
          </p>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12, marginBottom: 20 }}>
            <thead>
              <tr>
                {["Area","Spec","Files","Avg Words","Bilingual","Examples","Score","Prompt Files"].map(h => (
                  <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleSpecs.map((sp, i) => (
                <tr key={sp.id} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "#0c111d" : "#111827" }}>
                  <td style={{ padding: "6px 10px" }}><AreaBadge area={sp.area} /></td>
                  <td style={{ padding: "6px 10px", fontWeight: 600, color: "#f1f5f9" }}>{sp.icon} {sp.label}</td>
                  <td style={{ padding: "6px 10px", color: "#94a3b8", textAlign: "center" }}>{sp.prompts}</td>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: sp.promptAvgW >= 350 ? "#22c55e" : sp.promptAvgW >= 250 ? "#60a5fa" : "#facc15", textAlign: "center" }}>
                    {sp.promptAvgW}w
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "center" }}>
                    {sp.promptBilingual ? <span style={{ color: "#22c55e", fontWeight: 700 }}>✅ EN+RU</span> : <span style={{ color: "#f97316", fontWeight: 700 }}>⚠ EN only</span>}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "center" }}>
                    <span style={{ color: sp.promptExamples >= 3 ? "#22c55e" : sp.promptExamples >= 2 ? "#60a5fa" : "#f97316", fontWeight: 700 }}>
                      {sp.promptExamples > 0 ? `${sp.promptExamples}×` : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "center" }}>
                    <span style={{ color: sc(sp.prompt), fontWeight: 700 }}>{sp.prompt}</span>
                  </td>
                  <td style={{ padding: "6px 10px", color: "#64748b", fontSize: 10, fontFamily: "monospace" }}>
                    {sp.promptFiles.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Format checklist */}
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 13, marginBottom: 12 }}>Prompt format standard achieved across areas</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
              {[
                { l: "Use when: header", d: "Every prompt starts with exact workflow trigger" },
                { l: "2–3 examples", d: "Standard / detailed / minimal variants per file" },
                { l: "Bilingual blocks", d: "Identical EN and RU code blocks per example" },
                { l: "Domain specificity", d: "Real service names, tools, error messages" },
                { l: "Acceptance criteria", d: "Specific measurable outputs, not generic" },
                { l: "Constraints", d: "Stack, scope, env — narrows agent search space" },
              ].map((c, i) => (
                <div key={i} style={{ background: "#0f172a", borderRadius: 6, padding: 10 }}>
                  <div style={{ color: "#60a5fa", fontWeight: 600, fontSize: 12, marginBottom: 3 }}>{c.l}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>{c.d}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#2d1e00", border: "1px solid #f59e0b33", borderRadius: 6, padding: 10 }}>
              <span style={{ color: "#f59e0b", fontWeight: 600, fontSize: 12 }}>⚠ MLOps pending </span>
              <span style={{ color: "#94a3b8", fontSize: 11 }}>— prompts remain generic placeholders (~95w); all other 17 specs are fully bilingual with 2–3 examples.</span>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARE TAB ── */}
      {tab === "compare" && (
        <div>
          {/* Head-to-head summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[
              { label: "areas/software", specs: SW_SPECS, col: "#60a5fa", bg: "#0c1a3d", bc: "#3b82f620" },
              { label: "areas/devops", specs: DO_SPECS, col: "#4ade80", bg: "#052515", bc: "#22c55e20" },
            ].map(({ label, specs, col, bg: bgc, bc }) => {
              const avg = s => Math.round((s.orch + s.depth + s.prompt + s.rcov + s.scov) / 5);
              const areaAvg = Math.round(specs.reduce((a, s) => a + avg(s), 0) / specs.length);
              const orchAvg = Math.round(specs.reduce((a, s) => a + s.orch, 0) / specs.length);
              const depthAvg = Math.round(specs.reduce((a, s) => a + s.depth, 0) / specs.length);
              const promptAvg = Math.round(specs.reduce((a, s) => a + s.prompt, 0) / specs.length);
              const bilingualCount = specs.filter(s => s.promptBilingual).length;
              const totalPrompts = specs.reduce((a, s) => a + s.prompts, 0);
              const totalWorkflows = specs.reduce((a, s) => a + s.workflows, 0);
              const totalSkills = specs.reduce((a, s) => a + s.skills, 0);
              const totalLines = specs.reduce((a, s) => a + s.lines, 0);
              return (
                <div key={label} style={{ background: bgc, border: `1px solid ${bc}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ color: col, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{label}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                      ["Overall Score", areaAvg, sc(areaAvg)],
                      ["Orchestration", orchAvg, sc(orchAvg)],
                      ["Tech Depth", depthAvg, sc(depthAvg)],
                      ["Prompt Quality", promptAvg, sc(promptAvg)],
                    ].map(([l, v, c]) => (
                      <div key={l} style={{ background: "#0f172a", borderRadius: 6, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
                        <div style={{ height: 3, background: "#1e293b", borderRadius: 2, marginTop: 4 }}>
                          <div style={{ height: 3, background: c, borderRadius: 2, width: `${v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                    {[
                      ["Specs", specs.length], ["Prompts", totalPrompts],
                      ["Workflows", totalWorkflows], ["Skills", totalSkills],
                      ["EN+RU", `${bilingualCount}/${specs.length}`], ["Lines", `${Math.round(totalLines/1000)}K`],
                    ].map(([l, v]) => (
                      <div key={l} style={{ background: "#0f172a", borderRadius: 6, padding: "5px 8px", textAlign: "center" }}>
                        <div style={{ fontWeight: 700, color: col, fontSize: 14 }}>{v}</div>
                        <div style={{ fontSize: 9, color: "#64748b" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dimension comparison table */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#94a3b8", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>All specs — ranked by overall score</div>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Rank","Area","Spec","Score","Orchestration","Tech Depth","Prompts","Rules Cov.","Skills Cov.","Dup","Verdict"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: h === "Score" || h === "Rank" ? "center" : "left", color: "#64748b", background: "#111827", borderBottom: "1px solid #1e293b", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...ALL_SPECS]
                  .sort((a, b) => avg5(b) - avg5(a))
                  .map((sp, i) => {
                    const score = avg5(sp);
                    const v = VERDICTS[sp.verdict];
                    return (
                      <tr key={sp.id} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "#0c111d" : "#111827" }}>
                        <td style={{ padding: "5px 8px", textAlign: "center", color: i < 3 ? "#facc15" : "#64748b", fontWeight: 700 }}>#{i + 1}</td>
                        <td style={{ padding: "5px 8px" }}><AreaBadge area={sp.area} /></td>
                        <td style={{ padding: "5px 8px", fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" }}>{sp.icon} {sp.label}</td>
                        <td style={{ padding: "5px 8px", textAlign: "center" }}>
                          <span style={{ color: sc(score), fontWeight: 800, fontSize: 15 }}>{score}</span>
                        </td>
                        {[sp.orch, sp.depth, sp.prompt, sp.rcov, sp.scov].map((v2, j) => (
                          <td key={j} style={{ padding: "5px 8px", textAlign: "center" }}>
                            <span style={{ color: sc(v2), fontWeight: 600, fontSize: 12 }}>{v2}</span>
                          </td>
                        ))}
                        <td style={{ padding: "5px 8px", textAlign: "center" }}>
                          <span style={{ color: sp.dup > 15 ? "#f97316" : sp.dup > 0 ? "#facc15" : "#22c55e", fontWeight: 600 }}>{sp.dup}%</span>
                        </td>
                        <td style={{ padding: "5px 8px" }}>
                          <span style={{ background: v.bg, color: v.col, border: `1px solid ${v.col}33`, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 600, whiteSpace: "nowrap" }}>{v.label}</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Coverage gaps callout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#0c1a3d", border: "1px solid #3b82f620", borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 700, color: "#60a5fa", fontSize: 12, marginBottom: 8 }}>📦 Software — Top gaps remaining</div>
              {[
                ["MLOps prompts", "Generic placeholders → bilingual rewrite needed"],
                ["Full-stack duplication", "17 rules + skill-creator 2874w still pending removal"],
                ["Frontend debug workflow", "No debug/feature-dev workflow"],
                ["General skills", "Only 1 skill; security-basics + git-advanced missing"],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 6 }}>
                  <span style={{ color: "#fca5a5", fontWeight: 600, fontSize: 11 }}>{t}: </span>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>{d}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#052515", border: "1px solid #22c55e20", borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 700, color: "#4ade80", fontSize: 12, marginBottom: 8 }}>🔧 DevOps — Top gaps remaining</div>
              {[
                ["Networking workflows", "Only 2 workflows (fewest in area)"],
                ["DevSecOps workflows", "No secrets-rotation or compliance workflow"],
                ["Database-ops workflows", "No proactive performance-tuning workflow"],
                ["Cross-area SDLC", "Service mesh Istio: no deep-dive incident workflow"],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 6 }}>
                  <span style={{ color: "#fca5a5", fontWeight: 600, fontSize: 11 }}>{t}: </span>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
