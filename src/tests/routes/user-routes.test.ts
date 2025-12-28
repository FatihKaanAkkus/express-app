import app from '../../app';
import userService from '../../services/user-service';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

let guestToken: string;
let editorToken: string;

beforeAll(async () => {
  // Register and login as guest
  await request(app).post('/v1/auth/register').send({
    email: 'guest@example.com',
    password: 'supersecurepassword',
    name: 'Guest',
  });
  const guestLogin = await request(app).post('/v1/auth/login').send({
    email: 'guest@example.com',
    password: 'supersecurepassword',
  });
  guestToken = guestLogin.body.accessToken;

  // Register and login as guest, promote to editor
  const editorRegister = await request(app).post('/v1/auth/register').send({
    email: 'editor@example.com',
    password: 'supersecurepassword',
    name: 'Editor',
  });
  await userService.updateUser(editorRegister.body.id, { role: 'editor' });
  const editorLogin = await request(app).post('/v1/auth/login').send({
    email: 'editor@example.com',
    password: 'supersecurepassword',
  });
  editorToken = editorLogin.body.accessToken;
});

describe('GET /v1/users', () => {
  it('should return a 200 OK status and a JSON array of users', async () => {
    const response = await request(app).get('/v1/users').set('Authorization', `Bearer ${editorToken}`);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return 400 Bad Request for invalid query parameters', async () => {
    const response = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .query({ page: 'invalid', perPage: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('POST /v1/users', () => {
  it('should create a new user and return a 201 Created status', async () => {
    const newUser = { email: 'sherlock@example.com', name: 'Sherlock Holmes', password: 'password123', role: 'guest' };
    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(newUser)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body).not.toHaveProperty('hashedPassword');
  });

  it('should return a 400 Bad Request if the request body is invalid', async () => {
    const userWithoutPassword = { name: 'John Watson', email: 'john.watson@example.com', role: 'guest' }; // Missing password
    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(userWithoutPassword);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body).not.toHaveProperty('hashedPassword');

    const userWithoutEmail = { name: 'Irene Adler', password: 'password123', role: 'guest' }; // Missing email
    const response2 = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(userWithoutEmail);

    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('message');
  });

  it('should return a 400 Bad Request if the email is invalid', async () => {
    const userWithInvalidEmail = { name: 'Invalid', email: 'invalid-email', password: 'password123', role: 'guest' };
    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(userWithInvalidEmail);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return an error when creating a duplicate user', async () => {
    const duplicateUser = { name: 'Dup User', email: 'dup.user@example.com', password: 'password123', role: 'guest' };
    const createResponse = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(duplicateUser);
    expect(createResponse.status).toBe(201);

    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(duplicateUser);
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /v1/users/:userId', () => {
  it('should return a 200 OK status and a JSON object of the user', async () => {
    const newUser = { name: 'Mark Juke', email: 'mark.juke@example.com', password: 'password123', role: 'guest' };
    const createdUserResponse = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send(newUser);
    const userId = createdUserResponse.body.id;

    const response = await request(app).get(`/v1/users/${userId}`).set('Authorization', `Bearer ${editorToken}`);

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', newUser.name);
    expect(response.body).toHaveProperty('email', newUser.email);
    expect(response.body).not.toHaveProperty('hashedPassword');
  });

  it('should return a 404 status and error message if the user does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/v1/users/${nonExistentId}`).set('Authorization', `Bearer ${editorToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should return a 400 Bad Request if the user ID is invalid', async () => {
    const invalidId = 'invalid-id';
    const response = await request(app).get(`/v1/users/${invalidId}`).set('Authorization', `Bearer ${editorToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /v1/users/:userId (owner)', () => {
  it('should allow a user to fetch their own data', async () => {
    const user = { name: 'Owner User', email: 'owner.user@example.com', password: 'password123', role: 'guest' };
    const createResp = await request(app).post('/v1/users').set('Authorization', `Bearer ${editorToken}`).send(user);
    const userId = createResp.body.id;
    const loginResp = await request(app).post('/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    const ownerToken = loginResp.body.accessToken;

    const response = await request(app).get(`/v1/users/${userId}`).set('Authorization', `Bearer ${ownerToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', user.name);
    expect(response.body).toHaveProperty('email', user.email);
    expect(response.body).not.toHaveProperty('hashedPassword');
  });

  it('should not allow a guest to fetch for another user', async () => {
    const user = { name: 'Another User', email: 'another.user@example.com', password: 'password123', role: 'guest' };
    const createResp = await request(app).post('/v1/users').set('Authorization', `Bearer ${editorToken}`).send(user);
    const userId = createResp.body.id;

    const response = await request(app).get(`/v1/users/${userId}`).set('Authorization', `Bearer ${guestToken}`);
    expect(response.status).toBe(403);
  });
});

describe('PATCH /v1/users/:userId', () => {
  it('should update the user and return 200 with updated user', async () => {
    const user = { name: 'Update Me', email: 'update.me@example.com', password: 'password123', role: 'guest' };
    const createResp = await request(app).post('/v1/users').set('Authorization', `Bearer ${editorToken}`).send(user);
    const userId = createResp.body.id;

    const updatedData = { name: 'Updated Name', password: 'newpassword123' };
    const response = await request(app)
      .patch(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send(updatedData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', updatedData.name);
    expect(response.body).not.toHaveProperty('hashedPassword');
  });

  it('should return 404 if user does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app)
      .patch(`/v1/users/${nonExistentId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'No User' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if userId is invalid', async () => {
    const response = await request(app)
      .patch('/v1/users/invalid-id')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'No User' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('PATCH /v1/users/:userId (owner)', () => {
  it('should allow a user to update their own data', async () => {
    const user = { name: 'Owner Update', email: 'owner.update@example.com', password: 'password123', role: 'guest' };
    const createResp = await request(app).post('/v1/users').set('Authorization', `Bearer ${editorToken}`).send(user);
    const userId = createResp.body.id;
    const loginResp = await request(app).post('/v1/auth/login').send({
      email: user.email,
      password: user.password,
    });
    const ownerToken = loginResp.body.accessToken;

    const updatedData = { name: 'Owner Updated Name', password: 'newownerpassword123' };
    const response = await request(app)
      .patch(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(updatedData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name', updatedData.name);
    expect(response.body).not.toHaveProperty('hashedPassword');
  });

  it('should not allow a guest to update another user', async () => {
    const user = {
      name: 'Another Update',
      email: 'another.update@example.com',
      password: 'password123',
      role: 'guest',
    };
    const createResp = await request(app).post('/v1/users').set('Authorization', `Bearer ${editorToken}`).send(user);
    const userId = createResp.body.id;

    const response = await request(app)
      .patch(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ name: 'Hacker Name' });

    expect(response.status).toBe(403);
  });
});

describe('DELETE /v1/users/:userId', () => {
  it('should delete the user and return 204', async () => {
    const user = { name: 'Delete Me', email: 'delete.me@example.com', password: 'password123', role: 'guest' };
    const createResp = await request(app).post('/v1/users').set('Authorization', `Bearer ${editorToken}`).send(user);
    const userId = createResp.body.id;

    const response = await request(app)
      .delete(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 if user does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app)
      .delete(`/v1/users/${nonExistentId}`)
      .set('Authorization', `Bearer ${editorToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if userId is invalid', async () => {
    const response = await request(app).delete('/v1/users/invalid-id').set('Authorization', `Bearer ${editorToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
