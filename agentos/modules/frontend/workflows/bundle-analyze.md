# Workflow: `/bundle-analyze`

**Trigger**: `/bundle-analyze [--pr | --full]`

**Purpose**: Analyze the impact of current changes on JavaScript bundle size.

## Steps

```
Step 1: BUILD with stats
  - Run: vite build --mode production
  - Generate stats: vite-bundle-visualizer --json stats.json

Step 2: COMPARE against baseline (main branch)
  - Fetch stats.json from last successful main branch build
  - Compute deltas per chunk: initial, vendor, feature chunks

Step 3: ANALYZE impact
  - Flag any chunk that increased by > 5 KB gzipped
  - Identify top 5 heaviest modules in the diff
  - Check for duplicate dependencies (same library at multiple versions)

Step 4: SUGGEST optimizations
  - Match heavy modules against known patterns (skill: performance-tuning)
  - Generate specific actionable suggestions with estimated savings

Step 5: OUTPUT report
  - Summary table: chunk name | baseline | current | delta | status
  - Optimization recommendations with estimated savings
```
