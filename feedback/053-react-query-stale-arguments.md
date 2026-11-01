# Indexer hooks expose previous-argument data as settled after arguments change

Severity: normal
Area: SDK

## Steps to reproduce

1. Install SDK 0.32.1 and inspect [the shipped useQuery implementation](https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/dist/hooks.js).
2. Render `useIndexerQuery` for pool A and wait for a settled result.
3. Change the dependency to pool B and inspect the first render before effects run, then the loading/error states.
4. Compare the state transitions with the [captured source excerpt](../evidence/round2/query-excerpt.js).

## Expected

As soon as the hook is called with pool B it should not present pool A's result as settled: either `data` is cleared/undefined, or at minimum `loading` is `true`. The docs say the hook "discards a superseded result" and that `usePortfolio` "re-runs when account/opts change".

## Actual

The hook retains state across dependency changes. The first render for B returns the settled A result because resetting happens in `useEffect`. Its loading and rejection updates spread the old state, preserving A’s data. A consumer using `if (!loading) show(data)` can display A’s result under B’s label.

Source inspection confirms these transitions; the supplied browser trace was not independently rerun. This is stale presentation, not unauthorized access to another wallet.

## Evidence

Source independently inspected on 1 November 2026; runtime behavior was not rerun. See [source references and verification boundaries](../evidence/round2/README.md).

## Environment

SDK 0.32.1 React hooks. Somnia Tokyo testnet / Hideki context (chain 50383); source inspection was offline. Wallet address: none. A runtime reproduction requires React and a provider; no transaction is needed.
