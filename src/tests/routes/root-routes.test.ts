import app from '../../app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('GET / (root endpoint)', () => {
  it('should return API metadata', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Express App API');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('versions');
    expect(response.body).toHaveProperty('documentation');
    expect(response.body).toHaveProperty('authentication');
    expect(response.body).toHaveProperty('rate_limit');
  });
});

describe('GET /v1 (v1 endpoint)', () => {
  it('should return v1 API metadata', async () => {
    const response = await request(app).get('/v1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Express App API');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('endpoints');
  });
});

describe('GET /metrics (metrics endpoint)', () => {
  it('should return Prometheus metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toContain('# HELP');
    expect(response.text).toContain('# TYPE');
  });
});
