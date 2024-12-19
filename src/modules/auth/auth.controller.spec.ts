import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        fullname: 'Test User',
      };
      const mockRequest = { body: mockUser };
      const expectedResult: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        fullname: 'Test User',
      };

      jest.spyOn(service, 'register').mockResolvedValue(expectedResult as User);

      const result = await controller.register(mockRequest);
      expect(result).toBe(expectedResult);
      expect(service.register).toHaveBeenCalledWith(mockUser);
    });

    it('should handle registration failure', async () => {
      const mockRequest = { body: {} };
      jest
        .spyOn(service, 'register')
        .mockRejectedValue(new Error('Registration failed'));

      await expect(controller.register(mockRequest)).rejects.toThrow(
        'Registration failed',
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        access_token: 'jwt_token',
        user: { id: '1', email: 'test@example.com' },
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);
      expect(result).toBe(expectedResult);
      expect(service.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });

    it('should handle invalid login credentials', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
