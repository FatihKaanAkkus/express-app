import app from '@/app';
import prisma from '@/database/prisma-client';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('GET /v1/users', () => {
  it('should return a 200 OK status and a JSON array of users', async () => {
    const response = await request(app).get('/v1/users');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('POST /v1/users', () => {
  it('should create a new user and return a 201 Created status', async () => {
    const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
    const response = await request(app).post('/v1/users').send(newUser).expect('Content-Type', /json/);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it('should return a 400 Bad Request if the request body is invalid', async () => {
    const invalidUser = { name: 'Jane' }; // Missing email
    const response = await request(app).post('/v1/users').send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /v1/users/:id', () => {
  it('should return a 200 OK status and a JSON object of the user', async () => {
    const newUser = { name: 'Mark Juke', email: 'mark.juke@example.com' };
    const createdUserResponse = await request(app).post('/v1/users').send(newUser);
    const userId = createdUserResponse.body.id;

    const response = await request(app).get(`/v1/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', newUser.name);
    expect(response.body).toHaveProperty('email', newUser.email);
  });
});

export default async function cleanUp() {
  try {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['john.doe@example.com', 'mark.juke@example.com'],
        },
      },
    });
  } catch (error) {}
}
