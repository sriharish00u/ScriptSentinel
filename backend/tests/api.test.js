const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(30000);

describe('ScriptSentinel API Integration Tests', () => {
  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('ScriptSentinel');
  });

  it('POST /api/v1/scan/text should detect flagged terms and provide safe alternatives', async () => {
    const payload = {
      text: 'Hey guys! Today I am revealing my secret cure for fast weight loss and how to win our crypto giveaway!',
      platform: 'all',
    };

    const res = await request(app)
      .post('/api/v1/scan/text')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.flaggedCount).toBeGreaterThanOrEqual(3);
    expect(res.body.data.shadowbanRiskScore).toBeGreaterThan(50);
    expect(res.body.data.safeRewrittenText).toContain('wellness journey');
    expect(res.body.data.safeRewrittenText).toContain('community rewards program');
  });

  it('GET /api/v1/scan/terms should return list of restricted terms', async () => {
    const res = await request(app).get('/api/v1/scan/terms?limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/policies should return platform policy summaries', async () => {
    const res = await request(app).get('/api/v1/policies');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/pseo/page/:slug should return dynamic programmatic SEO page data', async () => {
    const res = await request(app).get('/api/v1/pseo/page/is-diet-banned-on-tiktok-ads');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.h1).toContain('Diet');
    expect(res.body.data.faqItems.length).toBeGreaterThan(0);
  });
});
