// Publish guard.
//
// Fujin's distribution model is a git install pinned to a tag — not a registry
// publish. See the "Distribution: git-tag install, not a registry publish" entry
// in .raiden/state/DECISIONS.md.
//
// `private: true` used to enforce that, but it also blocked every legitimate
// consumption path: npm refuses to resolve `exports`, tooling treats the package
// as un-installable, and a git dependency cannot be prepared. Removing it is what
// made Fujin consumable at all. This script restores the *intent* of that flag —
// "do not push this to a registry" — without the collateral damage, by failing
// `npm publish` while leaving `npm install <git-url>#<tag>` working.
//
// If Fujin ever should be published, that is a decision to record in DECISIONS.md
// first; delete this script and the `prepublishOnly` hook as part of that change,
// rather than passing `--ignore-scripts` to route around it.

console.error(`
  npm publish is blocked for @fujin/ui.

  Fujin is distributed as a git install pinned to a tag:

      npm install github:StarlightDaemon/Fujin#v0.1.0

  Publishing to a registry is not the distribution model for this package.
  See .raiden/state/DECISIONS.md -> "Distribution: git-tag install, not a
  registry publish", and AGENTS.md for the consumer-side instructions.
`);

process.exit(1);
