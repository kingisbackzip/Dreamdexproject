# Feedback-track submission text

**Title:** dreamDEX Perps SDK and bot-kit correctness — eight reviewed Feedback reports

**Repository:** https://github.com/kingisbackzip/Dreamdexproject

**Summary:** Eight normal Feedback candidates, selected after reviewing 38 source reports. The package includes deterministic checks for maker ask rounding, same-second live-fill ordering, invalid side/percentage handling, a missing protective-leg monitoring fixture, and SDK documentation/quantization boundaries. Twenty local behavioral tests passed. All cases state their execution boundaries; no transaction, signer, mainnet test or real-funds loss is claimed.

**Start here:** [Report index](README.md), [all 38 review decisions](REVALIDATION.md), and [validation/provenance](VALIDATION.md).

**Environment:** SDK 0.32.1; viem 2.24.0; bot kit commit 4e75896896e024c03e2033d5920514f249998cd6. Review execution is offline. Hideki/Tokyo chain 50383 is the perps context, not a newly contacted deployment.

**Reviewer command:** `npm ci --prefix review --ignore-scripts --no-audit --no-fund` followed by `npm run check:feedback` on Node.js 24 and Python 3.

**Disclosure:** Two private-review items and their detailed evidence are omitted. Spot/binary/tooling candidates needing scope confirmation are listed as deferred, rather than included as confirmed perps findings.

This text is prepared for the owner's official submission. Publishing this repository does not by itself register or submit a Build on DoraHacks.
