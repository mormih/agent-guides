# agent-config Taxonomy for Software Development

This document defines a comprehensive taxonomy for `agent-config` directories across the software development industry. It breaks down the ecosystem into domain-specific packages containing **Rules** (passive constraints), **Skills** (active knowledge), and **Workflows** (procedures).

## 1. Domain Catalog

Beyond the existing Backend SDLC, the following domains are essential for full industry coverage:

| Domain | Focus Area |
| :--- | :--- |
| **Frontend Engineering** | User interfaces, state management, performance, accessibility. |
| **Platform Engineering (DevOps)** | Infrastructure as Code (IaC), CI/CD, cloud resources, reliability. |
| **Data Engineering** | ETL/ELT pipelines, data warehousing, data quality, governance. |
| **Machine Learning (MLOps)** | Model lifecycle, training pipelines, evaluation, deployment. |
| **Mobile Development** | iOS/Android native/cross-platform, app store compliance, offline-first. |
| **Security (DevSecOps)** | AppSec, compliance audits, vulnerability management, identity. |
| **QA & Automation** | E2E testing, regression suites, performance auditing. |

---

## 2. Domain Specifications

### 2.1. Frontend Engineering
**Description**: Focuses on browser-based applications, user experience, and client-side logic.

*   **Rules** (Kernel):
    1.  **Accessibility First**: All interactive elements must have aria-labels and keyboard navigation support (WCAG 2.1 AA).
    2.  **State Immutability**: No direct mutation of global state (e.g., Redux/Zustand stores).
    3.  **Component Purity**: Presentational components must be pure functions without side effects.
    4.  **No Hardcoded Strings**: All user-facing text must use localization keys.

*   **Skills** (Libraries):
    *   `component-design`: Patterns for atomic design, compound components, and slots.
    *   `state-management`: Best practices for React Query, Redux, or Context API.
    *   `performance-tuning`: Core Web Vitals optimization, lazy loading, bundle analysis.
    *   `a11y-audit`: Automated accessibility checking and remediation patterns.
    *   `css-architecture`: Tailwind/CSS-in-JS organization and theme token usage.
    *   `testing-library`: Queries and patterns for user-centric testing (RTL).

*   **Workflows** (Apps):
    *   `/scaffold-component`: Generates a component with tests, stories, and styles.
    *   `/visual-regression`: Triggers Percy/Chromatic checks and summarizes diffs.
    *   `/bundle-analyze`: Reports on bundle size impact of a pull request.

### 2.2. Platform Engineering (DevOps/IaC)
**Description**: Manages the underlying infrastructure, deployment pipelines, and operational reliability.

*   **Rules** (Kernel):
    1.  **Immutable Infrastructure**: No manual changes to running servers; replace, don't patch.
    2.  **Least Privilege**: IAM roles must be scoped to the minimum required permissions.
    3.  **Encrypted Secrets**: No secrets in plain text committed to git (use Vault/KMS/Secrets Manager).
    4.  **Tagging Compliance**: All resources must have `Owner`, `Environment`, and `CostCenter` tags.

*   **Skills** (Libraries):
    *   `terraform-patterns`: Modular IaC structures for AWS/GCP/Azure.
    *   `k8s-manifests`: Best practices for Helm charts, resources requests/limits, and probes.
    *   `ci-cd-pipelines`: Patterns for GitHub Actions/GitLab CI (caching, matrix builds).
    *   `observability-setup`: Configuring Prometheus/Grafana/Datadog monitors and alerts.
    *   `incident-response`: Runbooks for common outages (DB failover, high latency).

*   **Workflows** (Apps):
    *   `/provision-env`:Spins up an ephemeral preview environment for a branch.
    *   `/drift-check`: Detects differences between IaC definitions and live state.
    *   `/deploy-production`: Executing the gated release process (blue/green or canary).
    *   `/cost-audit`: Analyzes cloud spend and suggests optimizations.

### 2.3. Data Engineering
**Description**: Handles the movement, transformation, and storage of data.

*   **Rules** (Kernel):
    1.  **Idempotency**: All data pipelines must be re-runnable without duplicating data.
    2.  **Schema Evolution**: Breaking schema changes are forbidden in production tables without migration plans.
    3.  **PII Separation**: Personally Identifiable Information must be isolated or hashed.

*   **Skills** (Libraries):
    *   `sql-optimization`: Query tuning, indexing strategies, and window functions.
    *   `data-modeling`: Kimball vs. Inmon patterns, star schemas, Data Vault.
    *   `quality-checks`: Defining expectations (Great Expectations/dbt tests) for nulls, uniqueness.
    *   `orchestration`: Airflow/Dagster DAG design patterns.
    *   `streaming-patterns`: Kafka/Kinesis consumer/producer patterns.

*   **Workflows** (Apps):
    *   `/new-model`: Scaffolds a dbt model with documentation and basic tests.
    *   `/backfill-data`: Generates a plan and script for historic data reprocessing.
    *   `/lineage-trace`: Visualizes the downstream impact of a column change.

### 2.4. Machine Learning (MLOps)
**Description**: Focuses on the lifecycle of machine learning models from experimentation to production.

*   **Rules** (Kernel):
    1.  **Reproducibility**: Training code must be versioned with data snapshots and hyperparameters.
    2.  **Model Validation**: No model promotion without passing challenger vs. champion evaluation.
    3.  **Data Leakage Prevention**: Test sets must be strictly isolated from training data.

*   **Skills** (Libraries):
    *   `feature-engineering`: Templates for embeddings, one-hot encoding, and scaling.
    *   `model-evaluation`: Metrics calculation (AUC, F1, RMSE) and confusion matrix interpretation.
    *   `framework-specifics`: PyTorch/TensorFlow/Scikit-learn best practices.
    *   `deploy-inference`: Containerizing models (Triton/TorchServe) and API wrapping.

*   **Workflows** (Apps):
    *   `/train-experiment`: Launches a training run on remote compute.
    *   `/evaluate-model`: Runs a comprehensive scorecard on a model version.
    *   `/deploy-endpoint`: Promotes a model to a REST endpoint.

### 2.5. Security (DevSecOps)
**Description**: Horizontal domain ensuring security practices are embedded in all other domains.

*   **Rules** (Kernel):
    1.  **Sanitize Inputs**: All external inputs must be validated and sanitized.
    2.  **No Default Credentials**: All services must start with generated strong passwords.
    3.  **HTTPS Everywhere**: No non-SSL communication between services.

*   **Skills** (Libraries):
    *   `threat-modeling`: Patterns for identifying attack vectors in architecture.
    *   `code-analysis`: Interpreting SAST/DAST results (SonarQube, Snyk).
    *   `auth-patterns`: Implementation guides for OAuth2, OIDC, JWT, SAML.
    *   `crypto-standards`: Correct usage of AES, RSA, hashing (bcrypt/argon2).

*   **Workflows** (Apps):
    *   `/security-scan`: Triggers a deep dependency and code vulnerability scan.
    *   `/pen-test-sim`: Runs a suite of automated exploit attempts (e.g., OWASP ZAP).
    *   `/audit-report`: Generates a compliance artifact (for SOC2/ISO).

---

## 3. Domain Boundaries & Overlaps

The boundaries between these domains are often fluid.

*   **Frontend â†” Mobile**: "Client-side" logic is converging (React Native, Flutter). Rules about state management often apply to both.
    *   *Decision*: Keep separate if native modules are heavy; merge into "Client Engineering" if using cross-platform tech.
*   **Backend â†” Data Engineering**: Microservices often own their own data pipelines ("Data Mesh").
    *   *Decision*: "Data Engineering" as a separate domain usually refers to *analytical* data (OLAP), while Backend handles *transactional* data (OLTP).
*   **DevOps â†” Security**: IaC is heavily scrutinized by security. "Policy as Code" (OPA) sits right in the middle.
    *   *Decision*: Security Rules should be "global" or imported into the DevOps domain.
*   **MLOps â†” Data Engineering**: Feature stores are essentially data pipelines.
    *   *Decision*: Data Engineering creates the *clean data*; MLOps consumes it for *training*.

---

## 4. Hierarchy Strategy

We propose a **Hub-and-Spoke** hierarchy for `agent-config`.

### Level 1: Global / Corporate (The "Constitution")
*   **Location**: `~/agent-config/global` or Organization Repo.
*   **Content**: High-level Security Rules, legal compliance, Code of Conduct, language style guides (basic linter configs).
*   **Enforcement**: Mandatory. Cannot be overridden by projects.

### Level 2: Domain / Stack (The "Distro")
*   **Location**: Included via package (e.g., `react-frontend`).
*   **Content**: The standard Rules/Skills/Workflows defined in Section 2.
*   **Enforcement**: Defaults provided, but configurable via parameters.

### Level 3: Project (The "Local Configuration")
*   **Location**: `./agent-config/` in the project root.
*   **Content**:
    *   Project-specific overrides.
    *   Architecture diagrams specific to this app.
    *   Custom Workflows for specific business logic processes (e.g., `/release-to-client-x`).

---

## 5. ROI Analysis & Recommendation

| Domain | Automation Complexity | Frequency of Use | Risk Reduction | **Potential ROI** |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | High (Visuals are hard) | Very High | Medium | **High** |
| **Backend** | Medium | Very High | High | **Very High** |
| **Platform (DevOps)** | Medium (Structured Inputs) | Medium | Critical | **Very High** |
| **Data Engineering** | Medium | Medium | Medium | **Medium** |
| **MLOps** | High (Research based) | Low | High | **Low/Medium** |
| **Security** | High (False positives) | Low (triggered) | Critical | **High** |

### Winner: Platform Engineering (DevOps)

**Why?**
1.  **Structured "Language"**: IaC (Terraform/YAML) is highly structured and easier for LLMs to generate correctly than nuanced UI code.
2.  **High Risk of Human Error**: Manual config changes are the #1 cause of outages. Agents are great at strict adherence to checklists.
3.  **Standardization Value**: Reviewing a 2000-line Terraform plan is painfully boring for humans (leading to glossing over details). Agents excel at diff analysis here.
4.  **Workflow Driven**: DevOps is almost entirely workflow-driven (trigger pipeline, check logs, rollback), mapping perfectly to the Agent-OS model.

**Recommendation**: After Backend, build the **Platform Engineering** package. It effectively "empowers" every other developer to own their infrastructure safely.
