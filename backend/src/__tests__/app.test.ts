import request from 'supertest';
import { App } from '../app';

describe('App', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  });

  afterAll((done) => {
    app.server.close(done);
  });

  describe('Health Check', () => {
    it('should return 200 on health endpoint', async () => {
      const response = await request(app.getApp())
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('API Documentation', () => {
    it('should redirect to API docs from root', async () => {
      await request(app.getApp())
        .get('/')
        .expect(302);
    });

    it('should serve swagger spec', async () => {
      const response = await request(app.getApp())
        .get('/swagger.json')
        .expect(200);

      expect(response.body).toHaveProperty('openapi');
      expect(response.body).toHaveProperty('info');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app.getApp())
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app.getApp())
        .options('/health')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
}); 