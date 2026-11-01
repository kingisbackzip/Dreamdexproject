# Copy-ready DoraHacks Build text

Use the **Feedback** track after confirming the live event requirements. This is owner submission text, not an already submitted Build. This public repository contains the 36 ordinary-feedback reports only.

## Build title

dreamDEX Perps SDK and Bot-Kit Feedback - Reproducibility Package

## Short description

36 feedback candidates covering SDK correctness, bot configuration and monitoring, packaging compatibility, and developer documentation. Eight have new offline checks against commit-pinned bot-kit code. Every report includes reproduction steps, expected/actual behavior, evidence provenance, environment and remediation. Additional security-sensitive material is held out of the public Feedback export.

## Detailed description

This Feedback-track package turns a 38-item source report into independently reviewable Markdown files. The ordinary-feedback export includes 36 candidates; two items are reserved for private security/scope review. The intended perps environment is Somnia Tokyo / Hideki (chain 50383), with SDK 0.32.1. Adjacent spot/CCXT documentation and tooling items are labeled for organizer scope confirmation.

Eight new offline checks pass against pinned upstream source: environment-file precedence, endpoint configuration timing, invalid side coercion, invalid bracket arithmetic, side parsing, fractional timestamp parsing, missing-stop monitoring, and guard symbol filtering. Two checks execute the real strategy body with mocked perp-core boundaries; no network, private key, signer or transaction is used. Other reports retain the supplied PDF evidence and explicitly identify that they were not independently rerun in this pass.

Each item states its proposed severity and area, the reproduction procedure, expected and actual results, source PDF pages, evidence limitations, environment and suggested remediation. Historical raw-log/script paths are identified as unavailable, not represented as attached originals. Severity, reproducibility acceptance, intended behavior, duplication, scope and payment remain subject to organizer review.

## Repository field

https://github.com/kingisbackzip/Dreamdexproject

## Verification instructions for reviewers

From the package directory, with Python 3 and Node.js 24:

```sh
python3 scripts/validate-package.py
node --test scripts/reproduce-offline.mjs
```

The public export has its own 36-item manifest; validation accepts either the full private package or that filtered package. The report index is in README.md.
