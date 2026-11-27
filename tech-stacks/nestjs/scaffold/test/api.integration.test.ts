import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

const folder = mkdtempSync(join(tmpdir(), 'atgv-nest-test-'));
process.env.DATABASE_URL = 'file:' + join(folder, 'test.db');
let app: INestApplication;
let client: { close: () => void };

describe('NestJS HTTP / SQLite integration', () => {
  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../src/main');
    const database = await import('../src/database');
    client = database.client;
    await database.migrate();
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    try {
      if (app) await app.close();
    } finally {
      if (client) client.close();
    }
    // Windows can retain a native SQLite handle briefly after client.close().
    // Yield to the event loop and use bounded filesystem retries, not a skipped assertion.
    await rm(folder, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
  }, 30000);
  it('accepts a valid task and returns it over HTTP', async () => {
    const api = request(app.getHttpServer());
    await api.get('/api/health').expect(200);
    const created = await api.post('/api/tasks').send({ title: 'Example' }).expect(201);
    expect(created.body.title).toBe('Example');
    const listed = await api.get('/api/tasks').expect(200);
    expect(listed.body.some((task: { id: number }) => task.id === created.body.id)).toBe(true);
    await api.delete('/api/tasks/' + created.body.id).expect(200);
  });
  it('rejects invalid task input', async () => {
    await request(app.getHttpServer()).post('/api/tasks').send({ title: '' }).expect(400);
  });
});
