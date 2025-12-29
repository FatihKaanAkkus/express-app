import app from '../../app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('POST /v1/auth/register', () => {
  it('should register a user with valid data', async () => {
    const resp = await request(app).post('/v1/auth/register').send({
      email: 'auth-sherlock@example.com',
      password: 'supersecurepassword',
      name: 'Sherlock Holmes',
    });

    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty('id');
    expect(resp.body).toHaveProperty('name', 'Sherlock Holmes');
    expect(resp.body).toHaveProperty('email', 'auth-sherlock@example.com');
    expect(resp.body).not.toHaveProperty('hashedPassword');
  });

  it('should fail with missing fields', async () => {
    const resp = await request(app).post('/v1/auth/register').send({
      name: 'Test User',
    });

    expect(resp.status).toBeGreaterThanOrEqual(400);
    expect(resp.body).toHaveProperty('message');
  });

  it('should fail with invalid email', async () => {
    const resp = await request(app).post('/v1/auth/register').send({
      email: 'not-an-email',
      name: 'Test User',
      password: 'password123',
    });

    expect(resp.status).toBeGreaterThanOrEqual(400);
    expect(resp.body).toHaveProperty('message');
  });
});

describe('POST /v1/auth/login', () => {
  it('should login with valid credentials', async () => {
    // First, register a user
    await request(app).post('/v1/auth/register').send({
      email: 'auth-watson@example.com',
      password: 'elementarypassword',
      name: 'John Watson',
    });

    // Then, attempt login
    const resp = await request(app).post('/v1/auth/login').send({
      email: 'auth-watson@example.com',
      password: 'elementarypassword',
    });

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('accessToken');
    expect(resp.body).toHaveProperty('user');
    expect(resp.body.user).toHaveProperty('email', 'auth-watson@example.com');
  });

  it('should fail with wrong password', async () => {
    // Register user
    await request(app).post('/v1/auth/register').send({
      email: 'auth-wrongpass@example.com',
      password: 'rightpassword',
      name: 'Wrong Pass',
    });

    // Attempt login with wrong password
    const resp = await request(app).post('/v1/auth/login').send({
      email: 'auth-wrongpass@example.com',
      password: 'wrongpassword',
    });

    expect(resp.status).toBeGreaterThanOrEqual(400);
    expect(resp.body).toHaveProperty('message');
  });

  it('should fail with missing fields', async () => {
    const resp = await request(app).post('/v1/auth/login').send({ email: 'missing@example.com' });
    expect(resp.status).toBeGreaterThanOrEqual(400);
    expect(resp.body).toHaveProperty('message');
  });
});

describe('GET /v1/auth/profile', () => {
  it('should return profile for authenticated user', async () => {
    // Register and login to get token
    await request(app).post('/v1/auth/register').send({
      email: 'auth-profile@example.com',
      password: 'profilepassword',
      name: 'Profile User',
    });
    const loginResp = await request(app).post('/v1/auth/login').send({
      email: 'auth-profile@example.com',
      password: 'profilepassword',
    });
    const token = loginResp.body.accessToken || loginResp.body.token;
    expect(token).toBeTruthy();

    const resp = await request(app).get('/v1/auth/profile').set('Authorization', `Bearer ${token}`);

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('email', 'auth-profile@example.com');
    expect(resp.body).toHaveProperty('name', 'Profile User');
  });

  it('should fail without authentication', async () => {
    const resp = await request(app).get('/v1/auth/profile');

    expect(resp.status).toBeGreaterThanOrEqual(401);
    expect(resp.body).toHaveProperty('error');
    expect(resp.body).toHaveProperty('message');
  });
});
