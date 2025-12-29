import app from '../../app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('GET /metrics', () => {
  it('should return Prometheus metrics', async () => {
    const resp = await request(app).get('/metrics');
    expect(resp.status).toBe(200);
    expect(resp.headers['content-type']).toMatch(/text\/plain/);
    expect(resp.text).toContain('http_requests_total');
    expect(resp.text).toContain('http_request_duration_seconds');
  });
});
