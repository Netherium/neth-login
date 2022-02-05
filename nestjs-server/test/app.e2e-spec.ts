import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { getConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../src/auth/dto/register.dto';
import { LoginDto } from '../src/auth/dto/login.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.useLogger(false);
    configService = app.get(ConfigService);
    await getConnection().synchronize(true);
    await app.init();
  });

  afterAll(async () => {
    await getConnection().query('DROP TABLE "user";');
    await app.close();
  });

  describe('AppController', () => {
    it('GET / should return 404', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });
  });

  describe('AuthController', () => {
    it('POST /auth/register with new user, expect 201 with token', async () => {
      const registeredUser1: RegisterDto = {
        email: 'test1@test.com',
        fullName: 'TESTUSER1',
        password: 'qwerty12',
      };
      const authRequest = await request(app.getHttpServer()).post('/auth/register').send(registeredUser1);
      expect(authRequest.statusCode).toEqual(201);
      expect(authRequest.body).toHaveProperty('token');
    });

    it('POST /auth/register with existing user, expect 422, Unprocessable Entity', async () => {
      const registeredUser1: RegisterDto = {
        email: 'test1@test.com',
        fullName: 'TESTUSER1',
        password: 'qwerty12',
      };
      const authRequest = await request(app.getHttpServer()).post('/auth/register').send(registeredUser1);
      expect(authRequest.statusCode).toEqual(422);
      expect(authRequest.body.message).toEqual('Unprocessable Entity');
    });

    it('POST /auth/register with validation errors, expect 400, Bad Request, with 9 errors', async () => {
      const authRequest = await request(app.getHttpServer()).post('/auth/register').send({});
      expect(authRequest.statusCode).toEqual(400);
      expect(authRequest.body.message).toEqual('Bad Request');
      expect(authRequest.body.error.length).toEqual(9);
    });

    it('POST /auth/login with user, expect 201, Ok, with token', async () => {
      const registeredUser2: RegisterDto = {
        email: 'test2@test.com',
        fullName: 'TESTUSER2',
        password: 'qwerty12',
      };
      await request(app.getHttpServer()).post('/auth/register').send(registeredUser2);

      const loginUser2: LoginDto = {
        email: registeredUser2.email,
        password: registeredUser2.password,
      };
      const loginRequest = await request(app.getHttpServer()).post('/auth/login').send(loginUser2);
      expect(loginRequest.statusCode).toEqual(201);
      expect(loginRequest.body).toHaveProperty('token');
    });

    it('POST /auth/login with empty body', async () => {
      const loginRequest = await request(app.getHttpServer()).post('/auth/login').send({});
      expect(loginRequest.statusCode).toEqual(401);
      expect(loginRequest.body.message).toEqual('Unauthorized');
    });

    it('POST /auth/login with validation errors, expect 400, Bad Request, with 3 errors', async () => {
      const invalidUser: LoginDto = {
        email: 'test',
        password: 'qwert',
      };
      const loginRequest = await request(app.getHttpServer()).post('/auth/login').send(invalidUser);
      expect(loginRequest.statusCode).toEqual(400);
      expect(loginRequest.body.message).toEqual('Bad Request');
      expect(loginRequest.body.error.length).toEqual(3);
    });

    it('GET /auth/profile with validation errors, expect 200, Ok, with 3 errors', async () => {
      const registeredUser3: RegisterDto = {
        email: 'test3@test.com',
        fullName: 'TESTUSER3',
        password: 'qwerty12',
      };
      await request(app.getHttpServer()).post('/auth/register').send(registeredUser3);

      const loginUser3: LoginDto = {
        email: registeredUser3.email,
        password: registeredUser3.password,
      };
      const loginRequest = await request(app.getHttpServer()).post('/auth/login').send(loginUser3);

      const profileRequest = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${loginRequest.body.token}`);
      expect(profileRequest.statusCode).toEqual(200);
      expect(profileRequest.body).toHaveProperty('id');
      expect(profileRequest.body).toHaveProperty('email');
      expect(profileRequest.body).toHaveProperty('fullName');
      expect(profileRequest.body).toHaveProperty('createdAt');
      expect(profileRequest.body).toHaveProperty('updatedAt');
    });

    it('GET /auth/profile with no token, expect 401, Unauthorized', async () => {
      const profileRequest = await request(app.getHttpServer()).get('/auth/profile');
      expect(profileRequest.statusCode).toEqual(401);
      expect(profileRequest.body.message).toEqual('Unauthorized');
    });

    it('GET /auth/profile over THROTTLE_LIMIT, expect 422, Too Many Requests', async () => {
      // Exceed the THROTTLE_LIMIT, doing dummy requests
      const throttleLimit = configService.get('THROTTLE_LIMIT');
      for (let i = 0; i < throttleLimit; i++) {
        await request(app.getHttpServer()).get('/auth/profile');
      }
      const profileRequest = await request(app.getHttpServer()).get('/auth/profile');
      expect(profileRequest.statusCode).toEqual(429);
      expect(profileRequest.body.message).toEqual('ThrottlerException: Too Many Requests');
    });
  });
});
