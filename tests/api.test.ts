/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import { buildApp } from '../server';

// Mock Firebase Admin Auth
vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: vi.fn().mockImplementation((token) => {
      if (token === 'valid_mock_token') {
        return Promise.resolve({ uid: 'mock_uid', email: 'test@example.com' });
      }
      if (token === 'valid_admin_token') {
        return Promise.resolve({ uid: 'mock_admin', email: 'admin@example.com' });
      }
      if (token === 'valid_complete_token') { // Special token we use to test progress completion
        return Promise.resolve({ uid: 'mock_uid_1', email: 'user1@example.com' });
      }
      return Promise.reject(new Error('Invalid token'));
    })
  })
}));

// Mock Firebase Admin App
vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn()
}));

// Initialize the app for testing
let app: any;

beforeAll(async () => {
  app = await buildApp();
  
  // We need to inject an admin user in the db for the admin tests to pass
  const { db } = await import('../src/db/index');
  const { users } = await import('../src/db/schema');
  try {
    db.insert(users).values({
      id: 'mock_admin',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date()
    }).onConflictDoNothing().run();
  } catch (e) {
    console.error(e);
  }
});

describe('API Health', () => {
  it('should return healthy on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.db).toBe('connected');
  });
});

describe('API Auth', () => {
  it('should reject unauthenticated requests to protected endpoints', async () => {
    const res = await request(app).get('/api/user/dashboard-summary');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized. Please sign in.');
  });

  it('should reject invalid tokens', async () => {
    const res = await request(app)
      .get('/api/user/dashboard-summary')
      .set('Authorization', 'Bearer invalid_token');
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired token.');
  });

  it('should allow valid tokens and populate user dashboard summary', async () => {
    const res = await request(app)
      .get('/api/user/dashboard-summary')
      .set('Authorization', 'Bearer valid_mock_token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('vault');
    expect(res.body).toHaveProperty('stats');
    expect(res.body).toHaveProperty('progress');
  });
});

describe('API Admin Verification', () => {
  it('should reject non-admin users from admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/system/users')
      .set('Authorization', 'Bearer valid_mock_token');
    
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden. Admin access required.');
  });

  it('should allow admin users to access admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/system/users')
      .set('Authorization', 'Bearer valid_admin_token');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('API Progress Save/Resume & Dashboard Integration', () => {
  it('should mark progress as stated', async () => {
    const res = await request(app)
      .post('/api/progress/financial_literacy/budget')
      .set('Authorization', 'Bearer valid_complete_token')
      .send({ status: 'started', stepReached: 1, savedData: { budget: 100 } });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await request(app)
      .get('/api/progress')
      .set('Authorization', 'Bearer valid_complete_token');
    
    expect(checkRes.status).toBe(200);
    const item = checkRes.body.find((p: any) => p.module === 'financial_literacy' && p.actionId === 'budget');
    expect(item).toBeDefined();
    expect(item.status).toBe('started');
    expect(item.stepReached).toBe(1);
  });

  it('should mark progress as completed and trigger blockchain credential issuance', async () => {
    const res = await request(app)
      .post('/api/progress/financial_literacy/budget')
      .set('Authorization', 'Bearer valid_complete_token')
      .send({ status: 'completed', stepReached: 2 });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const dbSumRes = await request(app)
      .get('/api/user/dashboard-summary')
      .set('Authorization', 'Bearer valid_complete_token');
    
    expect(dbSumRes.status).toBe(200);
    
    // Check progress
    const item = dbSumRes.body.progress.find((p: any) => p.module === 'financial_literacy' && p.actionId === 'budget');
    expect(item).toBeDefined();
    expect(item.status).toBe('completed');

    // Check credential issuance
    const credentials = dbSumRes.body.blockchain?.credentials || [];
    const cred = credentials.find((c: any) => c.type === 'financial_literacy_budget_completion');
    expect(cred).toBeDefined();
    expect(cred.issuer).toBe('System');
  });
});
