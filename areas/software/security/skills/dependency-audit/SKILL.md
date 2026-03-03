# Skill: Dependency Audit

## When to load

When adding new packages, reviewing a PR that adds dependencies, or performing security reviews.

## Pre-Add Checklist

```
Before npm install [package]:
1. POPULARITY: > 100k weekly downloads?
2. MAINTENANCE: Last commit within 12 months? Open PRs reviewed?
3. OWNERSHIP: Well-known org/individual? History of incidents?
4. SCOPE: Does the package scope match its stated purpose?
          (A CSV parser with network dependencies is suspicious)
5. AUDIT: Run npm audit / snyk test immediately after adding
6. SIZE: Check bundlephobia.com
7. ALTERNATIVES: Is there a built-in API that does this?
```

## Supply Chain Attack Red Flags

```
- Recently transferred ownership
- Sudden version bump with no changelog
- Minified/obfuscated code in source (not just dist)
- postinstall / preinstall scripts making network requests
- Name similar to popular package (typosquatting)
```
