import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('React starter renders real components and reports API as unverified before browser health check', async () => {
  const vite = await createServer({ server: { middlewareMode: true, watch: null }, appType: 'custom' });
  try {
    const { App } = await vite.ssrLoadModule('/src/App.tsx');
    const html = renderToStaticMarkup(React.createElement(App));
    assert.match(html, /Your development environment/);
    assert.match(html, /Qi-inspired component library/);
    assert.match(html, /href="#qi-components"/);
    assert.match(html, /href="\/api\/docs"/);
    assert.match(html, /API verification pending/);
    assert.match(html, /Unverified/);
  } finally {
    await vite.close();
  }
});
