# Workflow: `/threat-model-review`

**Trigger**: `/threat-model-review [--feature feature-name]`

**Purpose**: Perform a structured STRIDE threat modeling session for a new feature or system component.

## Steps

```
Step 1: PARSE feature description
  - Extract: data processed, actors, trust boundaries crossed

Step 2: GENERATE data flow diagram
  - Map: External Entities → Processes → Data Stores → Trust Boundaries
  - Identify all entry points (APIs, file inputs, queues)

Step 3: APPLY STRIDE analysis
  - For each trust boundary crossing, evaluate all 6 STRIDE categories
  - Generate finding per identified threat

Step 4: PRIORITIZE findings
  - Score: Likelihood (1-3) × Impact (1-3) = Risk Score
  - Sort descending

Step 5: GENERATE mitigations
  - Map each threat to control (from auth-patterns, crypto-standards skills)
  - Classify: Required / Recommended / Accepted risk

Step 6: PRODUCE document
  - Output: .security/threat-models/threat-model-{feature}.md
  - Contains: DFD, STRIDE table, mitigations
```
