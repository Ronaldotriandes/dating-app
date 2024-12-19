import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// interface UserDto {
//   id: string;
//   fullname: string;
//   gender: string;
//   email: string;
//   password: string;
//   bio: string;
//   profile_picture: string;
//   created_at: Date;
//   is_verified: string;
//   last_login: Date; // Changed from string to Date
// }
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            swipeUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          id: '1',
          fullname: 'Test User',
          gender: 'male',
          email: 'test@example.com',
          password: 'password',
          bio: 'Test bio',
          profile_picture: 'test.jpg',
          created_at: new Date(),
          is_verified: 'false',
          last_login: new Date().toISOString(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a single user', async () => {
      const result = { id: '1', name: 'Test User' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findById('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('swipeUser', () => {
    it('should process user swipe', async () => {
      const mockRequest = { params: { id: '1' } };
      const mockBody = { swipe_type: 'right' };
      const result = { matched: true };

      jest.spyOn(service, 'swipeUser').mockResolvedValue(result);

      expect(await controller.swipeUser(mockRequest, mockBody)).toBe(result);
      expect(service.swipeUser).toHaveBeenCalledWith('1', 'right');
    });

    it('should handle invalid swipe type', async () => {
      const mockRequest = { params: { id: '1' } };
      const mockBody = { swipe_type: 'invalid' };

      jest
        .spyOn(service, 'swipeUser')
        .mockRejectedValue(new Error('Invalid swipe type'));

      await expect(controller.swipeUser(mockRequest, mockBody)).rejects.toThrow(
        'Invalid swipe type',
      );
    });
  });
});
