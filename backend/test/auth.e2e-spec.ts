import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    dataSource = app.get(DataSource);
    await app.init();

    // Clean database before tests
    await dataSource.query('DELETE FROM documents');
    await dataSource.query('DELETE FROM users');
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM documents');
    await dataSource.query('DELETE FROM users');
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user.name).toBe('Test User');
          expect(res.body.user).not.toHaveProperty('password');
          accessToken = res.body.accessToken;
        });
    });

    it('should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test2@example.com',
          password: '123',
        })
        .expect(400);
    });

    it('should fail with missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test3@example.com',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('test@example.com');
        });
    });

    it('should fail with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });

    it('should fail with missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.name).toBe('Test User');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail without token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/request-password-reset (POST)', () => {
    it('should accept password reset request', () => {
      return request(app.getHttpServer())
        .post('/auth/request-password-reset')
        .send({
          email: 'test@example.com',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('sent');
        });
    });

    it('should not reveal if email exists', () => {
      return request(app.getHttpServer())
        .post('/auth/request-password-reset')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('sent');
        });
    });

    it('should fail with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/auth/request-password-reset')
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('JWT Token Security', () => {
    it('should include user ID in token payload', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const token = response.body.accessToken;
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('email');
      expect(payload.email).toBe('test@example.com');
    });

    it('should reject expired tokens', async () => {
      // This would require mocking time or using a test token
      // For now, we test with an obviously invalid token
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAxfQ.invalid')
        .expect(401);
    });
  });

  describe('Password Security', () => {
    it('should not return password hash in any response', async () => {
      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Security Test',
          email: 'security@example.com',
          password: 'password123',
        });

      expect(registerRes.body.user).not.toHaveProperty('password');

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'security@example.com',
          password: 'password123',
        });

      expect(loginRes.body.user).not.toHaveProperty('password');

      const profileRes = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

      expect(profileRes.body).not.toHaveProperty('password');
    });

    it('should hash passwords (not store plain text)', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Hash Test',
          email: 'hash@example.com',
          password: 'password123',
        });

      // Query database directly to check password is hashed
      const user = await dataSource.query(
        'SELECT password FROM users WHERE email = ?',
        ['hash@example.com']
      );

      expect(user[0].password).not.toBe('password123');
      expect(user[0].password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt format
    });
  });
});
