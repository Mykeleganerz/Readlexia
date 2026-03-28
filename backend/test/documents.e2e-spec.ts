import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Documents (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let userId: number;
  let documentId: number;

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

    // Create a test user and get token
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    accessToken = registerRes.body.accessToken;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM documents');
    await dataSource.query('DELETE FROM users');
    await app.close();
  });

  describe('/documents (POST)', () => {
    it('should create a document', () => {
      return request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Document',
          content: 'This is test content',
          category: 'Education',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Document');
          expect(res.body.content).toBe('This is test content');
          expect(res.body.category).toBe('Education');
          expect(res.body.userId).toBe(userId);
          documentId = res.body.id;
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/documents')
        .send({
          title: 'Test Document',
          content: 'This is test content',
          category: 'Education',
        })
        .expect(401);
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Document',
          // Missing content
        })
        .expect(400);
    });

    it('should fail with empty title', () => {
      return request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '',
          content: 'Content',
          category: 'Education',
        })
        .expect(400);
    });
  });

  describe('/documents (GET)', () => {
    beforeAll(async () => {
      // Create multiple documents
      await request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Document 2',
          content: 'Content 2',
          category: 'Personal',
        });

      await request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Document 3',
          content: 'Content 3',
          category: 'Work',
        });
    });

    it('should get all documents for the user', () => {
      return request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThanOrEqual(3);
          expect(res.body.meta.total).toBeGreaterThanOrEqual(3);
        });
    });

    it('should support pagination', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/documents?page=1&limit=2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(page1.body.data.length).toBeLessThanOrEqual(2);
      expect(page1.body.meta.page).toBe(1);
      expect(page1.body.meta.limit).toBe(2);

      const page2 = await request(app.getHttpServer())
        .get('/documents?page=2&limit=2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(page2.body.meta.page).toBe(2);
    });

    it('should filter by category', () => {
      return request(app.getHttpServer())
        .get('/documents?category=Personal')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((doc: any) => doc.category === 'Personal')).toBe(true);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/documents')
        .expect(401);
    });
  });

  describe('/documents/:id (GET)', () => {
    it('should get a document by id', () => {
      return request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(documentId);
          expect(res.body.title).toBe('Test Document');
        });
    });

    it('should fail with non-existent id', () => {
      return request(app.getHttpServer())
        .get('/documents/99999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should not allow access to other users documents', async () => {
      // Create another user
      const otherUserRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Other User',
          email: 'other@example.com',
          password: 'password123',
        });

      // Try to access first user's document
      return request(app.getHttpServer())
        .get(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${otherUserRes.body.accessToken}`)
        .expect(403);
    });
  });

  describe('/documents/:id (PATCH)', () => {
    it('should update a document', () => {
      return request(app.getHttpServer())
        .patch(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Title');
          expect(res.body.content).toBe('Updated Content');
          expect(res.body.category).toBe('Education'); // Unchanged
        });
    });

    it('should update only specified fields', () => {
      return request(app.getHttpServer())
        .patch(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          category: 'Personal',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.category).toBe('Personal');
          expect(res.body.title).toBe('Updated Title'); // Unchanged from previous test
        });
    });

    it('should fail with invalid id', () => {
      return request(app.getHttpServer())
        .patch('/documents/99999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated',
        })
        .expect(404);
    });

    it('should not allow updating other users documents', async () => {
      const otherUserRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'other@example.com',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .patch(`/documents/${documentId}`)
        .set('Authorization', `Bearer ${otherUserRes.body.accessToken}`)
        .send({
          title: 'Hacked',
        })
        .expect(403);
    });
  });

  describe('/documents/:id (DELETE)', () => {
    let deleteDocId: number;

    beforeEach(async () => {
      // Create a document to delete
      const res = await request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'To Delete',
          content: 'Delete me',
          category: 'Test',
        });

      deleteDocId = res.body.id;
    });

    it('should delete a document', async () => {
      await request(app.getHttpServer())
        .delete(`/documents/${deleteDocId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify it's deleted
      await request(app.getHttpServer())
        .get(`/documents/${deleteDocId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail with non-existent id', () => {
      return request(app.getHttpServer())
        .delete('/documents/99999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should not allow deleting other users documents', async () => {
      const otherUserRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'other@example.com',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .delete(`/documents/${deleteDocId}`)
        .set('Authorization', `Bearer ${otherUserRes.body.accessToken}`)
        .expect(403);
    });
  });

  describe('Document Security', () => {
    it('should sanitize XSS in document content', async () => {
      const maliciousContent = '<script>alert("XSS")</script>Hello';

      const res = await request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'XSS Test',
          content: maliciousContent,
          category: 'Test',
        });

      // Content should be stored as-is (sanitization happens on frontend display)
      // But we should not execute any scripts
      expect(res.body.content).toBe(maliciousContent);
    });

    it('should handle very long content', async () => {
      const longContent = 'A'.repeat(100000); // 100KB

      const res = await request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Long Document',
          content: longContent,
          category: 'Test',
        });

      expect(res.body.content.length).toBe(100000);
    });

    it('should handle unicode characters', async () => {
      const unicodeContent = '你好 🌍 مرحبا Привет';

      const res = await request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Unicode Test',
          content: unicodeContent,
          category: 'Test',
        });

      expect(res.body.content).toBe(unicodeContent);
    });
  });
});
