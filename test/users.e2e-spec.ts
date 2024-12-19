import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Dating App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Users', () => {
    it('/users (POST) - should create new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          age: 25,
        })
        .expect(201);
    });

    it('/users (GET) - should get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('/users/:id (GET) - should get user by id', () => {
      return request(app.getHttpServer()).get('/users/1').expect(200);
    });
  });

  describe('Matches', () => {
    it('/matches (POST) - should create new match', () => {
      return request(app.getHttpServer())
        .post('/matches')
        .send({
          userId: 1,
          targetUserId: 2,
        })
        .expect(201);
    });

    it('/matches (GET) - should get user matches', () => {
      return request(app.getHttpServer())
        .get('/matches?userId=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('Profile', () => {
    it('/profile (PUT) - should update user profile', () => {
      return request(app.getHttpServer())
        .put('/profile')
        .send({
          userId: 1,
          bio: 'Updated bio',
          interests: ['coding', 'hiking'],
        })
        .expect(200);
    });

    it('/profile/:id (GET) - should get user profile', () => {
      return request(app.getHttpServer()).get('/profile/1').expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
