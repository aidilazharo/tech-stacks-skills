# Catalog 1.1.5 — incomplete metadata update in uploaded archive

The uploaded archive declared `VERSION=1.1.5`, while `catalog.json` and the previous release notes still declared `1.1.4`. The catalog validator fails on this inconsistent state. This was not a fully aligned release.

The SQLite starter corrections were introduced in catalog 1.1.4 and retained in 1.1.6.
