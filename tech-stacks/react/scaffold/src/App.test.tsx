// ATGV verified starter migration: the catalog's demo-task assertions are not
// requirements for this BR. BR-specific RED tests remain mandatory and locked.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { App } from './App';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('Application render smoke', () => {
  it('mounts the real App without crashing', () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true, status: 200,
      json: async () => [], text: async () => '',
    })));
    const { container } = render(<App />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
